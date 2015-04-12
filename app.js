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
    obj["hello"] = "is this working?";
    //Send JSON object back to the user
    res.send(obj);
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
    res.send(404, "must include name, phone, and email in request");
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
          res.send(500, "failed");
        } else {
          console.log("done registering");
          res.send(200, "ok");
        }
        db.close();
      });
    });

    //Send an email to confirm registration
    // Create a SMTP transporter object
    var transporter = nodemailer.createTransport({
        seirvice: 'Gmail',
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


app.post('/setActive/:name', function(req,res){

 console.log(req.params); 

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    console.log(req.params);
    var coll = db.collection("allLenders");

    coll.update( { "name" : req.params.name }, 
                 { $set : { "active" : 1 } },
      function(err, doc) {
        if (err) { 
          res.status(500).send("failed in find and modify");
          console.log(err);
        }
        else {
          res.status(200).send("ok");
        }
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

    collection.updateOne({"email":email,"verified":1},{$set:{"active":0,"location":""}}, function(err, doc){
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
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) throw err;
    //Open the proper database
    //Change this later to adapt to user parameters
    var coll = db.collection("Columbia");
    
    var email = params["email"];
  
    coll.updateOne({"email":email},{$set:{"verified":1}}, function(err, doc) {
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


app.get('/accept/:email/:location', function(req,res){
    var params;

    if(req.params.email){
        params = req.params;
        console.log(params);
    }
    else {
      res.send(404,"must include email");
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
          res.send(500,"failed");
        }
        else{
          count = docs[0]["numReqAccepted"][location];
          count += 1;
          console.log(docs[0]);
          res.send(200,"ok");
        }
    });
  });
});
