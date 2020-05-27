const httpStatus = require('http-status-codes')


const Global = require('../models/Global')


let fetchAlerts = async (req, res) => {
    try{
        const alerts = await Global.findOne({})
        console.log(alerts)
        return res.status(httpStatus.OK).json({message:'Alerts',alerts})
    }catch(err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'Error Occured'})
    }
}
let UpdateAlerts = async (req, res) => {
    const Alertid = '5ece8e6214b711a8468856f1';
    await Global.findOneAndUpdate({_id:Alertid},
        {
          $inc: { totalAlerts: 1}
            
        },{new: true, useFindAndModify: false}).then(()=>{
            res.status(httpStatus.OK).json({message:'Alert Added'})
        }).catch(err=>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'An Error Occured'})
        })
}
module.exports = {
    fetchAlerts,
    UpdateAlerts
}