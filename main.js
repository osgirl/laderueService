/**
 * Created by sbull on 7/11/15.
 */
var crypto = require('crypto');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();

var shasum = crypto.createHash('sha1');

var truckNames = {
  results: [{
    name: 'Pizza Palace',
    currentLocation: null,
    lastKnownLocation: null,
    isOpen: '1'

  }, {
    name: 'Cheese Me',
    currentLocation: null,
    lastKnownLocation: null,
    isOpen: '0'
  }, {
    name: 'Creepy Creps',
    currentLocation: null,
    lastKnownLocation: null,
    isOpen: '1'
  }, {
    name: 'Philly\'s',
    currentLocation: null,
    lastKnownLocation: null,
    isOpen: '1'
  }, ]
};

// localhost:8080/newTruck?name=tonka truck&email=spencerbull2554@gmail.com&surname=Bull&forname=Spencer&home=Austin&food=good
// Connection URL for MongoDB
var url = 'mongodb://localhost:27017';

app.get('/newTruck', function(req, res) {
  var name = req.query.name;
  var email = req.query.email;
  var forename = req.query.forname;
  var surname = req.query.surname;
  var home = req.query.home;
  var food = req.query.food;
  var id = crypto.createHash('sha1').update(email).digest('hex');
  var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert(
      [{
        _id: id,
        name: name,
        email: email,
        forename: forename,
        surname: surname,
        food: food
      }],
      function(err, result) {
        // catch if there was an error and send it back. Doesn't break the program this way.
        if (err) {
          console.log("There was an error. Error: " + err);
          res.send("The infomration could not be inserted. ERROR: " + err);
        } else {
          // assert.equal(err, null);
          // assert.equal(1, result.result.n);
          // assert.equal(1, result.ops.length);
          console.log("Inserted 1 document into the document collection");
          res.send("Inserted 1 document into the document collection");
        }
        console.log("-----------------------------------------------------------------");
        callback(result, err);
      });
  };
  var error = 0;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    insertDocuments(db, function() {
      db.close();
    });
  });

});
app.get('/truckNames', function(req, res) {
  res.json(truckNames);
});

app.get('/', function(req, res) {
  res.end("Home");
});

app.get('/user', function(req, res) {

});

// app running at https://localhost:8080
app.listen(process.env.PORT || 8080);
