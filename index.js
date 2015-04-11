///////////////////////////////////////////// setup //////////////////////////////////////////////

// import
var http = require('http'),
    express = require('express'),
    path = require('path');

// set up express 
var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade'); 
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req,res) {
    res.render('404', {url:req.url});
});

// start server  
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// set up mongo client
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;
var mc = new MongoClient(new Server(mongoHost, mongoPort)); 
var mongoHost = 'ec2-54-69-87-192.us-west-2.compute.amazonaws.com'; 
var mongoPort = 27017; 
var cd;

// start mongo client
mc.open(function(err, mc) { 
  if (!mc) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); 
  }
  var db = mc.db("MyDatabase");  
  cd = new CollectionDriver(db); 
});

////////////////////////////// handle various types of http requests /////////////////////////////




// retrieve active users
app.get('/:active', function(req, res) {

} 


app.get('/:collection', function(req, res) { 
   var params = req.params; 
   cd.findAll(req.params.collection, function(error, objs) { 
			  if (error) { res.send(400, error); } 
	      else { 
	          if (req.accepts('html')) { 
			          res.render('data',{objects: objs, collection: req.params.collection}); 
              } else {
									res.set('Content-Type','application/json'); 
                  res.send(200, objs); 
              }
         }
		});
});
 
app.get('/:collection/:entity', function(req, res) { 
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
	console.log("trying to get");
	console.log(params);
	// basic get request
   if (entity.indexOf("$") == -1) {
       cd.get(collection, entity, function(error, objs) { 
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } 
       });
	 // geonear get request
	 // url format should be: ip:port/collectionName/$lat1_long1_lat2_long2
   } else if ( entity ){
			entity = entity.substring(1, entity.length);
			var coords = entity.split("_");
			console.log(coords);
			if (coords.length != 4) {
				res.send(400, {error: 'bad url does not contain the correct amount of lat/long coordinates. use format ip:port/collectionName/$lat1_long1_lat2_long2.', url: req.url});
			} else {
				for(var i=0; i<coords.length; i++)
					coords[i] = parseFloat(coords[i]);
			 cd.geoNear(collection, coords[0], coords[1], coords[2], coords[3], function(error, objs) { 
					if (error) { res.send(400, error); }
					else { res.send(200, objs); } 
			 });
			}	
	 } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

app.post('/:collection', function(req, res) { 
    var object = req.body;
    var collection = req.params.collection;
    cd.save(collection, object, function(err,docs) {
          if (err) { res.send(400, err); } 
          else { res.send(201, docs); } 
     });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       cd.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C
       });
   } else {
       var error = { "message" : "Cannot PUT a whole collection" };
       res.send(400, error);
   }
});

app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       cd.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
   }
});
