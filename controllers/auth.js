const Joi = require('joi')
const httpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const jwt_decode = require('jwt-decode')

const User = require('../models/User')
const helpers = require('../helpers/helpers')
const keys = require('../config/secret')


let testUser = (req, res) => {
    res.send('tested')
}

let createUser = (req, res) => {
    //console.log('Starting...')
    const schema = Joi.object().keys({
        firstName: Joi.string().min(2).max(10).required(),
        lastName: Joi.string().min(2).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });
    const {
        error,
        value
    } = Joi.validate(req.body, schema);
    if (error && error.details) {
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: error.details
        })
    }


    User.findOne({
            email: helpers.lowercase(req.body.email)
        })
        .then(user => {
            if (user) {
                return res.status(httpStatus.CONFLICT).json({
                    message: 'Email already exists'
                })
            } else {
                const newUser = new User({
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    email: helpers.lowercase(req.body.email),
                    password: req.body.password
                });
                //console.log(req.body)
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        } else {
                            newUser.password = hash;
                            newUser.save()
                                .then(response => {
                                    //console.log(response)
                                   // const response = resp.splice(4,1)
                                    //delete response.password
                                    response.password = null;
                                    const token = jwt.sign({
                                        data: response
                                    }, keys.secret, {
                                        expiresIn: "5h"
                                    })
                                    res.cookie('auth', token)
                                    //console.log('Success')
                                    res.status(httpStatus.CREATED).json({
                                        message: 'User created successfully',
                                        response,
                                        token
                                    });
                                }) //.save() is a mongoose function which gives/return/promise the user which is created  
                                .catch(err => {
                                   // console.log(err);
                                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                                        message: 'An Error Occured!!'
                                    })
                                });
                        }
                    })
                })
            }
        });
}

let loginUser = (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });
    const {
        error,
        value
    } = Joi.validate(req.body, schema);
    if (error && error.details) {
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: error.details
        })
    }

    User.findOne({
        email: helpers.lowercase(req.body.email)
    }).then(user => {
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'User/Email not Found'
            });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(isMatch => {
                if (!isMatch) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: 'Incorrect password'
                    });
                } else {
                    //Sign Token
                    //expiresIn Value in seconds
                   // console.log(user)
                /*     const token = jwt.sign({data:user},keys.secret,{
                        expiresIn: +3600
                    }); */
                    const token = jwt.sign({ data: user }, keys.secret, {
                        expiresIn: '5h'
                      });
                 /*    console.log(jwt_decode(token))
                    console.log(token)
                    console.log(new Date().getTime()) */
                    res.cookie('auth',token)
                    res.status(httpStatus.OK).json({
                        message: 'Login successful',
                        user,
                        token
                    })
                    //console.log(token)


                    
                }
            }).catch(err => {
                console.log(err)
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error Occured'
                })
            })

    }).catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error Occured'
        })
    })
}

module.exports = {
    test: testUser,
    createUser: createUser,
    loginUser: loginUser
}
