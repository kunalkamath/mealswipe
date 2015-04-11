// import
var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

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
      collection.count({"active":1,"location":locations[i]}, function(err,count){
        obj[locations[i]] = count;
      })
    }
    //Send JSON object back to the user
    res.send(obj);
    db.close();
  });
});
  

app.post("/:register", function(req, res){
  var params;
  if(req.params == null){
    console.log("done registering");
    params = {
      "name" : "Hari D",
      "phone" : "12345678",
      "email" : "abc1234@columbia.edu"
    } 
  }
  else{
    params = req.params;
  }
  console.log("in register");
  MongoClient.connect("mongodb://127.0.0.1:27017/test", function(err, db){
    if(err) throw err;
    var curCollection = db.collection('allLenders');
    var result = curCollection.insert({
        "name" : params["name"],
        "phone" : params["phone"],
        "email" : params["Email"],
        "numReqReceived" : {
          "John Jay" : 0,
          "Ferris" : 0,
          "Hewitt" : 0,
          "JJ's" : 0
        },
        "numReqAccepted" : {
          "John Jay" : 0,
          "Ferris" : 0,
          "Hewitt" : 0,
          "JJ's" : 0
        },
        "active" : 0,
        "location" : "",
        "school" : "Columbia"
      }, function(err, result){
          console.log(result);
          console.log(err);
        /*if (err){
          console.log('ERROR');
          console.log(error.message);
          return;
        }*/
      });
      db.close();
  });
  res.send("RDTFCGVBHJNK");
  console.log("done registering");
});

/*
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
  //get user id var id = 
  //get proper location var loc =
 
  collection.findAndModify({"id":id,"verified":1},[['a',1]],{$set{"active":1,"location":loc}});
  //Nothing to send back to user
  db.close();
});
});
*/

/*
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

  //get user id var id = 

  collection.findAndModify({"id":id,"verified":1},[['a',1]],{$set{"active":0,"location":""}});
  //Nothing to send back to user
  db.close();
});
});*/

/*
app.get('/:verify',function(req,res){
  //Start connection
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
  //Open the proper database
  //Change this later to adapt to user parameters
  var collection = db.collection("Columbia");
  
  //Get id var id =
  
  collection.findAndModify({"id":id},[['a',1]],{$set{"verified":1}});
  db.close();
});
*/
