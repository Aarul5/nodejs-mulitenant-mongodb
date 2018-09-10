'use strict';
var jwt = require('../commonservice/jwtverify');
/**
 * Create School in Particular User Database 
 */
module.exports.CreateSchool = function (req, res, next) {
    var Student = DBConnectionsList[jwt.jwtverify(req)].studentModel;
    Student.create(req.body, function (err, success) {
        if (err) {
            return res.status(402).send(err);
        }
        if (success) {
            return res.status(200).send(success);
        } else {
            return res.status(404).send('School not created.');
        }
    });
};
