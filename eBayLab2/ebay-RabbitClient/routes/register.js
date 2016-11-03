var ejs = require("ejs");
var bcrypt = require('bcrypt-nodejs');
var logger = require('./logger');
var mq_client = require('../rpc/client');

var registerUser = function(req, res) {
	var username = req.param("username");
	var email = req.param("email");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = bcrypt.hashSync(req.param("password"));
	var msg_payload = { "username": username, "password": password,"firstname": firstname,"lastname": lastname,"email":email };
	console.log("In POST Request = UserName:"+ username);
	mq_client.make_request('register_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				logger.info(req.param("username") + " created new account");
				console.log(":::::::::::"+results.statusCode);
				console.log("user registerd");
				res.send({"statusCode":200});
			}
			else {    
				logger.info(username + " registration failed");
				console.log("Invalid registeration");
				res.send({"statusCode" : 401});
			}
		}  
	});
};

exports.registerUser = registerUser;