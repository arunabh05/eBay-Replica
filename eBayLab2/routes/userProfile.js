var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var updateProfile = function(req, res) {
	var json_responses;
	// check user already exists
	if (req.session.username) {
		console.log("In update profile");
		logger.info(req.session.username+" clicked on: Update Profile");
		
		var bday = req.param("bday");
		var phone = req.param("phone");
		var address = req.param("address");
		
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
				coll.update({username:req.session.username},{$set:{bday:bday,phone:phone,address:address}},function(err, user){
				if(user){
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
			});
		});
	}
};

exports.updateProfile = updateProfile;