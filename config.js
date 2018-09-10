'use strict';
var configObject = new Object();
configObject.issuer = "Keo plus LMS",
    configObject.secret = 'Torches for tomorrow'; //Secret key for signing JWT.
configObject.jwtExpiresOn = 86400; //Time in seconds (24 hours)
configObject.jwtExpiredAt = 1; //no.of days
configObject.Prefix = 'Keo_'; //no.of days

module.exports = configObject;
