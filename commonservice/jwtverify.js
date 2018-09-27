var jwt = require('jsonwebtoken');
var config = require('../config.js');

function jwtverify(req, next) {
    console.log("jwt verify.....")
    var header = req.get('Authorization');
    if (header) {
        DBName = `${config.Prefix}${jwtDecode(header).decodedToken.CName}`;
    } else {
        console.log("header not found.")
        return next();
    }
    return DBName;
}

function permission(req, res, next, permissions) {
    console.log("Checking permissions.....")
    var header = req.get('Authorization');
    if (header) {
        redisClient.HGETALL(jwtDecode(header).token, function (err, reply) {
            if (err) {
                return res.status(401).send('You are not an Authorized user.');
            }
            if (reply !== null && reply !== undefined && reply.Permission !== undefined) {
                console.log("redisdata");
                let redisdata = reply.Permission.split(',');
                console.log(redisdata);
                if (redisdata.indexOf(permissions) != -1) {
                    console.log(redisdata.Permission);
                    return next();
                } else {
                    return res.status(401).send('You are not an Authorized user.');
                }
            } else {
                console.log("Test err..");
                return res.status(401).send('You are not an Authorized user.');
            }

        });
        /*
        if (jwtDecode(header).Permission !== undefined) {
            console.log(permissions);
            if (jwtDecode(header).Permission.indexOf(permissions) != -1) {
                console.log(jwtDecode(header).Permission);
                return next();
            } else {
                return res.status(401).send('You are not an Authorized user.');
            }
        } else {
            return res.status(401).send('You are not an Authorized user.');
        }
        */
    } else {
        return res.status(401).send('You are not an Authorized user.');
    }
}

function jwtDecode(header) {
    var jwtDecodeValue = {};
    var tokenType = header.split(' ')[0];
    var token = header.split(' ')[1];

    if (tokenType !== undefined && token !== undefined && tokenType !== '' && token !== '') {
        if (tokenType === 'Bearer') {
            jwt.verify(token, config.secret, { issuer: config.issuer }, function (err, decodedToken) {
                jwtDecodeValue.decodedToken = decodedToken;
                jwtDecodeValue.token = token
            })
        }
    }
    return jwtDecodeValue;
}

module.exports = {
    jwtverify,
    permission
}
