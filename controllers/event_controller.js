var event_model = require('../models/event_model');

exports.getAll = function(req, callback){
    req.getConnection(function(err, connection) {
        if (err) {
            callback(err);
            return;
        }

        event_model.getAll(connection, function(err, results){
            callback(err, results);
        });
    });
};