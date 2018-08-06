var express = require('express');
var exphbs= require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var online_users = [];

app.get('/', function(req, res) {
	res.render('home', {users: online_users});
});

function disconnect() {
	io.emit('user disconnected', "a user disconnected :(");
	// add logic to remove username from list when they disconnect
	console.log('user disconnected');
}

function chat_message(msg) {
	 io.emit('chat message', msg);
}

function set_nickname(name, socket) {
	// we use io here instead of socket, because if socket disconnected
	// then we no longer have access to it
	online_users.push(name);
	io.emit('user connected', {
		name: name,
		onlineUsers: online_users
	});
	console.log('online users: ' + online_users);
}

io.on('connection', function(socket) {
	console.log('an anonymous user connected');
	
	socket.on('disconnect', disconnect);
	
	socket.on('chat message', chat_message);

	socket.on('set nickname', function(name) {
		set_nickname(name, socket);
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
