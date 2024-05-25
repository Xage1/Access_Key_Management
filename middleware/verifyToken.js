// verify user using token
export const verifyToken = (req, res, next) => {
    //Retrieves token from request header
    try {
        const token = req.headers['authorization'].split(' ')[1]

        //token is decrypted with private key to verify user
        const decoded = jwt.verify(token, process.env.PRIVATEKEY, (err, acc) => {
            if (err) return res.status(401).json({
                status: "Failed",
                message: "User is not logged in"
            })

            //user is sent back through req if verified
            req.user = acc;
            next()
        })
    } catch (err) {
        res.status(404).json({
            status: "Failed",
            message: "No token found"
        })
    }    
}