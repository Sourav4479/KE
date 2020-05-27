const mongoose = require('mongoose')

const globals = mongoose.Schema({
  
    totalAlerts: {
        type: Number
    }
    
})

module.exports = mongoose.model('Global', globals);