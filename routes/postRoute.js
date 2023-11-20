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
            data: {
                post: newPost
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


router.get("/fetchPosts", authorizeUser, async (req, res) => {
    try {
        const { postType } = req.query;
        if (!postType) {
            return res.status(401).json({
                success: false,
                message: "Not post type provided in query"
            })
        }
        const findPosts = await Post.find({postType:"gallery"})

        return res.json({
            success:true,
            message: `All ${postType} posts sent`,
            data : {
                postsLength : findPosts.length,
                posts : findPosts.reverse()
            }        
        })

    } catch (error) {
        console.log("Some error in fetching post : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})


router.delete("/deletePost", authorizeUser, async (req,res)=>{
    try {
       const userId = req.userId;
       const {postId} = req.query;

       const findUser = await User.findById(userId);
       if (findUser.isSpecialUser !== "admin") {
         return res.status(400).json({
            success : false,
            message : "Not authorized to perform task # User can't perform this delete task"
         })
       }

       if (!postId) {
          return res.status(401).json({
            success : false,
            message : "No post id provided # there should be a postId to delete post"
          })
       }

       await Post.findByIdAndDelete(postId)
        return res.json({
            success:true,
            message : "Post deleted! successfully"
        })
    } catch (error) {
        console.log("Some error in deleting post : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})

module.exports = router;