var io = require('socket.io')();
var http = require('http').Server(app);

exports.init = function () {
    io.attach(http);

    io.on('connection', function(socket){
        console.log('a user connected');

        /**
         * Add client to a room (event) with a given id
         * Client is added to the room to receive updates only about the specific event.
         */
        socket.on('follow-event', function(eventId){
            socket.join(eventId);
            console.log('Client is following event: ' + eventId);
        });
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
};

exports.send = function(eventName, data){
  io.emit(eventName, data);
};

/**
 * Sends data to a given socket
 *
 * @param clientId - socket id
 * @param data
 */
function sendToClient (clientId, data) {
    io.to(clientId).emit('refresh', data);
};

/**
 * Sends data to sockets within a given room (event)
 *
 * @param roomId - event id
 * @param data
 */
exports.sendToRoom = function (roomId, data) {
    io.to(roomId).emit('refresh', data);
};