// import
var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format,
    nodemailer = require('nodemailer');

var app = express();
var mongoHost = 'localhost';
var mongoPort = 27017;

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address())
  console.log('Express server listening on port: %s', host, port);
});

app.get('/active', function(req, res) {
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    // TODO: Change this later to adapt to user parameters
    var coll = db.collection("allLenders");
    //Assume this is the list of locations in that coll
    var locations = ["John Jay","JJ's Place","Ferris Booth","Hewitt"];
    //Construct a JSON object to contain the number of people at each location
    var obj = {};
    var i;
    var done = 0;
    for (i = 0; i < locations.length ; i++){
      coll.count({"active":1,"location":locations[i]}, function(err,count){
        obj[locations[i]] = count;
        if (i == locations.length - 1) done = 1;
      })
    }
    //Send JSON object back to the user
    res.status(200).send(obj);
    while(done == 0);
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
    res.status(404).send("must include name, phone, and email in request");
    return;
  }

  MongoClient.connect("mongodb://127.0.0.1:27017/test", function(err, db){
    if(err) throw err;
    var coll = db.collection('allLenders');

    coll.insert([{"name" : params["name"],
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
          res.status(500).send("failed");
        } else {
          console.log("done registering");
          res.status(200).send("ok");
        }
        db.close();
      });
    });

    //Send an email to confirm registration
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
    var msg = [
    '<h1>Thank you for registering with Mealswype!</h1>',
    '<hr />',
    '<p>We hope to help you find and share meal swipes on campus.</p>',
    '<p>To proceed with your registration, please follow the link below:</p>',
    '<p><a href="localhost:3000/verify/IanC">localhost:3000/verify</a></p>',
    '<p>How to use the app once you&#39;re signed up:</p>',
    '<ul>',
    ' <li>Request</li>',
    ' <li>Swipe</li>',
    ' <li>Enjoy</li>',
    '</ul>'
    ].join('');

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


app.post('/setActive/:email', function(req,res){

  console.log(req.params); 

  console.log("Inside zone");
  
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    console.log(req.params);
    var coll = db.collection("allLenders");

    coll.update( { "email" : req.params.email }, 
                 { $set : { "active" : 1 } },
      function(err, doc) {
        if (err) { 
          res.status(500).send("failed in find and modify");
          console.log(err);
        }
        else {
          res.status(200).send("ok");
        }
    db.close();
      });

  });

});

app.post('/setInactive/:email', function(req,res){
    var params;

    console.log("Outside zone");

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
        res.status(404).send("must include email");
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

    collection.updateOne({"email":email,"verified":1},{$set:{"active":0,"location":""}}, function(err, doc){
        if(err) {
          console.log(err);
          res.status(500).send("failed");
        } else {
          console.log("here's the doc");
          //console.log(doc);
          console.log("moved to inactive");
          res.status(200).send("ok");
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
        res.status(404).send("must include email");
    }

    //Start connection
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var coll = db.collection("Columbia");
    
    var email = params["email"];
  
    coll.updateOne({"email":email},{$set:{"verified":1}}, function(err, doc) {
        if(err) {
          console.log(err);
          res.status(500).send("failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("something happened");
          res.status(200).send("ok");
        }
        db.close();
      });
  });
});


app.get('/accept/:email/:location', function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
      res.status(404).send("must include email");
    }

    var email = params["email"];
    var location = params["location"];
    var count = 0;

    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");

    //Increase the number of lent meals
    //Find current number
    collection.find({"email":email}).toArray(function(err, docs){
        if(err){
          console.log(err);
          res.status(500).send("failed");
        }
        else{
          count = docs[0]["numReqAccepted"][location];
          count += 1;
          console.log(docs[0]);
          res.status(200).send("ok");
        }
    });

    var update = {$set : {}};
    update.$set["numReqAccepted" + location] = count;
    collection.updateOne({"email":email},update, function(err, doc) {
        if(err) {
          console.log(err);
          res.status(500).send("failed");
        } else {
          console.log("here's the doc");
          console.log(doc);
          console.log("something happened");
          res.status(200).send("ok");
        }
        db.close();
    });
  });
});

app.get('/request/:email/:location',function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
      res.status(404).send("must include email");
    }

    var email = params["email"];
    var location = params["location"];
    var count = 0;

    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var collection = db.collection("Columbia");

    //Find active users in the right area, send notification
    collection.find({"active":1,"location":location}).toArray(function(err,docs){

        //Do something with this list
    });
    });
});