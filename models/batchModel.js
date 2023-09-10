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
    studentLists : [{ type: Schema.Types.ObjectId, ref: 'User' }],
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