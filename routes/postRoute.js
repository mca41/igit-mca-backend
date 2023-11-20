require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");

const authorizeUser = require("../middlewares/authorizeUser");

router.post("/createNewPost", authorizeUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { postType, postUrl, postTitle, postDescription, timeStamp, docGivenName } = req.body;
        if (!postType || !postUrl || !postTitle || !timeStamp || !docGivenName) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials # There must be postType, postTitle, postUrl, timestamp, docGivenName in req.body"
            })
        }
        const newPost = new Post({
            postType,
            authorId: userId,
            createdAt: timeStamp,
            postDetails: {
                docGivenName,
                url: postUrl,
                title: postTitle,
                description: postDescription
            }
        })
        await newPost.save();

        res.json({
            success: true,
            message: "New post created.",
            data : {
                post : newPost
            }
        })

    } catch (error) {
        console.log("Some error in creating new post : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})

module.exports = router;