var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";
var bcrypt = require("bcrypt-nodejs");
var logger = require('./logger');

var userList = function(msg, callback) {
	var res = {};
try{
	mongo.getConnection(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.find({},{_id:0,username:1}).toArray(function(err, user) {
			if (user) {
				console.log(user);
				res.username=user;
				res.statusCode = 200;
				callback(null, res);
			}else{
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
}catch(ex){
	console.log(ex);
}

};

exports.userList = userList;