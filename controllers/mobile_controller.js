const event_model = require('../models/event_model');
const participant_model = require('../models/participant_model');
const session_model = require('../models/session_model');

/**
 * Returns connection to the database
 *
 * @param data
 * @param req
 * @returns {Promise}
 */
const getConnection = ({data, req}) => {
    return new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
            if (err) reject(err);
            resolve({data, connection});
        });
    });
};

/**
 * Returns participant taking part in a given event
 *
 * @param data
 * @param connection
 * @returns {Promise}
 */
const getSingleEventParticipant = ({data, connection}) => {
    return new Promise((resolve, reject) => {
        participant_model.getSingleEventParticipant(data, connection, (err, results) => {
            if (err) reject(err);
            const participant_event = results[0];
            resolve({participant_event, connection});
        });
    });
};

/**
 * Inserts or updates session key for a given event participant
 *
 * @param participant_event
 * @param connection
 * @returns {Promise}
 */
const generateSessionKey = ({participant_event, connection}) => {
    return new Promise((resolve, reject) => {
        session_model.generateSessionKey(participant_event, connection, (err) => {
            if (err) reject(err);
            resolve({participant_event, connection});
        });
    });
};

/**
 * Returns session key for a given event participant
 *
 * @param participant_event
 * @param connection
 * @returns {Promise}
 */
const getSessionKey = ({participant_event, connection}) => {
    return new Promise((resolve, reject) => {
        session_model.getSessionKey(participant_event, connection, (err, results) => {
            if (err) reject(err);
            const sessionKey = results[0];
            resolve({
                participant: participant_event,
                session_key: sessionKey
            });
        });

    });
};

exports.login = (data, req, callback) => {
    getConnection({data, req})
        .then(getSingleEventParticipant)
        .then(generateSessionKey)
        .then(getSessionKey)
        .then((returnData) => {
            callback(null, returnData)
        })
        .catch((err) => {
            callback(err)
        });
};