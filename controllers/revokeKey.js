import { Key } from "../model/AccessKey.js"
import { User } from "../model/User.js"

export const revokeKey = async (req, res) => {
    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => catchErr(res, 500)))
    if (!user) return res.status(404).json({
        status: "Failed",
        message: "This user doesn\'t exist"
    })

    // check to see if user has permission to access this route
    if (req.user.role !== 'admin') return res.status(401).json({
        status: "Failed",
        message: "User does not have access to this page"
    }) 

    // check if access key was sent in url
    if (!req.query.access_key) return res.status(404).json({
        status: "Failed",
        message: "Access key not found"
    })

    // check if access key exists and update it's status to revoked
    const accessKey = await Key.findOne({ accessKey: req.query.access_key }).catch((err => res.status(500).json({
        message: "Failed",
        message: "Internal server error"
    })))
    if (!accessKey) return res.status(404).json({
        status: "Failed",
        message: "Access key does not exist"
    })

    accessKey.status = 'revoked'
    await accessKey.save().catch((err => res.status(500).json({
        message: "Failed",
        message: "Internal server error"
    })))

    return res.status(200).json({
        status: "Success",
        message: "Access key revoked successfully",
        key: accessKey
    })
}