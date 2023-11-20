require("dotenv").config();
const express = require("express");
const router = express.Router();
const authorizeUser = require("../middlewares/authorizeUser");
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const Branch = require("../models/branchModel");
router.post("/createNewBatch", authorizeUser, async (req, res) => {
  try {
    const userId = req.userId;
    const isExist = await User.findById(userId);
    if (isExist) {
      // check if admin user is admin
      if (isExist.isSpecialUser === "admin") {
        // perform batch creation task
        // step 1 :: check if previously batch exists
        const { batchNum, strength, startingYear, endingYear } = req.body;
        const isBatchExist = await Batch.findOne({ batchNum });
        const isBatchStartingSameYear = await Batch.findOne({ startingYear });
        const isBatchEndingSameYear = await Batch.findOne({ endingYear });
        if (isBatchExist || isBatchStartingSameYear || isBatchEndingSameYear) {
          res.status(409).json({
            success: false,
            message:
              "Batch is already exist with same starting year or same ending year or same batch number",
            // batch : newBatch
          });
        } else {
          // create new batch
          const newBatch = new Batch({
            batchNum,
            startingYear,
            endingYear,
            strength,
          });
          await newBatch.save();
          // add that batch to the corresponding branch list
          // step1 : Check if that branch already exists or not?
          const isBranchExists = await Branch.findOne({ branch: "mca" });
          if (isBranchExists) {
            // branch already exists so just add new batch to existing branch
            // isBranchExists.allBatchIds.push(newBatch._id); // not use full
            // await isBranchExists.save();  // not use full
            res.json({
              success: true,
              message: `Batch created & added to ${isBranchExists.branch} branch !`,
              batch: newBatch,
            });
          } else {
            // create new branch & then add the batches Id to it
            let branch = "mca"; // new branch name mca :- It will be created only once
            const newBranch = new Branch({
              branch: branch,
              // allBatchIds: [newBatch._id],// not use full
            });
            await newBranch.save();
            res.json({
              success: true,
              message: "A new batch created successfully!",
              batch: newBatch,
            });
          }
        }
      } else {
        res.status(401).json({
          success: false,
          message: "unauthorized access! Only admin can create a new batch.",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "unauthorized access!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// this route sends lists of batches with all details :: authorization required here!!
router.get("/fetchAllBatch", authorizeUser, async (req, res) => {
  try {
    const findAllBatch = await Batch.find({ branch: "mca" });
    res.json({
      success: true,
      message: "All batches sent",
      batches: findAllBatch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// this route sends lists of batches with starting year & ending year :: No authorization required here! (For registration purpose only)
router.get("/fetchBatchLists", async (req, res) => {
  try {
    const findAllBatchLists = await Batch.find({ branch: "mca" }).select({
      studentLists: 0,
      // strength: 0,
      branch: 0,
    });
    res.json({
      success: true,
      message: "All batch lists sent!",
      batchLists: findAllBatchLists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
module.exports = router;

// ROUTE :: TO FETCH STUDENTS OF A BATCH
router.get("/:batchId/fetchStudents", authorizeUser, async (req, res) => {
  try {
    const batchId = req.params.batchId;
    // step 1 :: Check if batch exists or not
    const isBatchExists = await Batch.findById(batchId);
    if (isBatchExists) {
      // find the students
      const students = await User.find({ batchId: isBatchExists._id })
        // this will neglect all these things
        .select({
          // email: 0,
          batchId: 0,
          userDetails: {
            mobile: 0,
            password: 0,
          },
        });
      res.json({
        success: true,
        message: `${isBatchExists.batchNum} batch students sent!`,
        students,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Batch not found!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
