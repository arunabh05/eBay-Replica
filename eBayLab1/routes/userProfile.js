var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var updateProfile = function(req, res) {
	var json_responses;
	if (req.session.username) {
		logger.info(req.session.username+" clicked on: Update Profile");
		var updateProfile = "update user_profile SET bday='"+req.param("bday")+"', phone ='"
				+ req.param("phone") + "', address='" + req.param("address")
				+ "' where username='" + req.session.username + "';";

		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					json_responses = {
							"statusCode" : 200
					}
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					res.send(json_responses);
				}
			}
		}, updateProfile);
	}
};

exports.updateProfile = updateProfile;