import { Key } from "../model/AccessKey.js"
import { User } from "../model/User.js"

export const allKeys = async (req, res) => {
    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    if (!user) return res.status(404).json({
        status: "Failed",
        message: "This user doesn't exist"
    })

    if (req.user.role === 'admin') {
        // Retrieve all keys from database
        const allKeys = await Key.find({}).catch((err => res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        })))

        return res.status(200).json({
            status: "success",
            message: "Keys retrieved successfully",
            keys: allKeys
        })
    }

    // Retrieve all keys from database belonging to user
    const Keys = await user.populate({ path: 'key'}).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))
    
    return res.status(200).json({
        status: "success",
        message: "Keys retrieved successfully",
        keys: Keys.key
    })
}