/**
 * Over All router config
 * @param {*} router 
 */
module.exports = function (router) {
    //Routing for User Creation
    var userinfo = require('./controller/user.controller')
    router.post('/createUser', userinfo.createClient);
    router.post('/login', userinfo.userLogin);

    //Routing for School Creation
    var school = require('./controller/school.controller')
    router.post('/create/school', school.CreateSchool);
}

