'use strict';
var mongoose = require('mongoose');
require('../models/user.model');
var mongo = require('../commonservice/mongoservice');
var user = mongoose.model('UserModel');

/**
 * Create New User and store in AuthDB
 * success -> create DataBase under UserName
 * error -> user not created 
 */
module.exports.createUser = function (req, res, next) {
    var application = req.body;

    if (application) {
        user.create(application, function (err, success) {
            if (err) {
                return res.status(402).send(err);
            }
            if (success) {
                mongo.createDB(req.body.UserName);
                return res.status(200).send(success);
            } else {
                return res.status(404).send('User not created.');
            }
        });
    } else {
        return res.status(400).send('Data not provide.');
    }
};
