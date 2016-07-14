/**
 * Sends query to database
 *
 * @param query - SQL query
 * @param connection - created by express-myconnection
 * @param callback - function(err, results)
 */
exports.query = (query, connection, callback) => {
    connection.query(query, [], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
};