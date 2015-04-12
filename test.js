// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public/OoT-Bingo'));

// Chatroom

// usernames which are currently connected to the chat
var rooms = {};
var numRooms = 0;

io.on('connection', function (socket) {
  socket.on('join', function(user, room) {
    console.log("join: " + user + ", " + room);
    if (typeof user != 'string') return;
    if (rooms[room] && rooms[room].users.indexOf(user) > -1) { socket.join(room); socket.emit('init', rooms[room].colours, rooms[room].selected); return; }
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = {};
      rooms[room].users = [];
      rooms[room].colours = {};
      rooms[room].selected = [['','','','',''],
                              ['','','','',''],
                              ['','','','',''],
                              ['','','','',''],
                              ['','','','','']];
      setTimeout(function() {
        console.log(room + " deleted");
        delete rooms[room];
      }, 18000000);
    }
    console.log(rooms[room].selected);
    rooms[room].users.push(user);
    socket.broadcast.to(room).emit('join', user);
    socket.emit('init', rooms[room].colours, rooms[room].selected);
  });
  socket.on('select', function(user, x, y) {
    console.log("select: " + user + ", " + x + ", " + y);
    if(socket.rooms.length < 2) { console.log("not in room"); return; }
    var room = socket.rooms[1];
    if(rooms[room].users.indexOf(user) == -1) { console.log("user not in room"); return; }
    if (x < 0 || x > 4 || y < 0 || y > 4) { console.log("invalid loc"); return; }
    if (rooms[room].selected[x][y] != '') { console.log("already selected"); return; }
    rooms[room].selected[x][y] = user;
    socket.broadcast.to(room).emit('select', user, x, y);
  });
  socket.on('deselect', function(user, x, y) {
    console.log("deselect: " + user + ", " + x + ", " + y);
    if(socket.rooms.length < 2) { console.log("not in room"); return; }
    var room = socket.rooms[1];
    if(rooms[room].users.indexOf(user) == -1) { console.log("user not in room"); return; }
    if (x < 0 || x > 4 || y < 0 || y > 4) { console.log("invalid loc"); return; }
    if (rooms[room].selected[x][y] != user) { console.log("not selected"); return; }
    rooms[room].selected[x][y] = '';
    socket.broadcast.to(room).emit('deselect', user, x, y);
    console.log(user + " deselected " + x + ", " + y);
  });
  socket.on('setcolour', function(user, colour) {
    console.log("setcolour: " + user + ", " + colour);
    var room = socket.rooms[1];
    rooms[room].colours[user] = colour;
    socket.broadcast.to(room).emit('setcolour', user, colour);
  });
});