const mongoose = require('mongoose')

const Faculty = mongoose.model('Faculty', {
    pubId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    index: {
        type: String,
        required: true,
    },
    years: [{
        type: String,
        required: true,
    }],
})

module.exports = Faculty