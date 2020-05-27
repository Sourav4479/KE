const express = require('express')
const router = express.Router()
const config = require('../config/secret')
const GlobalController = require('../controllers/global')

const AuthHelper = require('../helpers/AuthHelper')

module.exports.setRouter = (app) => {
    const baseUrl = `${config.apiUrl}/global`;

  

    app.get(`/${baseUrl}/update`,AuthHelper.VerifyToken,GlobalController.UpdateAlerts)
    app.get(`/${baseUrl}/fetch`,AuthHelper.VerifyToken,GlobalController.fetchAlerts)
   
   
}