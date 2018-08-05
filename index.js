var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('an anonymous user connected');
	
	socket.on('disconnect', function() {
		// we use io here instead of socket, because if socket disconnected
		// then we no longer have access to it
		io.emit('user disconnected', "a user disconnected :(");
		console.log('user disconnected');
	});
	
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('set nickname', function(name) {
		// we use io here instead of socket, because if socket disconnected
		// then we no longer have access to it
		socket.broadcast.emit('user connected', name);
		console.log('nickname: ' + name);
	});
})

http.listen(3000, function() {
	console.log('listening on *:3000');
});
