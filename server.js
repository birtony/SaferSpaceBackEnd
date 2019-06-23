// Setup
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const HTTP_PORT = process.env.PORT || 8080;

// Add Support for CORS
app.use(cors());

// Passport.js components
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

// JSON Web Token Setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// IMPORTANT - this secret should be a long, unguessable string 
// (ideally stored in a "protected storage" area on the 
// web server, a topic that is beyond the scope of this course)
// We suggest that you generate a random 64-character string
// using the following online tool:
// https://lastpass.com/generatepassword.php 
jwtOptions.secretOrKey = 'big-long-string-from-lastpass.com/generatepassword.php';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);

  if (jwt_payload) {
    // The following will ensure that all routes using 
    // passport.authenticate have a req.user._id value 
    // that matches the request payload's _id
    next(null, { _id: jwt_payload._id });
  } else {
    next(null, false);
  }
});
// Activate the security system
passport.use(strategy);
app.use(passport.initialize());

app.use((req,res,next) => {
    if (req.body) log.info(req.body);
    if (req.params) log.info(req.params);
    if(req.query) log.info(req.query);
    console.log.info(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
  next();
});


// Data Model
const manager = require("./manager.js");

// Persistent Store
// For MondoDB Atlas Database
const m = manager("mongodb+srv://SaferSpaceAdmin:zyhfov-jaWjiw-3vatju@saferspace-arant.azure.mongodb.net/SaferSpace?retryWrites=true&w=majority");

// Add Support for Incoming JSON Entities
app.use(bodyParser.json());


// App's Home Page for Browser Clients
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

// ***** User Methods *****

// Get All Users
app.get("/api/users", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the Manager Method
    m.userGetAll().then((data) => {
        res.json(data);
    }).catch(() => {
        res.status(404).json({ "message": "Resource not found" });
    });
});

// Get One User by Id
app.get("/api/users/:userId", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the Manager Method
    m.userGetById(req.params.userId).then((data) => {
        res.json(data);
    }).catch(() => {
        res.status(404).json({ "message": "Resource not found" });
    });
});

// Get One User by Username
app.get("/api/users/username/:username", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the Manager Method
    m.centerGetByUsername(req.params.username).then((data) => {
        res.json(data);
    }).catch(() => {
        res.status(404).json({ "message": "Resource not found" });
    });
});

// User Activate
app.post("/api/users/activate", (req, res) => {
    m.usersActivate(req.body)
      .then((data) => {
        res.json({ "message": data });
      }).catch((msg) => {
        res.status(400).json({ "message": msg });
      });
});
  
// User Create
app.post("/api/users/create", (req, res) => {
    m.usersRegister(req.body)
      .then((data) => {
        res.json({ "message": data });
      }).catch((msg) => {
        res.status(400).json({ "message": msg });
      });
});
  
// User Login
app.post("/api/users/login", (req, res) => {
    m.usersLogin(req.body)
      .then((data) => {
        // Configure the payload with data and claims
        var payload = {
          _id: data._id,
          username: data.username,
        };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        // Return the result
        res.json({ "message": "Login was successful", token: token });
      }).catch((msg) => {
        res.status(400).json({ "message": msg });
      });
});

// User Update
app.post("/api/users/:username/update", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the manager method
    console.log("hello epta")
    m.userUpdate(req.params.username, req.body)
      .then((data) => {
        res.json({ "message": "User updated" });
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
});


// ***** Center Methods *****

// Get All Centers
app.get("/api/centers", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the Manager Method
    m.centerGetAll().then((data) => {
        res.json(data);
    }).catch(() => {
        res.status(404).json({ "message": "Resource not found" });
    });
});

// Get One Center
app.get("/api/centers/:centerId", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the Manager Method
    m.centerGetById(req.params.courseId).then((data) => {
        res.json(data);
    }).catch(() => {
        res.status(404).json({ "message": "Resource not found" });
    });
});



// Attempt to Connect to the Database, Start Listening for Requests
m.connect().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Ready to handle requests on port " + HTTP_PORT);
    });
}).catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
});