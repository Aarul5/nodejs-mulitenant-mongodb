var mongoose = require('mongoose');
var dataBaseSchema = require('../models/school.model');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

//Object holding all your connection strings.
global.DBConnectionsList = {};

/**
 * 1. Get DB Name from the header part.
 * 2. Check the DB Connection is avaliable in 'DBConnectionsList' else Create new DBconnection.
 * 3. After creating new Connection Load All models under db connection and store it 'DBConnectionsList'.
 */
var authorizeDB = function (req, res, next) {
    console.log("User Db Connection Process.....")

    //Get DB name from the header(token). 
    var header = req.get('Authorization');
    if (!header) {
        return next();
        // res.status(400).send('User header not found.');
    }

    //Check the DB Connection is avaliable in 'DBConnectionsList'else Create new DBconnection.
    if (header) {
        console.log("Authorization header verified.");
        var tokenType = header.split(' ')[0];
        var token = header.split(' ')[1];
        if (tokenType !== undefined && token !== undefined && tokenType !== '' && token !== '') {
            if (tokenType === 'Bearer') {
                jwt.verify(token, config.secret, { issuer: config.issuer }, function (err, decodedToken) {
                    if (err) {
                        return res.status(401).send('You are not an Authorized user.');
                    }
                    if (decodedToken.CName) {
                        var dbName = `${config.Prefix}${decodedToken.CName}`;
                        if (DBConnectionsList[dbName]) {
                            console.log("DB in Connection List.....");
                            return next();
                        } else {
                            DBConnectionsList[dbName] = mongoose.createConnection('mongodb://localhost:27017/' + dbName);
                            //Load All models under db connection and store it 'DBConnectionsList'.
                            DBConnectionsList[dbName]['studentModel'] = dataBaseSchema.createSchema(DBConnectionsList[dbName]);
                            console.log("New DB added in Connection List.....");
                            return next();
                        }
                    } else {
                        return res.status(401).send('You are not an Authorized user.');
                    }
                })
            } else {
                return res.status(401).send('You are not an Authorized user.');
            }
        } else {
            return res.status(401).send('You are not an Authorized user.');
        }
    } else {
        return next();
    }
};

module.exports = { authorizeDB };


