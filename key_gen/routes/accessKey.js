const express = require('express');
const router = express.Router();
const AccessKey = require('../models/AccessKey');

// Generate a new access key
router.post('/', async (req, res) => {
    const { validDurationMinutes } = req.body;
    const expiry = new Date(Date.now() + validDurationMinutes * 60000); // Convert minutes to milliseconds
    const accessKey = new AccessKey({ expiry });

    try {
        await accessKey.save();
        res.status(201).json(accessKey);
    } catch (error) {
        res.status(500).json({ error: 'Error creating access key' });
    }
});

// Get access key status
router.get('/:access_key', async (req, res) => {
    try {
        console.log('Fetching access key with access_key:', req.params.access_key);
        const accessKey = await AccessKey.findOne({ access_key: req.params.access_key });

        if (!accessKey) {
            console.log('Access key not found');
            return res.status(404).json({ error: 'Access key not found' });
        }

        if (accessKey.status !== 'revoked' && new Date() > accessKey.expiry) {
            accessKey.status = 'expired';
            await accessKey.save();
        }

        res.json({ status: accessKey.status });
    } catch (error) {
        console.error('Error fetching access key:', error);
        res.status(500).json({ error: 'Error fetching access key' });
    }
});

// Revoke an access key
router.patch('/:access_key/revoke', async (req, res) => {
    try {
        console.log('Revoking access key with access_key:', req.params.access_key);
        const accessKey = await AccessKey.findOne({ access_key: req.params.access_key });

        if (!accessKey) {
            console.log('Access key not found');
            return res.status(404).json({ error: 'Access key not found' });
        }

        accessKey.status = 'revoked';
        await accessKey.save();

        res.json({ status: accessKey.status });
    } catch (error) {
        console.error('Error revoking access key:', error);
        res.status(500).json({ error: 'Error revoking access key' });
    }
});

module.exports = router;