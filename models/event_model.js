var db = require('../db');

exports.getAll = function(connection, callback){
    var query = 'SELECT * FROM events ORDER BY id DESC';
    db.query(query, connection, callback);
};