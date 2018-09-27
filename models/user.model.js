'use strict';
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema;


var UserModel = new UserSchema({

    UserName: {
        type: String,
        required: [true, 'User required.'],
        trim: true,
        unique: true
    },
    Password: {
        type: String,
        required: [true, 'Password required.'],
        trim: true
    },
    DataBaseName: {
        type: String,
        trim: true
    },
    Role: {
        type: String,
        trim: true
    },
    organization: [{
        type: String,
        trim: true
    }]
}, { versionkey: false, collection: 'userlogin' });
mongoose.model('UserModel', UserModel);


