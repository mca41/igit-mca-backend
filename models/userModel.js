const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require
    },
    registrationDate : {
      type : Date,
      default : Date.now
    },
    batch : {
        type : Number
    },
    userType: {
        type: String,
        default: "user" //place "admin" for who maintains website
    },
    status: {
        type: Number,
        default: 0
    },
    userDetails: {
        fName: String,
        lName: String,
        homeDist: String,
        regNum:Number,
        mobile:Number,
        gradCourse : String ,
        password : String,
        socialLinks : {
            linkedInLink : {
                type : String,
                default : ""
            },
            githubLink : {
                type : String,
                default : ""
            }
        },
        otherThings: {},
    },
    fieldOfInterest:String,
    tag : String,
    rollNum : Number,
    profilePic : {
        givenName : {
            type: String,
            default : ""
        },
        url : {
            type: String,
            default : ""
        }
    }
})

module.exports = mongoose.model("User", userSchema);