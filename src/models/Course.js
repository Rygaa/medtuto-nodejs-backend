const mongoose = require('mongoose')

const Course = mongoose.model('Course', {
    pubId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: Object,
        required: false,
    },
    index: {
        type: String,
        required: true,
    },
    teachers: [{
        type: String,
        required: true,
    }],
    tutorat: [{
        type: Object,
        required: false,
    }],
    faculty: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    }
})

module.exports = Course