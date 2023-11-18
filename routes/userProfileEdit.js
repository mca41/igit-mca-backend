const express = require("express");
const router = express.Router();
const authorizeUser = require("../middlewares/authorizeUser");
const User = require("../models/userModel")

// Delete profile picture
router.delete("/profilePicture", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const findUser = await User.findById(userId);
        findUser.profilePic.givenName = ""
        findUser.profilePic.url = ""
        await findUser.save();

       return res.json({
            success: true,
            message: "Profile pic deleted. #"
        })
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})

// update profile picture
router.put("/profilePicture", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const {url, givenName} = req.body;
        if (!url || !givenName) {
            return res.status(400).json({
                success:false,
                message:"Invalid credentials #"
            })
        }
        const findUser = await User.findByIdAndUpdate(userId,{
            profilePic : {
                givenName ,
                url
            }
        });
        await findUser.save();
        return res.json({
            success:true,
            message:"Profile picture updated successfully. #"
        })
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})

module.exports = router;