const mongoose = require('mongoose')

require('dotenv').config()

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    class: {
        type: Array,
    }

})

const Course = mongoose.model('Course', courseSchema, "courses")

module.exports = { Course }