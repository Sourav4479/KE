const express = require('express')
const  http = require('http');

const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')
const cors = require('cors')

const app = express()

const keys = require('./config/secret.js')

app.use(cors())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credential','true');
    res.header('Access-Control-Allow-Methods', 'GET','POST','DELETE','PUT','OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization',);
    next();
})


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

require('./socket/streams')(io)

//io.set('origins', 'http://localhost:4200');
//io.set('origins', '*:*');
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use(cookieParser());
app.use(logger('dev'));

/* app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
}); */

mongoose.Promise = global.Promise
mongoose.connect(keys.uri,{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log('MongoDB connected...'))
.catch((err) => console.log(err + ''))



const routesPath = './route';

fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});

server.listen(3000,()=>{
    console.log('Listening on port 3000')
})


