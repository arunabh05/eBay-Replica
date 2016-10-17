var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var logger = require('./logger');

var registerUser = function(req, res) {
	var json_responses;
	// check user already exists
	console.log(req.param("password"));
	var username = req.param("username");
	var pass = bcrypt.hashSync(req.param("password"));
	console.log("pass:::"+pass);
	var insertUser = "insert into user_login values ('"
			+ req.param("username") + "','" + pass
			+ "','" + req.param("email") + "',now() ,'"
			+ req.param("firstname") + "','" + req.param("lastname")
			+ "'); ";
	console.log("Query is:" + insertUser);
	mysql.insertData(function(err, results) {
		if (err) {
			throw err;
			json_responses = {
					'statusCode' : 401
				};
				console.log("Invalid Login");
				res.send(json_responses);
		
		} else {
			if (results === 1) {
				console.log(results);
				json_responses = {
					"results" : results
				};
				logger.info(req.param("username")+" created new account");
				console.log("valid Login");
				createProfile(username);
				res.send(json_responses);
			} else {
				json_responses = {
					'statusCode' : 401
				};
				console.log("Invalid Register");
				logger.info(req.param("username")+" registration failed");
				res.send(json_responses);
			}
		}
	}, insertUser);
};

var createProfile = function(username){
	
	var json_responses;
	// check user already exists
	var createProfile = "insert into user_profile values ('"
			+username+"','','',''); ";
	console.log("Query is:" + createProfile);
	mysql.insertData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results === 1) {
				console.log(results);
				console.log("profile created");
			} else {
				console.log("error creating profile");
			}
		}
	}, createProfile);
};

exports.registerUser = registerUser;