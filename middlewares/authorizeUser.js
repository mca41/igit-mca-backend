require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authorizeUser = async (req, res, next) => {
    try {
        const authToken = req.headers.token;
        if (!authToken) {
           return res.status(401).json({
                success: false,
                message: "unauthorized access"
            })
        } else {
            //token found -> check token
            const tokenData = jwt.verify(authToken, process.env.JWT_SECRET_CODE, function (err, decoded) {
                if (err) {
                    return "not verified";
                } else {
                    return decoded;
                }
            });

            // token data looks something like bellow after jwt verify
            //tokenData = { userId: '64ece6173b49e65733af30a7', iat: 1693247934 } <-- this is something formed when assigning token id
            if (tokenData === "not verified") {
                return res.status(401).json({
                    success: false,
                    message: "unauthorized access"
                })
            } else {
                // user verified and userId added to request

                // here you can also check whether user is actually exists in database :: Just for extra security 
                const findUser = await User.findById(tokenData.userId);
                if (!findUser) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                }
                req.userId = tokenData.userId;
                next()
            }
        }
    } catch (error) {
        res.status(505).json({
            success: false,
            message: "Some error occurred",
        })
    }
}

module.exports = authorizeUser;