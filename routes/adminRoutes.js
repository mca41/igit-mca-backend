require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const authorizeUser = require("../middlewares/authorizeUser")
const { isAdmin } = require("../middlewares/isAdmin")

router.get("/fetchAccounts", authorizeUser, isAdmin ,async (req, res) => {
    try {

        let {unverified} = req.query;
        let accountVerificationStatus = ( !unverified  ? 0 : req.query.unverified === "true" ? 0 : 1); // true or false // !unverified means not defined
        let batch = (req.query.batch === "all" ? null : parseInt(req.query.batch));

        let userAccounts;
        if (batch === null) {
            const findUser = await User.find({
                status: accountVerificationStatus
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
                    batchNum: batch
                });
                if (!findBatch) {
                    userAccounts = []; // there is no batch
                } else {
                    const findUser = await User.find({
                        status: accountVerificationStatus,
                        batchId: findBatch._id,
                    }).select("-userDetails.password")
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
            }
        })
    } catch (error) {
        console.log("There is some error in fetching user accounts :", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
});

router.post("/admin/verifyUser", authorizeUser, isAdmin, async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials! # There must be a userId to verify"
            })
        }
        const findUser = await User.findById(userId);
        if (findUser.status === 1) {
            return res.status(400).json({
                success: false,
                message: "User already verified! # "
            })
        }
        findUser.status = 1;
        await findUser.save();
        // --------- Email User ------------

        // --------- Email User ------------
        return res.json({
            success: true,
            message: "User verified successfully! #"
        })
    } catch (error) {
        console.log("There is some error in verifying user accounts :", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
})














module.exports = router;