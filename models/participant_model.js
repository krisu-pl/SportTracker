const db = require('../db');

/**
 * Returns list of participants for a given event
 *
 * @param eventId
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.getForEvent = (eventId, connection, callback) => {
    const query = `
        SELECT
           participants.id,
           participants.name as participant_name,
           team,
           city,
           connect_participants_events.id as participant_event_id,
           starting_number,
           category_id,
           categories.name as category_name
        FROM events
        JOIN connect_participants_events
           ON connect_participants_events.event_id = events.id
        JOIN participants
           ON participants.id = connect_participants_events.participant_id
        JOIN categories
           ON categories.id = connect_participants_events.category_id
        WHERE events.id = "${eventId}"`;
    db.query(query, connection, callback);
};


exports.getSingleEventParticipant = (data, connection, callback) => {
    const query = `
        SELECT
           connect_participants_events.id,
           connect_participants_events.participant_id,
           connect_participants_events.event_id,
           connect_participants_events.starting_number,
           participants.name,
           participants.team,
           participants.city
        FROM connect_participants_events
        JOIN participants
           ON participants.id = connect_participants_events.participant_id
        WHERE
           event_id = "${data.event_id}"
           AND starting_number = "${data.starting_number}"
           AND pin = "${data.pin}"
        LIMIT 1`;

    console.log(query);
    db.query(query, connection, callback);
};


exports.insertLocation = (data, connection, callback) => {
    const query = `
        INSERT INTO locations
        VALUES(null, ${data.lat}, ${data.lng}, ${data.participant_event_id}, "${data.timestamp}")`;
    console.log(query);
    db.query(query, connection, callback);
};