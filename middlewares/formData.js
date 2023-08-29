// :: This middleware checks if the user credentials are correct
const {validationResult } = require('express-validator');

const checkUserCredentials = (req,res,next)=>{
    const result = validationResult(req);
    if (result.errors.length != 0) {
        res.status(401).json({
           success: false,
           message: "Error in credentials!",
           error : result.errors
        });
     }else{
        next();
     }
}

module.exports = checkUserCredentials;