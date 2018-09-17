/**
 * Over All router config
 * @param {*} router 
 */
var authServer = require('./commonservice/jwtverify');

module.exports = function (router) {
    //Routing for User Creation
    var userinfo = require('./controller/user.controller')
    router.post('/createUser', userinfo.createClient);
    router.post('/login', userinfo.userLogin);

    //Routing for School Creation
    var school = require('./controller/school.controller')
    router.post('/create/school', school.CreateSchool);
    router.get('/getAllSchool', permission('get all school record'), school.getAllSchool);
}

var permission = function (permissions) {
    return function (req, res, next) {
        authServer.permission(req, res, next, permissions);
    };
}; 
