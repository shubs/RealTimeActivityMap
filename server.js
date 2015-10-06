var express   = require('express');
var app       = express();
var socketio  = require('socket.io');
var Chance = require('chance');
var moment = require('moment');
var bodyParser = require('body-parser'); 
var request = require('request');
var chance = new Chance();

var number = 0;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
app.use(express.static('public'));
	  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});


app.post('/signup', function(req, res) {
	var ip = req.body.context.ip;
	var type = req.body.type;
	var event = req.body.event;

	// segmentio specific
	if (type == 'track'){
		console.log("ip \t-> " + ip);
		console.log("type \t-> " + type);
		console.log("event \t-> " + event);

		request('http://ip-api.com/json/'+ip+'', function (error, response, body) {
		 	if (!error && response.statusCode == 200) {
				var obj = JSON.parse(body);

				var country = obj.country;
				var longitude = obj.lon;
				var latitude = obj.lat;
				var iso = obj.countryCode;

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
			else{
				console.log(error, response.statusCode);
			}
		});
	}
});

var server    = app.listen(3000);
var io        = socketio.listen(server);
var plans = ['Free', 'Crystal', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  number++;
});

setInterval(function(){
	console.log(number + " Users online");
}, 1000);


