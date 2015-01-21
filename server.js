var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1337);

var previous = null;

function handler (req, res) {
    res.writeHead(200);
    console.log(previous);
    res.end(previous);
  };

io.on('connection', function (socket) {
socket.emit('synth', previous);
  socket.on('bundle', function (data) {
    previous = data;
    io.sockets.emit('synth', previous);
  });
});