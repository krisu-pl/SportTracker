var io = require('socket.io')();
var http = require('http').Server(app);

var sockets = {};

sockets.init = function () {
    io.attach(http);

    io.on('connection', function(socket){
        console.log('a user connected');

        setTimeout(function(){
            var data = {
                contestants: [
                    {
                        name: "Wiesław Gaszyński",
                        time: "2:35:32"
                    }
                ]
            };
            io.emit('refresh', data);
        }, 3000);

        setTimeout(function(){
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
            io.emit('refresh', data);
        }, 6000);

        setTimeout(function(){
            var data = {
                contestants: [
                    {
                        name: "Wiesław Gaszyński",
                        time: "2:35:32"
                    },
                    {
                        name: "Adam Kowalski",
                        time: "2:44:02"
                    },
                    {
                        name: "Jan Nowak",
                        time: "2:49:02"
                    }
                ]
            };
            io.emit('refresh', data);
        }, 9000);
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
};

sockets.send = function(eventName, data){
  io.emit(eventName, data);
};

module.exports = sockets;