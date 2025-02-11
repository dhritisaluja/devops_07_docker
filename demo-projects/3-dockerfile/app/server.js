// Loading the tools (Libraries/Modules)

let express = require('express'); // loads a tool called Express that help us in building server easily.
let path = require('path'); // path helps the program to find files like where “index.html” file is located.
let fs = require('fs'); // file system tool allows the program to read and write files on your computer.
let MongoClient = require('mongodb').MongoClient; // MongoClient helps your app connect to a MongoDB db.
let bodyParser = require('body-parser'); // body-parser tool makes it easy to understand data sent by users.
let app = express(); //  creates our web server by starting an Express application. Storing it in a "app" variable.

// teaching our server to read the incoming messages correctly in both format: URL-encoded and JSON
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// When someone visits the main page of our website,Send back the file "index.html" page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

// If you visit the URL ending with /profile-picture, the server sends you a picture.
app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Database Connection depending on where your node js app is running, it chooses different MongoDB addresses.
// use this MongoDB address when starting your application locally with node command
let mongoUrlLocal = "mongodb://admin:pass@localhost:27017";

// use when starting your application as a separate docker container
let mongoUrlDocker = "mongodb://admin:pass@host.docker.internal:27017";

// use when starting your application as docker container, part of docker-compose
let mongoUrlDockerCompose = "mongodb://admin:pass@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "my-db" as db name in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

//When a user submits updated profile information, the server saves it into the database
// and then sends that same information back as a confirmation.
app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});


// When you visit /get-profile, the server looks up the user with userid 1
// in the database and sends you the stored profile information.
app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});

// tells the server to listen for any incoming requests on port 3000
app.listen(3000, function () {
  console.log("app listening on port 3000!");
});

