var ejs = require("ejs");
var bcrypt = require('bcrypt-nodejs');
var logger = require('./logger');
var mq_client = require('../rpc/client');

var registerUser = function(req, res) {
try{
	var username = req.param("username");
	var email = req.param("email");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = bcrypt.hashSync(req.param("password"));
	var msg_payload = { "username": username, "password": password,"firstname": firstname,"lastname": lastname,"email":email };

	mq_client.make_request('register_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				logger.info(req.param("username") + " created new account");
				res.send({"statusCode":200});
			}
			else {    
				logger.info(username + " registration failed");
				res.send({"statusCode" : 401});
			}
		}  
	});
}catch(ex){
	console.log(ex);
}
};

exports.registerUser = registerUser;