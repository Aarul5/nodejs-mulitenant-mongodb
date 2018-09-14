var jwt = require('jsonwebtoken');
var config = require('../config.js');

function jwtverify(req, next) {
    console.log("jwt verify.....")
    var header = req.get('Authorization');
    if (header) {
        DBName = `${config.Prefix}${jwtDecode(header).CName}`;
    } else {
        console.log("header not found.")
        return next();
    }
    return DBName;
}

function permission(req, res, next, permissions) {
    console.log("permission verify.....")
    var header = req.get('Authorization');
    if (header) {
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
    } else {
        return res.status(401).send('You are not an Authorized user.');
    }
}

function jwtDecode(header) {
    var jwtDecodeValue;
    var tokenType = header.split(' ')[0];
    var token = header.split(' ')[1];

    if (tokenType !== undefined && token !== undefined && tokenType !== '' && token !== '') {
        if (tokenType === 'Bearer') {
            jwt.verify(token, config.secret, { issuer: config.issuer }, function (err, decodedToken) {
                jwtDecodeValue = decodedToken;
            })
        }
    }
    return jwtDecodeValue;
}

module.exports = {
    jwtverify,
    permission
}

