const mongoose = require("mongoose");
const { Schema } = mongoose;

// when a new batch will be created then it will be stored corresponding branch collection :: the batch id will be pushed to callBatchIds
const branchSchema = new Schema({
    branch: {
        type : String,
        default : "mca"
    },
    // allBatchIds : [{ type: Schema.Types.ObjectId, ref: 'Batch' }]
})

module.exports = mongoose.model("Branch", branchSchema);