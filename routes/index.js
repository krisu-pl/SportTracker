var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var data = {
        contestants: [
            {
                name: "Wiesław Gaszyński",
                time: "2:35:32"
            },
            {
                name: "Adam Kowalski",
                time: "2:44:02"
            }
        ]
    };
  //res.render('index', data);

    res.sendFile('public/index.html');
});

module.exports = router;
