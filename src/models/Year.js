const mongoose = require('mongoose')

const Year = mongoose.model('Year', {
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
    models: [{
        type: String,
        required: true,
    }],
})

module.exports = Year