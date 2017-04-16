var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var logger = require('./logger');

var registerUser = function(req, res) {
	var json_responses;
	var username = req.param("username");
	var pass = bcrypt.hashSync(req.param("password"));

	var insertUser = "insert into user_login values ('"
			+ req.param("username") + "','" + pass
			+ "','" + req.param("email") + "',now() ,'"
			+ req.param("firstname") + "','" + req.param("lastname")
			+ "'); ";

	mysql.insertData(function(err, results) {
		if (err) {
			throw err;
			json_responses = {
					'statusCode' : 401
				};
				res.send(json_responses);
		
		} else {
			if (results === 1) {
				json_responses = {
					"results" : results
				};
				logger.info(req.param("username")+" created new account");
				createProfile(username);
				res.send(json_responses);
			} else {
				json_responses = {
					'statusCode' : 401
				};
				logger.info(req.param("username")+" registration failed");
				res.send(json_responses);
			}
		}
	}, insertUser);
};

var createProfile = function(username){
	
	var json_responses;
	var createProfile = "insert into user_profile values ('"
			+username+"','','',''); ";

	mysql.insertData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results === 1) {
				console.log("profile created");
			} else {
				console.log("error creating profile");
			}
		}
	}, createProfile);
};

exports.registerUser = registerUser;