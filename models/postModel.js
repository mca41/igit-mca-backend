const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  postType:{
    type: String
  },
  authorId : {
    type : Schema.ObjectId,
  },
  createdAt : {
    type : String
  },
  postDetails : {
    docGivenName :{
        type: String
    },
    url : {
       type : String
    },
    title : {
        type: String
    },
    description : {
       type : String
    }
  }
})

module.exports = mongoose.model("Post", postSchema);