'use strict';
var mongoose = require('mongoose');
var HomeWorkSchema = mongoose.Schema;


function createSchema(connection) {
    var HomeWorkModel = new HomeWorkSchema({
        SchoolName: {
            type: String,
            required: [true, 'User required.'],
            trim: true,
            unique: true
        },
        DeanName: {
            type: String,
            trim: true
        },
        Email: {
            type: String,
            trim: true
        },
        SchoolId: [{
            type: Schema.ObjectId,
            ref: 'SchoolModel'
        }],
    }, { versionkey: false, collection: 'homework' });
    return connection.model('HomeWorkModel', HomeWorkModel);
}

module.exports = {
    createSchema: createSchema
} 
