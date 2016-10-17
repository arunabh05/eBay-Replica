var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var updateProfile = function(req, res) {
	var json_responses;
	// check user already exists
	if (req.session.username) {
		console.log("In update profile");
		logger.info(req.session.username+" clicked on: Update Profile");
		var updateProfile = "update user_profile SET bday='"+req.param("bday")+"', phone ='"
				+ req.param("phone") + "', address='" + req.param("address")
				+ "' where username='" + req.session.username + "';";

		console.log("Query is:" + updateProfile);
		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					console.log(results);
					console.log("Profile update Success");
					json_responses = {
							"statusCode" : 200
					}
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					console.log("Profile update error");
					res.send(json_responses);
				}
			}
		}, updateProfile);
	}
};

exports.updateProfile = updateProfile;
