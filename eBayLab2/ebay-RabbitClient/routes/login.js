var ejs = require("ejs");
var bcrypt = require("bcrypt-nodejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');


var login = function(req, res) {
try{
	logger.info('Login page requested');
	ejs.renderFile('./views/login.ejs', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			console.log(err);
			res.end('An error occured');
		}
	});
}catch(ex){
	console.log(ex);
}
};

var userList = function(req, res) {
try{
var msg_payload = { "refID":2};
mq_client.make_request('login_queue',msg_payload, function(err,results){
	console.log(results.statusCode);
	if(err){
		throw err;
	}
	else {
		if(results.statusCode === 200){
			console.log("all OK");
			var data = results.username;
			res.send({"username":data});
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

exports.login = login;
exports.userList = userList;