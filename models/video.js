const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: 1
    },
    premium: {
        type: Boolean,
        default: false,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }

})

const Video = mongoose.model('Video', videoSchema, "videos")

module.exports = { Video }