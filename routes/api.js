var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');
var checkpoint_model = require('../models/checkpoint_model');
var event_controller = require('../controllers/event_controller');

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
    console.log('uuu');
    event_controller.getAll(req, function (err, results) {
        if(err) {
            console.warn(err);
            //res.sendStatus(500);
            return;
        }
        res.json(results);
    })
});

module.exports = router;