var express   = require('express');
var app       = express();
var socketio  = require('socket.io');
var Chance = require('chance');
var moment = require('moment');

var satelize = require('satelize');
var bodyParser = require('body-parser'); 

var chance = new Chance();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
}));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/signup', function(req, res) {
	var ip = req.body.context.ip;
	var type = req.body.type;
	var event = req.body.event;

		console.log("ip \t-> " + ip);
		console.log("type \t-> " + type);
		console.log("event \t-> " + event);

		satelize.satelize({ip:ip, timeout:3000}, function(err, geoData) {
			if (err) { console.log(err); }
			else {
				var obj = JSON.parse(geoData);

				var country = obj.country;
				var longitude = obj.longitude;
				var latitude = obj.latitude;
				var iso = obj.country_code;

				coordinates = {
					event : event,
					latitude : latitude,
					longitude : longitude,
					country: country,
					iso: iso,
					ip: ip,
					type: plans[chance.natural({min: 0, max: (plans.length - 1)})],
					time: moment().format('HH:mm:ss')
				};

				io.emit('new', coordinates);

				console.log(obj);
				console.log("\n");
			}
		});
});

var server    = app.listen(3000);
var io        = socketio.listen(server);
var plans = ['Free', 'Crystal', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

io.sockets.on('connection', function (socket) {
  console.log('a user connected');
});

// setInterval(function(){
// 	coordinates = {
// 		latitude : chance.latitude(),
// 		longitude : chance.longitude(),
// 		country: chance.country({ full: true }),
// 		ip: chance.ip(),
// 		type: plans[chance.natural({min: 0, max: (plans.length - 1)})],
// 		time: moment().format('hh:mm:ss')
// 	};

// 	io.emit('new', coordinates);
// }, 1000);
//}, chance.natural({min: 4000, max: 20000}));