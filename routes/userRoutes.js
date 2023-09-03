require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer')
const multerStorage = multer.memoryStorage(); // Store the uploaded image in memory
const upload = multer({ multerStorage });
const saltRounds = 10;

const randomString = require("randomstring");

// --- firebase App setup --
const firebaseConfig = require("../firebase/firebaseConfig")
const { initializeApp } = require("firebase/app");
const app = initializeApp(firebaseConfig);
const { getStorage, ref, uploadBytes,getDownloadURL } = require("firebase/storage");
const storage = getStorage();
const profileImagesRef = ref(storage, "/images/profileImages")

// for 41 it will be images/profileImages/41/image-url

router.post("/createUser",
   upload.single('imageFile'),
   async (req, res) => {
      const textData = JSON.parse(req.body.textData);
      // console.log(textData);
      console.log(req.file);
      try {
         // credentials
         // need to validate credentials
         console.log("Form body");
         const { email, password, batch, lName, fName, regNum, fieldOfInterest, gradCourse, homeDist, linkedInLink, githubLink, mobile, rollNum, tag } = textData;
         // Step 1 : check if user email already exists
         const isExists = await User.findOne({ email })
         if (isExists) {
            res.status(409).json({
               success: false,
               message: "User with same email already exists. Please login!"
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
            // --- Create JWT token ---
            const data = { userId: newUser._id };
            const token = jwt.sign(data, process.env.JWT_SECRET_CODE)
            let userProfileUrl;
            // ---------- save file here -------
            if (req.file) {
               // profile pic 
               const fileType = req.file.mimetype;
               const fileOriginalName = req.file.originalname;
               const bufferData = req.file.buffer;
               const now = new Date();
               const dateStamp = now.toISOString();
               const randString = randomString.generate({ length: 12, charset: "alphanumeric" })
               const docGivenName = fileOriginalName + dateStamp + randString;
               const metaData = {
                  contentType: fileType
               }
               if (fileType === "image/jpeg" || fileType === "image/png") {
                  const uploadProfilePicRef = ref(profileImagesRef, `/${docGivenName}`);
                  //console.log(uploadProfilePicRef); // correct
                  //console.log(docGivenName);// correct
                  uploadBytes(uploadProfilePicRef, req.file.buffer, metaData).then((snapshot) => {
                     getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        console.log('Uploaded a blob or file!');
                        newUser.profilePic = {
                           givenName: docGivenName,
                           url: downloadURL
                        }
                        console.log(newUser);
                        await newUser.save();
                        res.json({
                           success: true,
                           message: "Account created successfully!",
                           user: newUser,
                           token
                        })
                     })
                  }).catch(async (err) => {
                     console.log(err);
                     await newUser.save();
                     res.json({
                        success: true,
                        message: "Account created but profile picture upload failed!",
                        user: newUser,
                        token
                     })
                  })
               }
               // profile pic upload ends
            } else {
               //console.log(userProfileUrl);
               await newUser.save();
               res.json({
                  success: true,
                  message: "user created",
                  user: newUser,
                  token
               })
            }
         }
      } catch (error) {
         console.log(error);
         res.status(500).json({
            success: false,
            message: "internal server error! please try after some time",
            error
         })
      }
   });




module.exports = router;