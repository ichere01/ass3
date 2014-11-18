// Express initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI 
  process.env.MONGOHQ_URL ||
  'mongodb:localhost/test'
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

// Cross domain
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", 'PUT, GET, POST');
	res.header("Access-Control-Allow-Origin", "X_Requested-With");
	next();
});


app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('locations', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>Locations</title></head><body><h1>What Did You Feed Me?</h1>";
				for (var count = 0; count < cursor.length; count++) {
					indexPage += "<p>" + cursor[count].fooditem + "</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>Locations</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

app.get('/locations.json', function (request, response) {
  // 
  response.set('Content-Type', 'text/html');
  var login = request.body.login; 
  students = db.locations.find();
  var documentArray = students.toArray();
  if(login == UNDEFINED){
  	response.send(JSON.stringify(characers, students));
  }
  else{
  	empty = [];
  	response.send(JSON.stringify(empty));
  }
}

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
		if (login == UNDEFINED || lat == UNDEFINED || lng == UNDEFINED
			response.send("missing info");
		}
		else{
			db.collection('locations', function(er, collection) {
				var id = collection.insert(toInsert, function(err, saved) {
					if (err) {
						response.send(500);
					}
					else {
						characters = [];
						students = db.locations.find();
						response.send(JSON.stringify(characers, students));
						response.send(200);
					}
			    });
			});
		}
});
app.get('/locations.json', function (request, response) 
{
	var request = new XMLHttpRequest();
  	request.open("get",/redline.json,true);
    request.onreadystatechange = function (){
         if(request.readyState == 4 && request.status == 200){
           data = JSON.parse(request.responsetext);
           
         }
       }
       request.send();
  
}

  




// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);