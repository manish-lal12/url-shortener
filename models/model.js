const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
    shortid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    redirectURL: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('shortUrl', shortURLSchema);