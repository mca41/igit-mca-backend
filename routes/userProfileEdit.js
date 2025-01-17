const express = require("express");
const router = express.Router();
const authorizeUser = require("../middlewares/authorizeUser");
const User = require("../models/userModel")
const { getStorage, ref, deleteObject, uploadBytes, getDownloadURL, } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
// Delete profile picture
const firebaseConfig = require("../firebase/firebaseConfig")
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


router.delete("/profilePicture", authorizeUser, async (req, res) => {
    try {
        // const userId = req.userId;
        let {sameUser, editingUserId} = req.query;
        if (!sameUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials # sameUser credential not given."
            })
        }
        sameUser = sameUser === "true" ? true : false ;
        editingUserId = editingUserId === "null" ? null : editingUserId;
        if (
            (sameUser === false && !editingUserId) ||  // is editingUserId given
            (sameUser === false && editingUserId === null)  
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials # sameUser credential not given."
            })
        }
        
        const currentUserId = req.userId;
        let userId;

        if(sameUser !== true) {
            // when user is not itself --> Could be a admin
            // check whether other user is admin or super admin is
            let findAdminUser = await User.findById(currentUserId);
            if (findAdminUser.isSpecialUser === "admin" || findAdminUser.isSpecialUser === "superAdmin") {
                userId = editingUserId;
            }else{
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized attempt! #"
                })
            }
        }else{
            // when user is itself
            userId = currentUserId;
        }

        const findUser = await User.findById(userId);
        const batch = findUser.batchNum;
        const givenName = findUser.profilePic.givenName ;
        const deleteProfileImageRef = ref(storage, `images/profileImages/${batch}/${givenName}`) ;


        deleteObject(deleteProfileImageRef)
        .then(async () => {
            findUser.profilePic.givenName = "";
            findUser.profilePic.url = "";
            await findUser.save();
            return res.json({
                success: true,
                message: "Profile pic deleted. #"
            })
        })
        .catch((error) => {
            console.log("Error in deleting image", error);
            return res.json({
                success: false,
                message: "Some error in deleting Profile pic deleted. #"
            })
        });
    } catch (error) {
        console.log("There is some error in deleting profile picture ", error);
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})

// update profile picture
router.put("/profilePicture", authorizeUser, async (req, res) => {
    try {
        let {sameUser, editingUserId} = req.query;
        if (!sameUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials # "
            })
        }
        sameUser = sameUser === "true" ? true : false ;
        editingUserId = editingUserId === "null" ? null : editingUserId;
        if (
            (sameUser === false && !editingUserId) ||  // is editingUserId given if its not same user
            (sameUser === false && editingUserId === null)  
            ) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials #"
            })
        }
        const currentUserId = req.userId;
        let userId;
        if(sameUser !== true) {
            // when user is not itself --> Could be a admin
            // check whether other user is admin or super admin is 
            let findAdminUser = await User.findById(currentUserId);
            if (findAdminUser.isSpecialUser === "admin" || findAdminUser.isSpecialUser === "superAdmin") {
                userId = editingUserId;
            }else{
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized attempt! #"
                })
            }
        }else{
            // when user is itself
            userId = currentUserId;
        }

        const { url, givenName } = req.body;
        if (!url || !givenName) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials #"
            })
        }
        const findUser = await User.findById(userId);
        findUser.profilePic = {
            url,
            givenName
        }
        await findUser.save();
        return res.json({
            success: true,
            message: "Profile picture updated successfully. #"
        })
    } catch (error) {
        console.log("There is some error in updating profile picture ", error);
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})

// To update graduation course 
router.put("/gradCourse", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { gradCourse } = req.body;
        if (!gradCourse) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials. #"
            })
        }
        const findUser = await User.findById(userId);
        findUser.userDetails.gradCourse = gradCourse;
        await findUser.save();

        return res.json({
            success: true,
            message: "Graduation updated successfully. #"
        })

    } catch (error) {
        console.log("There is some error in updating profile picture ", error);
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})

// to update field of interest
router.put("/fieldOfInterest", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { fieldOfInterest } = req.body;
        if (!fieldOfInterest) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials. #"
            })
        }
        const findUser = await User.findById(userId);
        findUser.fieldOfInterest = fieldOfInterest;
        await findUser.save();

        return res.json({
            success: true,
            message: "Field of interest updated successfully. #"
        })

    } catch (error) {
        console.log("There is some error in updating filed of interest ", error);
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})


router.put("/socialLinks", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { socialLinks } = req.body;
        if (!socialLinks) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials. #"
            })
        }
        const {githubLink, linkedInLink} = socialLinks;
        const findUser = await User.findById(userId);
        findUser.userDetails.socialLinks = {
            githubLink, 
            linkedInLink
        }
        await findUser.save();

        return res.json({
            success: true,
            message: "Social link updated successfully. #"
        })
    } catch (error) {
        console.log("There is some error in updating filed of interest ", error);
        return res.status(505).json({
            success: false,
            message: "Some error occurred # internal server",
        })
    }
})


module.exports = router;