var db = require('../db');

/**
 * Returns all events
 *
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.getAll = function(connection, callback){
    var query = 'SELECT * FROM events ORDER BY id DESC';
    db.query(query, connection, callback);
};


/**
 * Returns details of a given event
 *
 * @param id
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.getDetails = function (id, connection, callback) {
    var query = 'SELECT * FROM events WHERE id = "' + id + '"';
    db.query(query, connection, callback);
};