const express = require('express');
const router = express.Router();

const event_model = require('../models/event_model');
const checkpoint_model = require('../models/checkpoint_model');
const event_controller = require('../controllers/event_controller');
const participant_controller = require('../controllers/participant_controller');
const mobile_controller = require('../controllers/mobile_controller');

router.post('/checkpoint', (req, res) => {
    const data = req.body;

    req.getConnection((err, connection) => {
        if (err) return next(err);

        checkpoint_model.insertTime(data, connection, (err, results) => {
            if(err) {
                console.error(err);
                res.sendStatus(500);
                return;
            }
            console.log(results);
            console.log(data);
            app.sockets.sendEventUpdate(data.event_id, data);
            res.sendStatus(200);
        });
    });

});

router.get('/mobile/getAllEvents', (req, res) => {
    event_controller.getAll(req, (err, results) => {
        if(err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        res.json(results);
    })
});

router.post('/mobile/login', (req, res) => {
    const data = req.body;
    mobile_controller.login(data, req, (err, results)  => {
        if(err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        const participant = results;
        console.log(results);

        if(participant.length == 0) {
            res.sendStatus(400);
            return;
        }
        res.json(participant);
    });
});

/**
 * Adds new participant's location to the database
 *
 * data = {
 *  participant_event_id: {Int}
 *  lat: {Double}
 *  lng: {Double}
 * }
 */
router.post('/mobile/sendLocation', (req, res) => {
    const data = req.body;

    mobile_controller.saveLocation(data, req, (err)  => {
        if(err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        // Send location update to clients
        app.sockets.sendLocationUpdate(data.participant_event_id, data);

        res.sendStatus(200);
    });
});

module.exports = router;
