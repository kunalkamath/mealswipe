// import
var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var app = express();
var mongoHost = 'localhost';
var mongoPort = 27017;

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address())
  console.log('Express server listening on port: %s', host, port);
});

app.get('/', function (req, res) {

  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {
      collection.count(function(err, count) {
        console.log(format("count = %s", count));
        res.send(format("count = %s", count));
      });
      collection.find().toArray(function(err, results) {
        console.dir(results);
        db.close();
      });
    });
  });
});

app.get('/:active', function(req, res) {
  //Start connection
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
  //Open the proper database
  //Change this later to adapt to user parameters
  var collection = db.collection("Columbia");
  //Assume this is the list of locations in that collection
  var locations = ["John Jay","JJ's Place","Ferris Booth","Hewitt"];
  //Construct a JSON object to contain the number of people at each location
  var obj = {};
  var i;
  for (i = 0; i < locations.length ; i++){
    var num = collection.count({active : 1, location : locations[i]});
    obj[locations[i]] = num;
  }
  //Send JSON object back to the user
  res.send(obj);
  db.close();
});
  

app.post(":/register", function(req, resp)){

    var params = req.params;
  var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

  MongoClient.connect('mongodb:127.0.0.1:27017/test', function(err, db){
    var curCollection = db.collection('allLenders');
    var result = collection.insert([
        "name" : params["name"],
        "phone" : params["phone"],
        "email" : params["Email"],

        numReqReceived : {
          "John Jay" : 0,
          "Ferris" : 0,
          "Hewitt" : 0,
          "JJ's" : 0
        },
        numReqAccepted : {
          "John Jay" : 0,
          "Ferris" : 0,
          "Hewitt" : 0,
          "JJ's" : 0
        },
        "active" : 0,
        "location" : "",
        "school" : "Columbia"
      ]);

      db.close();

  }
  console.log(result.results);

});



});

app.get('/:setActive', function(req,res){
  //Start connection
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
  //Open the proper database
  //Change this later to adapt to user parameters
  var collection = db.collection("Columbia");
  //Fix everything based on req format
  //And storing of user id
  var id = //get user id
  var loc = //get proper location
  /* Old code did not use findAndModify
  var doc = collection.find({"id" :id}).limit(1);
  doc["active"] = 1;
  doc["location"] = loc;
  */
  collection.findAndModify({"id":id,"verified":1},[['a',1]],{$set{"active":1,"location":loc}});
  //Nothing to send back to user
  db.close();
});
});


app.get('/:setInactive', function(req,res){
  //Start connection
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
  //Open the proper database
  //Change this later to adapt to user parameters
  var collection = db.collection("Columbia");
  //Fix everything based on req format
  //And storing of user id
  var id = //get user id
  /* Old code did not use findAndModify
  var doc = collection.find({"id" :id}).limit(1);
  doc["active"] = 0;
  doc["location"] = "";
  */
  collection.findAndModify({"id":id,"verified":1},[['a',1]],{$set{"active":0,"location":""}});
  //Nothing to send back to user
  db.close();
});
});

app.get('/:verify',function(req,res){
  //Start connection
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
  //Open the proper database
  //Change this later to adapt to user parameters
  var collection = db.collection("Columbia");
  var id = //get ID
  /* Old code did not use findAndModify
  var doc = collection.find({"id" : id}).limit(1);
  doc["verified"] = 1;
  */
  collection.findAndModify({"id":id},[['a',1]],{$set{"verified":1}});
  db.close();
});