'use strict';
/**
 * Create School in Particular User Database 
 */
module.exports.CreateSchool = function (req, res, next) {
    var Student = req.studentModel;
    var data = {
        'SchoolName': "Testsd",
        'SchoolId': "12121",
        'DeanName': "Arul"
    }
    Student.create(data, function (err, success) {
        if (err) {
            return res.status(402).send(err);
        }
        if (success) {
            return res.status(200).send(success);
        } else {
            return res.status(404).send('School not created.');
        }
    });
};
