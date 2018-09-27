'use strict';
var jwt = require('../commonservice/jwtverify');
/**
 * Create School in Particular User Database 
 */
module.exports.CreateSchool = function (req, res, next) {
    var School = DBConnectionsList[jwt.jwtverify(req)].studentModel;
    School.create(req.body, function (err, success) {
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

module.exports.getAllSchool = function (req, res, next) {
    var School = DBConnectionsList[jwt.jwtverify(req)].studentModel;
    School.find({}, function (err, user) {
        if (err) {
            return res.status(402).send(err);
        }
        if (user) {
            return res.status(200).send(user);
        }
    });
}

module.exports.getRedisServerData = function (req, res, next) {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6IkFydWwiLCJDTmFtZSI6IkRCMSIsIlBlcm1pc3Npb24iOlsidXBkYXRlIiwiZ2V0IGFsbCBzY2hvb2wgcmVjb3JkIiwiZGVsZXRlIl0sImlhdCI6MTUzNzI1OTQ4MywiaXNzIjoiS2VvIHBsdXMgTE1TIn0.N75JL4YEKEMZrZvSGdnSiAQpm_2G6VPRDyUVlAKTTog";
    redisClient.get(token, function (err, reply) {
        let data = JSON.parse(reply);
        console.log(typeof data);
        res.send(data.Permission);
    });
}