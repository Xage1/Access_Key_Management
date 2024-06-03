import crypto from 'crypto'
import { User } from '../model/User.js'
import { Key } from '../model/AccessKey.js'

export const generateKey = async (req, res) => {
    // generate a 16 character access key
    const accessKey = crypto.randomBytes(16).toString('hex')

    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    if (!user) return res.status(400).json({
        status: "Failed",
        message: "This user doesn't exist"
    })

    // check to see if an active access key already exists
    const activeKeys = await user.populate({ path: 'key', match: { status: 'active' }, select: 'keys'}).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    if ((activeKeys.key).length > 0) return res.status(400).json({
        status: "Failed",
        message: "Active key already exists"
    })

    const date = new Date()
    const expiry = date.setDate(date.getDate() + 90)

    // create a new access key
    const newKey = await Key.create({
        access_key: accessKey,
        created_At: new Date(),
        expiry: expiry
    }).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    // save access key
    await user.key.push(newKey)
    await user.save().catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    return res.status(201).json({
        status: "Success",
        message: "New access key created successfully",
        key: accessKey
    })
}