const express = require('express')
const router = express.Router()
const config = require('../config/secret')
const AuthController = require('../controllers/auth')

module.exports.setRouter = (app) => {
    const baseUrl = `${config.apiUrl}/auth`;

    app.post(`/${baseUrl}/register`,AuthController.createUser)
    app.post(`/${baseUrl}/login`,AuthController.loginUser)
}