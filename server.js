var express = require('express')
var app = express()
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
var router = express.Router();
var dynamicDB = require('./middleware/middleware');
var passportconfig = require('./commonservice/googleoauth.service');
var redis = require("redis");
var config = require('./config');

var redisURI = 'redis://' + config.redisDB.USERNAME + '@' + config.redisDB.DBHOST + ':' + config.redisDB.DBPORT;
var redisClient = redis.createClient(redisURI);
redisClient.on("error", function (err) {
    console.log("Error in redis Connection:" + err);
});
redisClient.on('connect', function () {
    console.log('Connected to redis...');
});
global.redisClient = redisClient;


//Auth Db Connection
var url = "mongodb://localhost:27017/AuthDB";

mongoose.connect(url, { useNewUrlParser: true });
var authDB = mongoose.connection;
authDB.on('error', function connectionError(err) {
    console.log("error connecting authentication database:- " + err);
});
authDB.once('open', function connectionSuccess() {
    console.log('Authentication database connected.');
});
authDB.on('disconnected', () => {
    console.log(`Authentication database Disconnected.\n`.bold.red);
});
//End Auth Db connection

//middleware : Find the DB Name from token and connect db.
app.use(dynamicDB.authorizeDB);

require('./routes')(router);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Enable CORS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.use('/api', router);

app.use(errorHandler);

function errorHandler(err, req, res, next) {
    console.log("..Error Handler..")
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (err.name === 'ValidationError') {
        return res.status(400).send(err);
    }
    return res.status(500).send(err);
}

app.listen(8085, function () {
    console.log("Server started : http://localhost:8085");
})

