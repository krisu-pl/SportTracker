var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');

/**
 * GET Homepage - Choose an event
 */
router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        event_model.getAll(connection, function(err, results){
            if(err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            var events = [];
            results.forEach(function (item) {
                events.push(item);
            });
            res.render('event_select', {events: events});
        });
    });
});

module.exports = router;
