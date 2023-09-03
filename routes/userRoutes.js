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
const { initializeApp } = require('firebase/app'); // require firebase
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage"); // getting required services from firestore
const firebaseConfig = require("../firebase/firebaseConfig");
const randomString = require("randomstring");

// --- firebase APP --
const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp); //points to root directory 
const profileImagesRef = ref(storage, "/images/profileImages")
// for 41 it will be images/profileImages/41/image-url

router.post("/createUser",
   upload.single('imageFile'),
   async (req, res) => {
      const textData = JSON.parse(req.body.textData);
      const imageFile = req.file;
      console.log(textData);
      console.log(imageFile);
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
            // ---------- save file here -------
             // --- Create JWT token ---
             const data = { userId: newUser._id };
             const token = jwt.sign(data, process.env.JWT_SECRET_CODE)
            let userProfileUrl;
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
               let uploadTask;
               if (fileType === "image/jpeg" || fileType === "image/png") {
                  const uploadProfilePicRef = ref(profileImagesRef, `/${docGivenName}`);
                  uploadTask = uploadBytes(uploadProfilePicRef, bufferData, metaData);
                  uploadTask.then((snapshot) => {
                     getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                         userProfileUrl = downloadURL;
                         console.log(downloadURL);
                        // save profile picture url to users collection
                        // newUser.profilePic.givenName = docGivenName ;
                        // newUser.profilePic.url = downloadURL ;
                         newUser.profilePic = {
                           givenName : docGivenName,
                           url : downloadURL
                        }
                        console.log(newUser);
                        await newUser.save();
                        res.json({
                           success: true,
                           message: "user created",
                           user: newUser,
                           token
                        })
                     })
                  }).catch(async (error)=>{
                     console.log(error);
                     await newUser.save();
                     res.json({
                        success: true,
                        message: "Firebase error came",
                        user: newUser,
                        token
                     })
                  })
               }
               // profile pic upload ends
            }else{
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