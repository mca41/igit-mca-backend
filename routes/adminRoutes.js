require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const authorizeUser = require("../middlewares/authorizeUser");
const { isAdmin } = require("../middlewares/isAdmin");
const {
  sendAccountVerifiedMail,
} = require("../helper/sendMail");


// --- firebase App setup --
const firebaseConfig = require("../firebase/firebaseConfig");
const { initializeApp } = require("firebase/app");
const app = initializeApp(firebaseConfig);
const {
  getStorage,
  ref,
  deleteObject,
} = require("firebase/storage");
const storage = getStorage(app);


router.get("/fetchAccounts", authorizeUser, isAdmin, async (req, res) => {
  try {
    let { unverified } = req.query;
    let accountVerificationStatus = !unverified
      ? 0
      : req.query.unverified === "true"
      ? 0
      : 1; // true or false // !unverified means not defined
    let batch = req.query.batch === "all" ? null : parseInt(req.query.batch);

    let userAccounts;
    if (batch === null) {
      const findUser = await User.find({
        status: accountVerificationStatus,
      }).select("-userDetails.password");
      userAccounts = findUser;
    } else {
      // check if they have provide right batch num
      if (isNaN(batch)) {
        const findUser = await User.find({
          status: accountVerificationStatus,
        }).select("-userDetails.password");
        userAccounts = findUser;
      } else {
        const findBatch = await Batch.findOne({
          batchNum: batch,
        });
        if (!findBatch) {
          userAccounts = []; // there is no batch
        } else {
          const findUser = await User.find({
            status: accountVerificationStatus,
            batchId: findBatch._id,
          }).select("-userDetails.password");
          userAccounts = findUser;
        }
      }
    }
    return res.json({
      success: true,
      message: "Accounts data sent",
      data: {
        totalUserAccounts: userAccounts.length,
        userAccounts,
      },
    });
  } catch (error) {
    console.log("There is some error in fetching user accounts :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/admin/verifyUser", authorizeUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials! # There must be a userId to verify",
      });
    }
    const findUser = await User.findById(userId);
    if (findUser.status === 1) {
      return res.status(400).json({
        success: false,
        message: "User already verified! # ",
      });
    }
    findUser.status = 1;
    await findUser.save();

    // --------- Email User ------------
    const {email} = findUser;
    const {fName,lName,mName, name} = findUser.userDetails;
    const userName = name || fName + " " + mName + " " + lName;
    const isSent = await sendAccountVerifiedMail(email, userName);
    // --------- Email User ------------

    return res.json({
      success: true,
      message: "User verified successfully! #",
      isEmailSent : isSent
    });
  } catch (error) {
    console.log("There is some error in verifying user accounts :", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// This route deletes a user
router.delete("/admin/deleteUser", authorizeUser, isAdmin ,async (req,res)=>{
  try {
    const userId  = req.userId;
    const {deleteUserId, passKey} = req.query;
    if (!deleteUserId && !passKey) {
      return res.status(400).json({
        success : false,
        message : "No user Id given for deleting user. #"
      })
    }
    const deleteUserPassKey = process.env.DELETE_USER_PASS_KEY;
    if (deleteUserPassKey !== passKey) {
      return res.status(400).json({
        success : false,
        message : "No pass key or incorrect key!"
      })
    }
    const findUser = await User.findById(userId);
    if (findUser.isSpecialUser === "admin" || findUser.isSpecialUser === "superAdmin" ) {
       const findDeletingUser = await User.findById(deleteUserId);

       const {isSpecialUser, profilePic, batchNum, batchId} = findDeletingUser;
       
       // check if deleting user is a special user or not
       if (isSpecialUser === "admin" || isSpecialUser === "batchAdmin" || isSpecialUser === "superAdmin") {
        return res.status(401).json({
          success : false,
          message : "User can't be deleted because it is either admin or batchAdmin #"
        })
       }

      // -- delete user profile in firebase :: priority 1
      if (profilePic.url !== "") {
        await findDeletingUser.save()
        const deletePicRef = ref(storage, `images/profileImages/${batchNum}/${profilePic.givenName}`);
        deleteObject(deletePicRef).then(async ()=>{
          findDeletingUser.profilePic.url = "";
          findDeletingUser.profilePic.givenName = "";
        }).catch((error)=>{
          console.log("Some error occurred deleting users profile pic.", error);
        })
      }

      // -- decrease one user from corresponding batch -- priority 2
      const findBatch = await Batch.findById(batchId);
      findBatch.totalRegistered--;
      await findBatch.save();

      // -- delete user related post in gallery :: priority 3

      // -- email user that their account has been deleted :: priority 4

      // delete user finally
      await User.findByIdAndDelete(deleteUserId);
      return res.json({
        success : true,
        message : "User deleted successfully. #"
      })
    }

    // not a admin
    return res.status(401).json({
      success : false,
      message : "Batch admin can't perform delete task."
    })
  } catch (error) {
    console.log("Some error occurred in fetching user by ID : ", error);
    return res.status(500).json({
      success: false,
      message: "Some internal server occurred! Try after some time",
    });
  }
})




// for testing only
router.get("/admin/sendMail", async (req, res) => {
  //   await sendAccountCreatedMail()
  const { email,userName } = req.body;
//   const isSent = await emailNewUser(email, userName);
//   const userDetails = {
//     email,
//     name : userName,
//     batch : 41
//   }
//   console.log("is Alert " , isAlert);
//   console.log("is sent " , isSent);
  res.json({
    message: "Okay",
  });
});

module.exports = router;
