const mongoose = require('mongoose')

const Tutorat = mongoose.model('Tutorat', {
    status: {
        type: String,
        required: true
    },
    pubId: {
        type: String,
        required: true,
    },
    coursePubId: {
        type: String,
        required: true,
    },
    videos: [{
        type: String,
        required: true,
    }],
    links: [{
        type: String,
        required: true,
    }],
    files: [{
        type: String,
        required: true,
    }]
})

module.exports = Tutorat