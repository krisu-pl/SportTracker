var event_model = require('../models/event_model');
var participant_model = require('../models/participant_model');
var session_model = require('../models/session_model');

exports.login = function (data, req, callback) {
    req.getConnection(function(err, connection) {
        if (err) {
            callback(err);
            return;
        }
        participant_model.getSingleEventParticipant(data, connection, function(err, results){
            if (err) {
                callback(err);
                return;
            }

            var participant_event = results[0];

            session_model.generateSessionKey(participant_event, connection, function(err, results){
                if (err) {
                    callback(err);
                    return;
                }

                session_model.getSessionKey(participant_event, connection, function(err, results){
                    if (err) {
                        callback(err);
                        return;
                    }

                    var sessionKey = results[0];

                    var returnData = {
                        participant: participant_event,
                        session_key: sessionKey
                    };

                    callback(err, returnData);
                });
            });
        });
    });
};