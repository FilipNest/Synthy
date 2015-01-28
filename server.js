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

var latest = null;

db.find({}).sort({_id:1}).skip(0).limit(1).exec(function (err, docs) {
  
    latest = docs[0];
    
    //Get count of patterns

    db.count({}, function (err, count) {
      latest.count = count;
    });
        
    });   

io.on('connection', function (socket) {

    socket.emit('synth', latest);

    //On receiving a pattern, save it in memory and the database and emit it to everyone on the page

    socket.on('bundle', function (data) {

        var oldcount = latest.count;
        latest = data;
        latest.count = oldcount+1;
        db.insert(data);

        io.sockets.emit('synth', latest);
      });
    
    //Call to get another bundle from database
   socket.on('memory', function(data){
      
    db.find({}).sort({_id:-1}).skip(data).limit(1).exec(function (err, docs) {
  
    socket.emit('synth',docs[0]);    
        
    });   
       
   });
    
    
});