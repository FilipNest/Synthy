var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

//Listen to incoming connections on port 1337

app.listen(1337);

function handler (req, res) {};

//Make a new nedb database to store pushed patterns in
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'memory', autoload: true });

//RAM storage of the last pattern that was pushed. Eventually can replace this with a playlist of all pushed entries.

var previous = null;

io.on('connection', function (socket) {

    socket.emit('synth', previous);

    //On receiving a pattern, save it in memory and the database and emit it to everyone on the page

    socket.on('bundle', function (data) {

        previous = data;
        db.insert(data);

        io.sockets.emit('synth', previous);
      });
});