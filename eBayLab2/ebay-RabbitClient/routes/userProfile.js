var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');

var updateProfile = function(req, res) {
try{
	console.log("In update profile");
	var username = req.session.username;
	var bday = req.param("bday");
	var phone = req.param("phone");
	var address = req.param("address");
	logger.info(username+" clicked on: Update Profile");
	var msg_payload = { "refID":1,"username": username,"bday":bday,"phone":phone,"address":address};
	mq_client.make_request('UserProfile_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				res.send({"statusCode":200});
			}
			else {    
				res.send({"statusCode":401});
			}
		}  
	});
}catch(ex){
	console.log(ex);
}	
};

exports.updateProfile = updateProfile;