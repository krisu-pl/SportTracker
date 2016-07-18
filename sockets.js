var io = require('socket.io')();
var http = require('http').Server(app);


io.attach(http);

io.on('connection', function(socket){
    console.log('a user connected - ' + socket.id);

    /**
     * Add client to a room (event) with a given id
     * Client is added to the room to receive updates only about the specific event.
     */
    socket.on('follow-event', function(eventId){
        socket.join(`event-${eventId}`);
        console.log(`Client ${socket.id} is following event: ${eventId}`);
    });

    socket.on('follow-participant', function(participantId){
        socket.join(`participant-${participantId}`);
        console.log(`Client ${socket.id} is following participant: ${participantId}`);
    });
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});

/**
 * Sends data to sockets within a given room (event)
 *
 * @param roomId - event id
 * @param data
 */
exports.sendEventUpdate = function (eventId, data) {
    io.to(`event-${eventId}`).emit('refresh', data);
};


exports.sendLocationUpdate = function (participantId, data) {
    console.log('sending update to ' + `participant-${participantId}`);
    console.log(participantId);
    console.log(data);
    io.to(`participant-${participantId}`).emit('location-update', data);
};