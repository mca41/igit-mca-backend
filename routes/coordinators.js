const express = require("express");
const router = express.Router();
const User = require("../models/userModel")
const Batch = require("../models/batchModel")


// No Authentication required :: Gives coordinators of seniors (2nd Year)

router.get("/:batchNum", async (req, res) => {
    try {
        const batchNum = req.params.batchNum;
        const isBatchExists = await Batch.findOne({batchNum}) ;
        if (isBatchExists) {
            const batchCoordinators = await User.find({ batch: batchNum, isTag: true, status : 1 }).select({
                email : 0,
                userDetails: {
                    password: 0,
                    mobile : 0,
                    homeDist : 0,
                    regNum : 0,
                    gradCourse : 0
                },
                fieldOfInterest : 0,
            });
            res.json({
                success : true,
                message: "All batch coordinator sent",
                batchCoordinators
            })
        }else{
            res.status(404).json({
                success : false,
                message: "Batch not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Internal server error",
        })
    }
})


module.exports = router;