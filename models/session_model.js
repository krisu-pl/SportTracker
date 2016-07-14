var db = require('../db');
var randomstring = require("randomstring");

exports.getSessionKey = function (data, connection, callback) {
    var query = '' +
        'SELECT session_key ' +
        'FROM sessions ' +
        'WHERE participant_event_id = "' + data.id + '"';
    db.query(query, connection, callback);
};

exports.generateSessionKey = function (data, connection, callback) {
    var session_key = randomstring.generate();

    var query = '' +
        'INSERT INTO sessions ' +
        'VALUES(' + data.id + ',"' + session_key + '") ' +
        'ON DUPLICATE KEY UPDATE session_key = "' + session_key + '"';
    db.query(query, connection, callback);
};