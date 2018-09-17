'use strict';
var mongoose = require('mongoose');
var SchoolSchema = mongoose.Schema;


function createSchema(connection) {
    var SchoolModel = new SchoolSchema({
        SchoolName: {
            type: String,
            required: [true, 'User required.'],
            trim: true,
            unique: true
        },
        SchoolId: {
            type: String,
            trim: true
        },
        DeanName: {
            type: String,
            trim: true
        },
        Email: {
            type: String,
            trim: true
        }
    }, { versionkey: false, collection: 'school' });
    return connection.model('SchoolModel', SchoolModel);
}

module.exports = {
    createSchema: createSchema
}

