var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');

/**
 * GET Homepage - Choose an event
 */
router.get('/', function(req, res, next) {
    var eventId = req.query.id;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        event_model.getDetails(eventId, connection, function(err, results){
            if(err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            if(results.length == 0) {
                res.sendStatus(401);
                return;
            }
            console.log(results);

            res.render('event_details', {event: results[0]});
        });
    });
});

module.exports = router;
