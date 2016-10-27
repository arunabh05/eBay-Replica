var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var registerUser = function(req, res) {
	var json_responses;
	// check user already exists
	console.log(req.param("password"));
	var username = req.param("username");
	var email = req.param("username");
	var firstname = req.param("username");
	var lastname = req.param("username");

	var pass = bcrypt.hashSync(req.param("password"));
	console.log("pass:::" + pass);

	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.insert({
			username : username,
			password : pass,
			email : email,
			firstname : firstname,
			lastname : lastname,
			lastlogin : new Date(),
			bday : "",
			phone : 1800123123,
			address : ""
		}, function(err, user) {
			var json_responses;
			if (user) {
				console.log(pass);
				console.log(user);
				console.log(":::" + user.password);
				// This way subsequent requests will know the user is logged in.
				json_responses = {
					"results" : user
				};
				logger.info(req.param("username") + " created new account");
				console.log("valid Login");
				res.send(json_responses);
			} else {
				json_responses = {
					'statusCode' : 401
				};
				console.log("Invalid Register");
				logger.info(req.param("username") + " registration failed");
				res.send(json_responses);
			}
		});
	});
};

exports.registerUser = registerUser;