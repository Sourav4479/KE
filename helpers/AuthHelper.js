const jwt = require('jsonwebtoken')
const httpStatus = require('http-status-codes')

const keys = require('../config/secret')

const jwt_decode = require('jwt-decode')

module.exports = {
    VerifyToken: (req, res, next) => {
            if(!req.headers.authorization){
                return res.status(httpStatus.UNAUTHORIZED).json({ message:'No Authorisation'})
            }
            const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
            if(!token){
                return res.status(httpStatus.FORBIDDEN).json({message: 'No token provided'})
            }
            console.log(token)
            console.log(new Date().getTime())
            return jwt.verify(token,keys.secret, (err,decoded)=>{
                if(err){
                    console.log(err.expiredAt.getTime())
                    console.log(new Date().getTime())
                    if(err.expiredAt < new Date()){
                        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                            message:'Token has expired. Please Login again',
                            token: null
                        });
                    }
                    next()
                }
                req.user = decoded.data
                console.log(new Date())
                next()
            })

    }
}