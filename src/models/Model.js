const mongoose = require('mongoose')

const Model = mongoose.model('Model', {
    pubId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    courses: [{
        type: String,
        required: true,
    }],
})

module.exports = Model