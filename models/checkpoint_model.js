var db = require('../db');

/**
 * Inserts new time in a specific checkpoint for a given user
 *
 * @param data = {
 *  participant_id: Int,
 *  checkpoint_id: Int,
 *  time: String
 *  }
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.insertTime = function (data, connection, callback) {
    var participant_id = data.participant_id;
    var checkpoint_id = data.checkpoint_id;
    var time = data.time;

    if(participant_id && checkpoint_id && time) {
        var query = 'INSERT INTO connect_participants_checkpoints (participant_id, checkpoint_id, time) ' +
            'VALUES (' + participant_id + ', ' + checkpoint_id + ', "' + time + '")';
        db.query(query, connection, callback);
    }
    else {
        // Throw error
        callback("All fields are required", null);
    }
};