var express   = require('express');
var app       = express();
var socketio  = require('socket.io');
var Chance = require('chance');
var moment = require('moment');

var chance = new Chance();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

var server    = app.listen(3000);
var io        = socketio.listen(server);
var plans = ['Free', 'Crystal', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

io.sockets.on('connection', function (socket) {
  console.log('a user connected');
});

setInterval(function(){
	coordinates = {
		latitude : chance.latitude(),
		longitude : chance.longitude(),
		country: chance.country({ full: true }),
		ip: chance.ip(),
		type: plans[chance.natural({min: 0, max: (plans.length - 1)})],
		time: moment().format('hh:mm:ss')
	};

	io.emit('new', coordinates);
}, 1000);
//}, chance.natural({min: 4000, max: 20000}));