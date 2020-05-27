const mongoose = require('mongoose')

const User = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('User', User);