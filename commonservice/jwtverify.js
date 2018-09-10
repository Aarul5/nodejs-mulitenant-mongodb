var jwt = require('jsonwebtoken');
var config = require('../config.js');

function jwtverify(req) {
    console.log("jwt verify.....")
    var DBName;
    var header = req.get('Authorization');

    if (header) {
        var tokenType = header.split(' ')[0];
        var token = header.split(' ')[1];

        if (tokenType !== undefined && token !== undefined && tokenType !== '' && token !== '') {
            if (tokenType === 'Bearer') {
                jwt.verify(token, config.secret, { issuer: config.issuer }, function (err, decodedToken) {
                    DBName = `${config.Prefix}${decodedToken.CName}`;
                })
            }
        }
    } else {
        return next();
    }
    return DBName;
}
module.exports = {
    jwtverify: jwtverify
}