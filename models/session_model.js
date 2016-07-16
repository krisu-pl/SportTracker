const db = require('../db');
const randomstring = require("randomstring");


exports.getSessionKey = (data, ...args) => {
    const query = `
        SELECT session_key
        FROM sessions
        WHERE participant_event_id = "${data.id}"`;

    db.query(query, ...args);
};

exports.generateSessionKey = (data, connection, callback) => {

    const session_key = randomstring.generate();

    const query = `
        INSERT INTO sessions
        VALUES(${data.id}, "${session_key}")
        ON DUPLICATE KEY UPDATE session_key = "${session_key}"`;

    console.log(query);
    db.query(query, connection, callback);
};