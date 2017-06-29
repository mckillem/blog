const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    }
});

const Post = module.exports = mongoose.model("Post", postSchema);