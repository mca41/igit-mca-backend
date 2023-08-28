const express = require("express");
const router = express.Router();


router.post("/createUser",(req,res)=>{
   res.json({
    msg:"Hello"
   })
});





module.exports = router;