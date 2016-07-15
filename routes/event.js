const express = require('express');
const router = express.Router();

const event_model = require('../models/event_model');
const checkpoint_model = require('../models/checkpoint_model');
const participant_model = require('../models/participant_model');

/**
 * GET Event page - list of participants and their results
 */
router.get('/', function (req, res, next) {
    const eventId = req.query.id;

    getConnection({eventId, req})
        .then(getEventDetails)
        .then(getEventCheckpoints)
        .then(getEventParticipants)
        .then(calculateCheckpoints)
        .then(returnData => {
            console.log(returnData);
            res.render('event_details', returnData);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })

});

/**
 * Returns connection to the database
 *
 * @param eventId
 * @param req
 * @returns {Promise}
 */
const getConnection = ({eventId, req}) => {
    return new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
            if (err) reject(err);
            resolve({eventId, connection});
        });
    });
};

/**
 * Returns event details
 *
 * @param eventId
 * @param connection
 * @returns {Promise}
 */
const getEventDetails = ({eventId, connection}) => {
    return new Promise((resolve, reject) => {
        event_model.getDetails(eventId, connection, (err, results) => {
            if (err) reject(err);

            if (results.length == 0) {
                reject(new Error("No such event"));
            }

            const event = results[0];

            resolve({event, eventId, connection});
        });
    });
};

/**
 * Returns checkpoints of the event
 *
 * @param event
 * @param eventId
 * @param connection
 * @returns {Promise}
 */
const getEventCheckpoints = ({event, eventId, connection}) => {
    return new Promise((resolve, reject) => {
        checkpoint_model.getForEvent(eventId, connection, (err, results) => {
            if (err) reject(err);

            const checkpoints = results;

            resolve({checkpoints, event, eventId, connection});
        });
    });
};

/**
 * Returns participants of the event
 *
 * @param checkpoints
 * @param event
 * @param eventId
 * @param connection
 * @returns {Promise}
 */
const getEventParticipants = ({checkpoints, event, eventId, connection}) => {
    return new Promise((resolve, reject) => {
        participant_model.getForEvent(eventId, connection, (err, results) => {
            if (err) reject(err);

            const participants = results;

            resolve({participants, checkpoints, event, eventId, connection});
        });
    });
};

/**
 * Get times for each checkpoint and prepare return data for client
 *
 * @param participants
 * @param checkpoints
 * @param event
 * @param eventId
 * @param connection
 * @returns {Promise}
 */
const calculateCheckpoints = ({participants, checkpoints, event, eventId, connection}) => {
    return new Promise((resolve, reject) => {
        var checkpointsLeft = checkpoints.length;
        var allTimes = [];

        checkpoints.forEach(function (checkpoint) {
            // For each checkpoint get its times
            getCheckpointTimes(checkpoint.id, connection, (err, times) => {
                if(err) resolve(err);

                allTimes[checkpoint.id] = times;
                checkpointsLeft--;

                if (checkpointsLeft === 0) {

                    // Move times from checkpoints to participants object
                    var participantsTimes = moveTimesToParticipants(allTimes);

                    // Merge objects
                    participants = mergeParticipantsWithTimes(participants, participantsTimes);

                    resolve({event, checkpoints, participants});

                }
            })
        });
    });
};

/**
 * Returns all times from a given checkpoint
 *
 * @param checkpointId
 * @param connection
 * @param res
 * @param callback
 */
function getCheckpointTimes(checkpointId, connection, callback) {
    checkpoint_model.getCheckpointTimes(checkpointId, connection, function (err, results) {
        callback(err, results);
    })
}

/**
 * Returns array of all participants with their times from checkpoints
 *
 * @param allCheckpointsTimes =
 * [checkpoint_id] = {
 *      participant_id = ...
 *      time = ...
 * }
 *
 * @returns participantsTimes =
 * [participant_id] = {
 *      [checkpoint_id] = time
 * }
 */
function moveTimesToParticipants(allCheckpointsTimes) {
    var participantsTimes = [];
    allCheckpointsTimes.forEach(function (singleCheckpointTimes) {
        singleCheckpointTimes.forEach(function (singleTime) {
            var participantId = singleTime.participant_id;
            var checkpointId = singleTime.checkpoint_id;
            if (!participantsTimes[participantId]) {
                participantsTimes[participantId] = [];
            }
            participantsTimes[participantId][checkpointId] = singleTime.time;
        })
    });
    return participantsTimes;
}

/**
 * Returns merged array with all participants' data (including checkpoints times)
 *
 * @param participants
 * @param participantsTimes
 * @returns {Array}
 */
function mergeParticipantsWithTimes(participants, participantsTimes) {
    participants.forEach(function (participant) {
        if (typeof participantsTimes[participant.id] != "undefined") {
            participant.times = participantsTimes[participant.id];
        }
    });
    return participants;
}
module.exports = router;
