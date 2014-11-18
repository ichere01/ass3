// Express initialization
var express = require('express');
var app = express();

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/test'
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>ks!</p>');
});

app.post('/sendlocation', function(request, response) {
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;

	var toInsert = {
		"login": login,
		"lat": lat,
		"lng" = lng,
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