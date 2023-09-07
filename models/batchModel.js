const mongoose = require("mongoose");
const { Schema } = mongoose;

const batchSchema = new Schema({
    batchNum : {
        type: Number,
        require
    },
    startingYear : {
        type : Number,
        require
    },
    endingYear : {
        type : Number,
        require
    },
    studentLists : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    strength : {
        type : Number,
        require
    },
    branch : {
        type : String,
        default : "mca"
    }
})

module.exports = mongoose.model("Batch", batchSchema);