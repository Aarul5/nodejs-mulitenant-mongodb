'use strict';
var mongoose = require('mongoose');
require('../models/user.model');
var mongo = require('../commonservice/mongoservice');
var user = mongoose.model('UserModel');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var Q = require('q');
var passwordHasher = require('password-hash');
var passport = require('passport');



/**
 * Create New User and store in AuthDB
 * success -> create DataBase under UserName
 * error -> user not created 
 */
var passport = require('passport');

module.exports.createClient = function (req, res, next) {
    var application = req.body;

    if (application) {
        mongo.createDB(req.body.UserName, function (result) {
            if (!result) {
                application.DataBaseName = req.body.UserName;
                application.Role = "Admin";
                application.Password = getHashedPassword(req.body.Password);
                user.create(application, function (err, success) {
                    if (err) {
                        return res.status(402).send(err);
                    }
                    if (success) {
                        return res.status(200).send(success);
                    } else {
                        return res.status(404).send('User not created.');
                    }
                });
            } else {
                return res.status(200).send("User Already Exists");
            }
        });
    } else {
        return res.status(400).send('Data not provide.');
    }
};

module.exports.userLogin = function (req, res, next) {
    var username = req.body.UserName;
    var password = req.body.Password;
    user.findOne({ 'UserName': new RegExp('^' + username + '$', "i") }, function (err, user) {
        if (err) {
            return res.status(402).send(err);
        }
        if (user) {
            if (passwordHasher.verify(password, user.Password)) {
                getJWTResult(username, user)
                    .then((jwtResult) => {
                        req.UserName = username;
                        jwtverify(jwtResult.accessToken)
                        return res.status(200).send(jwtResult);
                    });
            } else {
                return res.status(400).send('Password is Invalid.');
            }
        } else {
            return res.status(404).send('UserName not Vaild.');
        }
    });
}


module.exports.userLoginGoogle = function (req, res, next) {
    var username = req.body.UserName;
    var password = req.body.Password;
    console.log("Google Auth...");
    passport.authenticate('google', {
        scope: ['profile']
    })
}
module.exports.googleAuth = function (req, res, next) {
    var username = req.body.UserName;
    var password = req.body.Password;
    res.send("Google Redirect url...")
}



function jwtverify(token) {
    jwt.verify(token, config.secret, { issuer: config.issuer }, function (err, decodedToken) {
        console.log(decodedToken);
    })
}


//Generate JWT Token
function getJWT(userId, DataBaseName) {
    var accessToken = jwt.sign({ 'UserName': userId, 'CName': DataBaseName, 'Permission': ['update', 'get all school records', 'delete'] }, config.secret,
        {
            //algorithms: ["HS256", "HS384"],
            issuer: config.issuer
        });
    return accessToken;
}

//Generate JWT response
function buildJWTResponse(userId, roles, DataBaseName) {
    var JWTResponseObject = new Object();
    var accessToken = getJWT(userId, DataBaseName);
    JWTResponseObject.user = userId;
    JWTResponseObject.roles = roles;
    JWTResponseObject.accessToken = accessToken;
    JWTResponseObject.iss = 'Keo plus LMS';
    JWTResponseObject.iat = new Date();
    return JWTResponseObject;
}

function getJWTResponse(userId, roles, DataBaseName, callback) {
    //Build AccessTokenModelObject
    var JWTResponseObject = buildJWTResponse(userId, roles, DataBaseName);
    var accessTokenModelObject = new Object();
    accessTokenModelObject.UserName = userId;
    accessTokenModelObject.AccessToken = JWTResponseObject.accessToken;
    accessTokenModelObject.IssuedAt = JWTResponseObject.iat;
    callback(null, JWTResponseObject);
}


function getJWTResult(username, user) {
    var deferred = Q.defer();
    getJWTResponse(username, user.Role, user.DataBaseName, function (err, JWTResponse) {
        if (err) {
            deferred.reject(err);
        }
        if (JWTResponse) {
            deferred.resolve(JWTResponse);
        } else {
            deferred.reject();
        }
    });
    return deferred.promise;
}


//Password hashing
function getHashedPassword(plainPassword) {
    var options = new Object();
    options.algorithm = 'sha256';
    options.saltLength = 128 / 8;
    options.iterations = 1000;
    return passwordHasher.generate(plainPassword, options);
}
