const mongoose = require('mongoose')

const Account = mongoose.model('Account', {
    pubId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    idTokens: [{
        type: String,
        required: false,
    }],
    isTeacher: {
        type: String,
        required: false,
    },
    tutorat: [{//PublicID of the course
        type: String,
        required: false,
    }],
})

module.exports = Account