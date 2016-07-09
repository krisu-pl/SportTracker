/**
 * Sends query to database
 *
 * @param query - SQL query
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.query = function(query, connection, callback){
    connection.query(query, [], function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
};