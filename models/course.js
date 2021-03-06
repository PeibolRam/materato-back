const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
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
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]

})

const Course = mongoose.model('Course', courseSchema, "courses")

module.exports = { Course }