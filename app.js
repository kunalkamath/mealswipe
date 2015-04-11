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
  res.send('Heorld!');
  console.log("hi");
});



