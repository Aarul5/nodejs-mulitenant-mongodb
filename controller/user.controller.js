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


module.exports.createUser = function (req, res, next) {
    var application = req.body;
    if (application) {
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
        return res.status(400).send('Data not provide.');
    }
};

module.exports.userLogin = function (req, res, next) {
    var username = req.body.UserName;
    var password = req.body.Password;
    user.findOne({ 'UserName': new RegExp('^' + username + '$', "i") }, function (err, userinfo) {
        if (err) {
            return res.status(402).send(err);
        }
        if (userinfo) {
            if (passwordHasher.verify(password, userinfo.Password)) {
                if (userinfo.Role == 'Admin') {
                    getJWTResult(username, userinfo.Role, userinfo.DataBaseName)
                        .then((jwtResult) => {
                            req.UserName = username;
                            storeDatainRedisServer(jwtResult, function (result) {
                                if (result) {
                                    return res.status(200).send(jwtResult);
                                }
                            })
                        });
                } else {
                    user.findOne({
                        'UserName': { $in: userinfo.organization }
                    }, function (err, school) {
                        if (err) {
                            return res.status(402).send(err);
                        }
                        if (school) {
                            getJWTResult(username, userinfo.Role, school.DataBaseName, userinfo.organization)
                                .then((jwtResult) => {
                                    req.UserName = username;
                                    storeDatainRedisServer(jwtResult, function (result) {
                                        if (result) {
                                            return res.status(200).send(jwtResult);
                                        }
                                    })
                                });
                        } else {
                            return res.status(402).send("organization not found");
                        }
                    })
                }
            } else {
                return res.status(400).send('Password is Invalid.');
            }
        } else {
            return res.status(404).send('UserName not Vaild.');
        }
    });
}

function storeDatainRedisServer(jwtResult, callback) {
    console.log("Redis Server...");
    var testredisData = {
        "accessToken": jwtResult.accessToken,
        "Permission": ["Update", "get all school record"].toString()
    }
    console.log("Redis Server 0...");
    jwtResult.organization.forEach(function (Obj) {
        testredisData[Obj] = false;
    });

    console.log(testredisData);
    console.log("Redis Server 1...");
    redisClient.HMSET(jwtResult.accessToken, testredisData);
    console.log("Redis Server 2...");
    callback(true);
}

//Generate JWT Token
function getJWT(userId, DataBaseName) {
    var accessToken = jwt.sign({ 'UserName': userId, 'CName': DataBaseName, 'Permission': ['update', 'get all school record', 'delete'] }, config.secret,
        {
            algorithm: "HS256",
            issuer: config.issuer
        });
    return accessToken;
}

//Generate JWT response
function buildJWTResponse(userId, roles, DataBaseName, organization) {
    console.log(organization);
    var JWTResponseObject = new Object();
    var accessToken = getJWT(userId, DataBaseName);
    JWTResponseObject.user = userId;
    JWTResponseObject.roles = roles;
    JWTResponseObject.organization = organization;
    JWTResponseObject.accessToken = accessToken;
    JWTResponseObject.iss = 'Keo plus LMS';
    JWTResponseObject.iat = new Date();
    return JWTResponseObject;
}

function getJWTResponse(userId, roles, DataBaseName, organization, callback) {
    //Build AccessTokenModelObject
    var JWTResponseObject = buildJWTResponse(userId, roles, DataBaseName, organization);
    var accessTokenModelObject = new Object();
    accessTokenModelObject.UserName = userId;
    accessTokenModelObject.AccessToken = JWTResponseObject.accessToken;
    accessTokenModelObject.IssuedAt = JWTResponseObject.iat;
    callback(null, JWTResponseObject);
}

function getJWTResult(username, role, dataBaseName, organization) {
    var deferred = Q.defer();
    getJWTResponse(username, role, dataBaseName, organization, function (err, JWTResponse) {
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
