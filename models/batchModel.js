const mongoose = require("mongoose");
const { Schema } = mongoose;

const batchSchema = new Schema({
    batchNum : {
        type: Number,
        required: true,
    },
    startingYear : {
        type : Number,
        required: true,
    },
    endingYear : {
        type : Number,
        required: true,
    },
    totalRegistered : {
        type : Number,
        default: 0 
    },
    strength : {
        type : Number,
        default : ""
    },
    branch : {
        type : String,
        default : "mca"
    }
})

module.exports = mongoose.model("Batch", batchSchema);