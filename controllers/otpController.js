import { transporter } from '../config/mailer.js';
import { User } from '../model/User.js';
import OTP from '../model/otp.js';
import bcrypt from 'bcrypt'

// Controller function to generate OTP
export const generateOTP = async (req, res, next) => {
    const { email } = req.body

    if (!email) return res.status(500).json({
        status: "Failed",
        message: "No data received"
    })
    

    const user = await User.findOne({ email: email }).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
    if (!user) return res.status(404).json({
        status: "Failed",
        message: "This email is not registered"
    })

    const strings = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var otp = ""

    for (let i = 0; i < 4; i++){
        otp += strings[Math.floor(Math.random() * 10) % strings.length]
    }

    // send OTP to user mail
    await transporter.sendMail({
        from: '"Access Key Manager" <eugeneatinbire@gmail.com>',
        to: ' <' + email + '>',
        subject: "Reset Password",
        html: "<div><p>Hi,</p><p>Your OTP is: " + otp +"</p></div>"
    }).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    // encrypt OTP and store it in database
    const hashedOTP = await bcrypt.hash(otp, 10).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
    if (!hashedOTP) return res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })

    const date = new Date()
    const expiry = date.setDate(date.getDate() + 1)

    const newOTP = await OTP.create({
        otp: hashedOTP,
        expiry: expiry
    }).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))

    await user.otp.push(newOTP)
    await user.save().catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    res.status(200).json({
        status: "success",
        message: "OTP delivered",
        email: email
    })
};

// Controller function to validate OTP
export const validateOTP = async (req, res, next) => {
    // const { OTP, email } = req.body
    // if (!OTP || !email) return catchErr(res, 'No data received', 500)

    // // check if user with email exists
    // const user = await User.findOne({ email: email }).catch(err => catchErr(res, 500))
    // if (!user) return catchErr(res, 'This email is not registered to Micro-Focus inc', 404)

    // // Verify if OTP is valid
    // const isAuthorised = await bcrypt.compare(OTP, user.reset_OTP)
    // if (!isAuthorised) return catchErr(res, 'Incorrect OTP', 401)

    // // remove otp after verifying it
    // user.reset_OTP = 'null'
    // await user.save().catch((err) => next(res, "Failed to remove used OTP", 500))

    // return res.status(200).json({
    //     status: "Success",
    //     message: "OTP succesful verified"
    // })

    try {
        const { otp, email } = req.body;

        if (!otp || !email) return res.status(500).json({
            status: "Failed",
            message: "Incomplete data received"
        })

        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({
            status: "Failed",
            message: "This email is not registered to access key manager"
        })

        const existingOTP = await user.populate({ path: 'otp' })
        const retrievedOTP = existingOTP.otp[0]
        console.log(retrievedOTP)

        const isAuthorised = await bcrypt.compare(otp, retrievedOTP.otp)
        if (!isAuthorised) return res.status(401).json({
            status: "Failed",
            message: "Incorrect OTP"
        })

        const now = new Date();
        if (retrievedOTP.expiry > now) {
            await OTP.findOneAndDelete({ otp: retrievedOTP.otp })
            res.status(200).json({ 
                status: "success",
                message: 'OTP is valid' 
            });
        } else {
            await OTP.findOneAndDelete({ otp: retrievedOTP.otp })
            res.status(400).json({ 
                status: "Failed",
                message: 'OTP has expired' });
        }        
    } catch (err) {
        console.log(err.stack)
        return res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        })
    }
};
