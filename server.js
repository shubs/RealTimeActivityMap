var express   = require('express');
var app       = express();
var socketio  = require('socket.io');
var Chance = require('chance');
var moment = require('moment');
var bodyParser = require('body-parser'); 
var request = require('request');
var path    = require("path");
var chance = new Chance();

var ip = ["77.132.40.134", "80.67.176.198", "::1"]
var users = [];

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(express.static('public'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
}));

app.get('/', function (req, res) {
	console.log('GET / req.ip -> ' + req.ip);
  	if (ip.indexOf(req.ip)  > -1)
		res.sendFile(path.join(__dirname+'/public/map.html'));
	else
		res.send('Ask me to allow your IP ('+req.ip+') by sending an Email to shubham@mailjet.com ;)');
});

app.get('/globe', function (req, res) {
	res.sendFile(path.join(__dirname+'/public/globe.html'));
});


app.post('/signup', function(req, res) {
	var ip = req.body.context.ip;
	var type = req.body.type;
	

	// segmentio specific
	if (type == 'page'){
	var event = req.body.event;
		var event = req.body.context.page.path;
	}
	else if (type == 'track'){
		var event = req.body.event
	

		console.log("ip \t-> " + ip);
		console.log("type \t-> " + type);
		console.log("event \t-> " + event);

		request('http://www.telize.com/geoip/'+ip+'', function (error, response, body) {
		 	if (!error && response.statusCode == 200) {
				var obj = JSON.parse(body);

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
			else{
				console.log(error, response.statusCode);
			}
		});
	}
});

var server    = app.listen(1338);
var io        = socketio.listen(server);
var plans = ['Free', 'Crystal', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  var address = socket.handshake.address;
  console.log('New connection from ' + address.address );
  users.push(address);
});

setInterval(function(){
	console.log(users);
}, 1000);


