const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title :{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required : true,
    },
    content :{
        type:String ,
        required :true,
    },
    image: {
    type: String, // will store filename or file path
    required: true,
  },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const blogModel = mongoose.model('Blog',BlogSchema);

module.exports = blogModel;