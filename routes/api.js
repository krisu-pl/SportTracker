var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');
var checkpoint_model = require('../models/checkpoint_model');
var event_controller = require('../controllers/event_controller');
var mobile_controller = require('../controllers/mobile_controller');

router.post('/checkpoint', function(req, res) {
    var data = req.body;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        checkpoint_model.insertTime(data, connection, function(err, results){
            if(err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            console.log(results);
            res.sendStatus(200);
        });
    });

    app.sockets.send('refresh', data);
});


router.post('/updateFromMobile', function (req, res) {

    app.sockets.send('refresh', data);
    res.sendStatus(200);
});


router.get('/mobile/getAllEvents', function(req, res) {
    event_controller.getAll(req, function (err, results) {
        if(err) {
            console.warn(err);
            res.sendStatus(500);
            return;
        }
        res.json(results);
    })
});

router.post('/mobile/login', function(req, res) {
    var data = req.body;
    mobile_controller.login(data, req, function (err, results) {
        if(err) {
            console.warn(err);
            res.sendStatus(500);
            return;
        }

        var participant = results;
        console.log(results);

        if(participant.length == 0) {
            res.sendStatus(400);
            return;
        }
        res.json(participant);
    });
});

module.exports = router;
