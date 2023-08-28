const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/createUser",async (req,res)=>{
   // console.log(req.body);
   // credentials 
   const {email,batch,lName,fName,regNum,fieldOfInterest, gradCourse,homeDist,linkedInLink,githubLink,mobile,profilePic,rollNum,tag} = req.body;
   // Step 1 : check if user email already exists
   const isExists = await User.findOne({email : req.body.email})
   if (isExists) {
      res.json({
         success : false,
         message : "User already exists. Please login!"
      });
   }else{
       const newUser = new User({
         email,batch, 
         userDetails : {
            fName, lName, homeDist, regNum, mobile,
            socialLinks : {
               linkedInLink, githubLink
            }
         },
         fieldOfInterest, tag , gradCourse, rollNum
       })
       await newUser.save();
       res.json({
         message:"user created",
         user :  newUser
      })
   }
});





module.exports = router;