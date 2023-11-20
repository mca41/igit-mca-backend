const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required : true
    },
    batchId : {
        type : Schema.ObjectId,
    },
    registrationDate : {
      type : Date,
      default : Date.now
    },
    batchNum : {
        type:Number
    },
    userType: {
        type: String,
        default: "user" 
    },
    isSpecialUser : {
       type: String,
       default : "" //place "admin" for who maintains website
    },
    status: {
        type: Number,
        default: 0
    },
    userDetails: {
        name: {
            type: String,
            default : ""
        },
        homeDist: {
            type:String,
            default: ""
        },
        regNum: {
            type:String
        },
        mobile:{
            type:String
        },
        gradCourse : {
            type:String,
            default:"nothing selected"
        } ,
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
    fieldOfInterest:{
        type : String,
        default: "nothing selected"
    },
    // assigned coordination tag : ex - Class Representative or Placement Coordinator
    tag : {
        type : String,
        default : ""
    },
    // any person who is assigned as a coordinator
    isTag : {
        type : Boolean,
        default : false
    },
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