const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
    // this function meant to be used only after authorizeUser middleware
    try {
        const userId = req.userId;
        const findUser = await User.findById(userId);
        const {isSpecialUser} = findUser;
        if (isSpecialUser === "admin" || isSpecialUser === "batchAdmin" || isSpecialUser === "superAdmin") {
           return next();
        }
        return res.status(403).json({
             success:false,
             message:"Unauthorized access! # Not a admin!"
         })
    } catch (error) {
        console.log("There is some error in checking in isAdmin : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


module.exports = { isAdmin };