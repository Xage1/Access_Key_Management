const express = require('express');
const router = express.Router();
const AccessKey = require('../models/AccessKey');

//Generate a new access key
router.post('/', async (req, res) => {
    const { validDurationMinutes } = req.body;
    const expiry = new Date(Date.now() + validDurationMinutes * 6000); //Convert minutes to milliseconds
    const accessKey = new AccessKey({ expiry });

    try {
        await accessKey.save();
        res.status(201).json(accessKey);
    } catch (error) {
        res.status(500).json({ error: 'Error creating access key'});
    }
});

//Get access key status
router.get('/:id', async (req, res) => {
try {
    const accessKey = await AccessKey.findById(req.params.id);

    if (!accessKey) {
        return res.status(404).json({ error: 'Access key not found' });
    }

    if (accessKey.status !== 'revoked' && new Date() > accessKey.expiry) {
        accessKey.status = 'expired';
        await accessKey.save();
    }

    res.json(accessKey);
} catch (error) {
    res.status(500).json({ error: 'Error fetching access key'});
}
});

//Revoke an access key
router.patch('/:id/revoke', async (req, res) => {
    try {
        const accessKey = await AccessKey.findById(req.params.id);

        if (!accessKey) {
            return res.status(404).json({ error: 'Access key not found' });
        }
        accessKey.status = 'revoked';
        await accessKey.save();

        res.json(accessKey);
    } catch (error) {
        res.status(500).json({ error: 'Error revoking access key' });
    }
});

module.exports = router;