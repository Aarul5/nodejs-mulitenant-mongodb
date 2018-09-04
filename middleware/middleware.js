var mongoose = require('mongoose');
var dataBaseSchema = require('../models/school.model');

//Object holding all your connection strings.
global.DBConnectionsList = {};

/**
 * 1. Get UserName from the header part.
 * 2. Check the DB Connection is avaliable in 'DBConnectionsList' else Create new DBconnection.
 * 3. After creating new Connection Load All models under db connection and store it 'DBConnectionsList'.
 */
var authorizeDB = function (req, res, next) {
    console.log("User Db Connection Process.....")

    //Get user name from the header. 
    var dbName = req.get('UserName');
    if (!dbName) {
        return res.status(HttpStatus.BadRequest).send('User header not found.');
    }

    //Check the DB Connection is avaliable in 'DBConnectionsList'else Create new DBconnection.
    if (dbName) {
        if (DBConnectionsList[dbName]) {
            console.log("DB in Connection List.....")
            req.UserDB = DBConnectionsList[dbName];
            req.studentModel = dataBaseSchema.createSchema(DBConnectionsList[dbName]);
            return next();
        } else {
            DBConnectionsList[dbName] = mongoose.createConnection('mongodb://localhost:27017/' + dbName);
            req.UserDB = DBConnectionsList[dbName];
            //Load All models under db connection and store it 'DBConnectionsList'.
            req.studentModel = dataBaseSchema.createSchema(DBConnectionsList[dbName]);
            console.log("New DB added in Connection List.....")
            return next();
        }
    } else {
        return next();
    }
};

module.exports = { authorizeDB };
