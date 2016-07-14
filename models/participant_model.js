var db = require('../db');

/**
 * Returns list of participants for a given event
 *
 * @param eventId
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.getForEvent = function (eventId, connection, callback) {
    var query = '' +
        'SELECT ' +
        '   participants.id, ' +
        '   participants.name as participant_name, ' +
        '   team, ' +
        '   city, ' +
        '   starting_number, ' +
        '   category_id, ' +
        '   categories.name as category_name ' +
        'FROM events ' +
        'JOIN connect_participants_events ' +
        '   ON connect_participants_events.event_id = events.id ' +
        'JOIN participants ' +
        '   ON participants.id = connect_participants_events.participant_id ' +
        'JOIN categories ' +
        '   ON categories.id = connect_participants_events.category_id ' +
        'WHERE events.id = "' + eventId + '"';
    db.query(query, connection, callback);
};


exports.getSingleEventParticipant = function (data, connection, callback) {
    var query = '' +
        'SELECT ' +
        '   connect_participants_events.id, ' +
        '   connect_participants_events.participant_id, ' +
        '   connect_participants_events.event_id, ' +
        '   connect_participants_events.starting_number, ' +
        '   participants.name, ' +
        '   participants.team, ' +
        '   participants.city ' +
        'FROM connect_participants_events ' +
        'JOIN participants ' +
        '   ON participants.id = connect_participants_events.participant_id ' +
        'WHERE ' +
        '   event_id = "' + data.event_id + '" ' +
        '   AND starting_number = "' + data.starting_number + '" ' +
        '   AND pin = "' + data.pin + '"';

    console.log(query);
    db.query(query, connection, callback);
};
