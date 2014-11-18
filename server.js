// Express initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/test'
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

// Cross domain
app.use(express.bodyParser());
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", 'PUT, GET, POST');
	res.header("Access-Control-Allow-Origin", "X_Requested-With");
	next();
});


app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>ks!</p>');
});

app.post('/sendlocation', function(request, response) {
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var created_at = new Date();

	var toInsert = {
		"login": login,
		"lat": lat,
		"lng" = lng,
		"created_at" = created_at,
	};
	//CHECK FOR MISSING FIELDS (UNDEFINED)

	db.collection('locations', function(er, collection) {
		var id = collection.insert(toInsert, function(err, saved) {
			if (err) {
				response.send(500);
			}
			else {
				response.send(200);
			}
	    });
	});
});



// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);