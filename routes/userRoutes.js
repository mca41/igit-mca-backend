require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const checKFormData = require("../middlewares/formData");
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/createUser",
   // verifying credentials
   [
      body('fName', "Enter a valid name").isLength({ min: 3 }),
      body('email', "Enter a valid email").isEmail(),
      body('password', "Enter password at least 5 characters").notEmpty().isLength({ min: 5 })
   ]
   , checKFormData,
   async (req, res) => {
      try {
         // credentials
         // need to validate credentials
         const { email, password, batch, lName, fName, regNum, fieldOfInterest, gradCourse, homeDist, linkedInLink, githubLink, mobile, profilePic, rollNum, tag } = req.body;
         // Step 1 : check if user email already exists
         const isExists = await User.findOne({ email: req.body.email })
         if (isExists) {
            res.status(409).json({
               success: false,
               message: "User already exists. Please login!"
            });
         } else {
            // --- Hash the password ----
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            const newUser = new User({
               email, batch,
               userDetails: {
                  fName, lName, homeDist, regNum, mobile,
                  password: hashedPassword,
                  socialLinks: {
                     linkedInLink, githubLink
                  }
               },
               fieldOfInterest, tag, gradCourse, rollNum
            })
            await newUser.save();
            // --- Create JWT token ---
            const data = { userId: newUser._id };
            const token = jwt.sign(data, process.env.JWT_SECRET_CODE)
            res.json({
               success: true,
               message: "user created",
               user: newUser,
               token
            })
         }
      } catch (error) {
         res.status(500).json({
            success: false,
            message: "internal server error! please try after some time",
         })
      }
});





module.exports = router;