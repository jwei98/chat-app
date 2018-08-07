var app = require('express')();

// set up hbs view engine
var exphbs= require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var http = require('http').Server(app);
var io = require('socket.io')(http);

// keep track of who's online
var online_users = new Map();

// serve main page
app.get('/', function(req, res) {
	res.render('home', {users: Array.from(online_users.values())});
});

// callback functions
// TODO: refactor callbadks to another page
function disconnect(socket_id) {
	var name = online_users.get(socket_id);
	online_users.delete(socket_id);
	io.emit('user disconnected', name);
}

function chat_message(msg) {
	 io.emit('chat message', msg);
}

function set_nickname(socket_id, name) {
	online_users.set(socket_id, name);
	io.emit('user connected', name);
}

// socket watchers
io.on('connection', function(socket) {
	console.log(socket.id + " has connected!");

	socket.on('disconnect', function() {
		disconnect(socket.id);
	});
	socket.on('chat message', chat_message);
	socket.on('set nickname', function (name) {
		set_nickname(socket.id, name);
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
