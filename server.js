var express = require('express')
var app = express()
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
var router = express.Router();
var find = require('find');

//Db Connection
var url = "mongodb://localhost:27017/AuthDB";

mongoose.connect(url);
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
// end Db connection

require('./routes')(router);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Enable CORS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, UserID');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.use('/api', router);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (err.name === 'ValidationError') {
        return res.status(400).send(err);
    }
    return res.status(500).send(err);
}

// find.file(/\.model.js$/, __dirname,'/models', function (files) {
//     console.log(files);
// })




var fs = require('fs');
var path = require('path');
var dirPath = path.resolve(__dirname, './models'); // path to your directory goes here

app.listen(8085, function () {
    console.log("localhost:8085 Auth server.")
})