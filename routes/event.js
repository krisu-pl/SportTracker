var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');
var checkpoint_model = require('../models/checkpoint_model');
var participant_model = require('../models/participant_model');

/**
 * GET Event page - list of results
 */
router.get('/', function(req, res, next) {
    var eventId = req.query.id;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        // Get details for this event
        getEventDetails(eventId, connection, res, function (event) {
            // Get checkpoints for this event
            getEventCheckpoints(eventId, connection, res, function (checkpoints) {
                // Get participants for this event
                getEventParticipants(eventId, connection, res, function (participants) {

                    var checkpointsLeft = checkpoints.length;
                    var allTimes = [];

                    checkpoints.forEach(function (checkpoint){
                        // For each checkpoint get its times
                        getCheckpointTimes(checkpoint.id, connection, res, function (times){
                            allTimes[checkpoint.id] = times;
                            checkpointsLeft--;

                            if(checkpointsLeft === 0){

                                // Move times from checkpoints to participants object
                                var participantsTimes = moveTimesToParticipants(allTimes);

                                // Merge objects
                                participants = mergeParticipantsWithTimes(participants, participantsTimes);

                                // Render final view
                                res.render('event_details', {
                                    event: event,
                                    checkpoints: checkpoints,
                                    participants: participants
                                });
                            }
                        })
                    });
                })
            })
        });

    });
});

/**
 * Returns event details
 *
 * @param eventId
 * @param connection
 * @param res
 * @param callback
 */
function getEventDetails(eventId, connection, res, callback){
    event_model.getDetails(eventId, connection, function (err, results) {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        if (results.length == 0) {
            // No such event
            res.sendStatus(401);
            return;
        }

        callback(results[0]);
    });
}

/**
 * Returns checkpoints of the event
 *
 * @param eventId
 * @param connection
 * @param res
 * @param callback
 */
function getEventCheckpoints(eventId, connection, res, callback){
    checkpoint_model.getForEvent(eventId, connection, function(err, results) {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        callback(results);
    });
}

/**
 * Returns participants of the event
 *
 * @param eventId
 * @param connection
 * @param res
 * @param callback
 */
function getEventParticipants(eventId, connection, res, callback){
    participant_model.getForEvent(eventId, connection, function(err, results) {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        callback(results);
    })
}

/**
 * Returns all times from a given checkpoint
 *
 * @param checkpointId
 * @param connection
 * @param res
 * @param callback
 */
function getCheckpointTimes(checkpointId, connection, res, callback){
    checkpoint_model.getCheckpointTimes(checkpointId, connection, function(err, results) {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        callback(results);
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
function moveTimesToParticipants(allCheckpointsTimes){
    var participantsTimes = [];
    allCheckpointsTimes.forEach(function(singleCheckpointTimes){
        singleCheckpointTimes.forEach(function (singleTime) {
            var participantId = singleTime.participant_id;
            var checkpointId = singleTime.checkpoint_id;
            if(!participantsTimes[participantId]) {
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
function mergeParticipantsWithTimes(participants, participantsTimes){
    participants.forEach(function (participant) {
        if(typeof participantsTimes[participant.id] != "undefined"){
            participant.times = participantsTimes[participant.id];
        }
    });
    return participants;
}
module.exports = router;
