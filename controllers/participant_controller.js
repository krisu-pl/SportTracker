const participant_model = require('../models/participant_model');

/**
 * Returns connection to the database
 *
 * @param data
 * @param req
 * @returns {Promise}
 */
const getConnection = ({data, req}) => {
    return new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
            if (err) reject(err);
            resolve({data, connection});
        });
    });
};


const insertLocation = ({data, connection}) => {
    return new Promise((resolve, reject) => {
        participant_model.insertLocation(data, connection, (err, results) => {
            if (err) reject(err);
            resolve();
        });
    });
};

exports.saveLocation = function(data, req, callback){
    getConnection({data, req})
        .then(insertLocation)
        .then(() => {
            callback(null)
        })
        .catch((err) => {
            callback(err)
        });
};