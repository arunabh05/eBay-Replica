var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require("bcrypt-nodejs");
var logger = require('./logger');

var login = function(req, res) {
	logger.info('Login page requested');
	ejs.renderFile('./views/login.ejs', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			console.log(err);
			res.end('An error occured');
		}
	});
};

var userList = function(req, res) {
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.find({},{_id:0,username:1}).toArray(function(err, user) {
			if (user) {
				console.log(user);
				res.send({"username":user});
			}else{
				res.send({"statusCode":401});
			}
		});
	});
};

exports.login = login;
exports.userList = userList;