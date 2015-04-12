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

app.get('/fruit/:fruitName/:fruitColor/:fruitWeight', function(req, res) {
    var data = {
        "fruit": {
            "name": req.params.fruitName,
            "color": req.params.fruitColor,
            "weight" : req.params.fruitWeight
        }
    }; 
    console.log(data);
    res.send(data["fruit"]["apple"]);
});

app.get('/active', function(req, res) {
  console.log(req.params);
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
    obj["hello"] = "is this working?";
    //Send JSON object back to the user
    res.send(obj);
    db.close();
  });
});

app.post('/register/:name/:phone/:email', function(req, res){
  var params;


  if(req.params.name){
    params = req.params;
    console.log(params);
  }
  else {
    res.send(404, "must include name, phone, and email in request");
  }

  MongoClient.connect("mongodb://127.0.0.1:27017/test", function(err, db){
    if(err) throw err;
    var collection = db.collection('allLenders');

    collection.insert([{"name" : params["name"],
      "phone" : params["phone"],
      "email" : params["email"],
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
      "verified" : 0,
      "school" : "Columbia"
      }], function(err, result) {
        if(err) {
          console.log(err);
          res.send(500, "failed");
        } else {
          console.log("done registering");
          res.send(200, "ok");
        }
        db.close();
      });
    });

    //Send an email to confirm registration
    var nodemailer = require('nodemailer');
    // Create a SMTP transporter object
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cumealswipe@gmail.com',
            pass: 'speakinguntonationss'
        }
    });
    //Gather info for email
    var name = params["name"];
    var email = params["email"];
    var usr = name+" <"+email+">";
    var url = 'localhost:3000/verify/'+params["email"];
    var partialurl = 'localhost:3000/verify';
    //Construct email body in HTML format
    var msg = '<p><strong>Thank you for registering with MealShare!</strong>';
    msg += '</p><p>To complete your registration click the link below:</p><p>';
    msg += '<a href="';
    msg += url;
    msg += '">';
    msg += partialurl;
    msg += '</a></p>';
    // Message object
    var message = {
        // sender info
        from: 'CUMealSwipe <cumealswipe@gmail.com>',
        // Recipient
        to: usr,
        // Subject of the message
        subject: 'MealSwiper Registration Confirmation', 
        // HTML body
        html: msg,
    };
    //Send it
    transporter.sendMail(message, function(error, info) {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        else{
          console.log("email sent");
        }
    });
});


app.get('/setActive/:email/:location', function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
        res.send(404, "must include email");
    }

    //Start connection
    var MongoClient = require('mongodb').MongoClient,
        format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");
    
    var email = params["email"];
    var location = params["location"];
   
    collection.findAndModify({"email":email,"verified":1},[['a',1]],{$set:{"active":1,"location":location}},function(err,doc){
        if(err) {
          console.log(err);
          res.send(500, "failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("moved to active");
          res.send(200, "ok");
        }
        db.close();
    });
  });
});



app.get('/setInactive/:email', function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
        res.send(404, "must include email");
    }

    //Start connection
    var MongoClient = require('mongodb').MongoClient,
        format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");
    
    var email = params["email"];

    collection.findAndModify({"email":email,"verified":1},[['a',1]],{$set:{"active":0,"location":""}}, function(err, doc){
        if(err) {
          console.log(err);
          res.send(500, "failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("moved to inactive");
          res.send(200, "ok");
        }
        db.close();

    });
  });
});


app.get('/verify/:email',function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
        res.send(404, "must include email");
    }

    //Start connection
    var MongoClient = require('mongodb').MongoClient,
        format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");
    
    var email = params["email"];
  
    collection.findAndModify({"email":email},[['a',1]],{$set:{"verified":1}}, function(err, doc) {
        if(err) {
          console.log(err);
          res.send(500, "failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("something happened");
          res.send(200, "ok");
        }
        db.close();
      });

  });
});


app.get('/accept/:email'), function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
      res.send(404,"must include email");
    }

    //Start connection
    var MongoClient = require('mongodb').MongoClient,
        format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");
    
    var email = params["email"];

    //Increase the number of lent meals
    //Send some kind of notification to lendee
    collection.findAndModify({"email":email},[['a',1]],{$set:{"verified":1}}, function(err, doc) {
        if(err) {
          console.log(err);
          res.send(500, "failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("something happened");
          res.send(200, "ok");
        }
        db.close();
      });

});
