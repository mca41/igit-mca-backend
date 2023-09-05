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
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = getStorage();
const profileImagesRef = ref(storage, "/images/profileImages")

const admin = require('firebase-admin');
const serviceAccount = require('../firebase/firebaseAdminSdk');
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
});
const authorizeUser = require("../middlewares/authorizeUser")
router.post("/createUser",
   upload.single('imageFile'),
   async (req, res) => {
      try {
         const textData = JSON.parse(req.body.textData);
         // credentials
         // need to validate credentials
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
                  const uploadProfilePicRef = ref(profileImagesRef, `${batch}/${docGivenName}`);
                  uploadBytes(uploadProfilePicRef, bufferData, metaData).then((snapshot) => {
                     getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        newUser.profilePic = {
                           givenName: docGivenName,
                           url: downloadURL
                        }
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

// ROUTE 2 :: Login user by google Sign in
router.post("/loginViaGoogle", async (req, res) => {
   try {
      const decodedToken = await admin.auth().verifyIdToken(req.body.uid);
      const email = decodedToken.email; // User's email
      const isExist = await User.findOne({ email });
      if (isExist) {
         // --- Create JWT token ---
         const data = { userId: isExist._id };
         const token = jwt.sign(data, process.env.JWT_SECRET_CODE)
         const user = await User.findById(isExist._id).select("-userDetails.password");
         res.json({
            success: true,
            message: "Signed in successfully",
            token,
            user
         })
      } else {
         res.status(404).json({
            success: false,
            message: "User does not exists",
         })
      }
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Some internal server occurred! Try after some time"
      })
   }
})

// ROUTE 3 :: Login by email & password manually
router.post("/loginManually", async (req, res) => {
   try {
      const { email, password } = req.body;
      const isExist = await User.findOne({ email });
      if (isExist) {
         // verify user password
         const isPassMatched = bcrypt.compareSync(password, isExist.userDetails.password);
         if (isPassMatched) {
            const data = { userId: isExist._id };
            const token = jwt.sign(data, process.env.JWT_SECRET_CODE)
            const user = await User.findById(isExist._id).select("-userDetails.password");
            res.json({
               success: true,
               message: "Signed in successfully",
               token,
               user
            })
         } else {
            res.status(401).json({
               success: false,
               message: "Email or password is wrong",
            })
         }
      }else{
         // user not found
         res.status(404).json({
            success: false,
            message: "User does not exists",
         })
      }
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Some internal server occurred! Try after some time"
      })
   }
})

//ROUTE 4 :: fetch user
router.get("/fetchUser", authorizeUser, async (req,res)=>{
   //console.log(req.userId);
   res.json({
      message : "hello"
   })
})

module.exports = router;