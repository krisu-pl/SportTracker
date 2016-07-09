var express = require('express');
var router = express.Router();

var event_model = require('../models/event_model');
var checkpoint_model = require('../models/checkpoint_model');

router.post('/checkpoint', function(req, res) {
    var data = req.body;
    //
    //
    //var data = {
    //    contestants: [
    //        {
    //            name: "Wiesław Gaszyński",
    //            time: "2:35:32"
    //        },
    //        {
    //            name: "Adam Kowalski",
    //            time: "2:44:02"
    //        },
    //        {
    //            name: "Jan Nowak",
    //            time: "2:49:02"
    //        },
    //        {
    //            name: "Andrzej Krawczyk",
    //            time: "2:59:12"
    //        }
    //    ]
    //};

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

    app.sockets.send('refresh', data)
    res.sendStatus(200);
});

module.exports = router;
