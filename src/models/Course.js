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
    teachers: [{
        type: String,
        required: true,
    }],
    tutorat: [{//PublicID of the course
        type: Object,
        required: false,
    }],
    // videos: [{
    //     type: String,
    //     required: true,
    // }],
    // links: [{
    //     type: String,
    //     required: true,
    // }],
    // files: [{
    //     type: String,
    //     required: true,
    // }]
})

module.exports = Course