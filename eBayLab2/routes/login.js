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

var afterLogin = function(req, res) {
	var json_responses;
	var pass = req.param("password");
	var username = req.param("username");
	console.log(req.param("username"));
	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.findOne({
			username : username
		}, function(err, user) {
			if (user) {
				console.log(pass);

				console.log(user);
				console.log(":::" + user.password);

				// This way subsequent requests will know the user is logged in.
				if (bcrypt.compareSync(pass, user.password)) {

					logger.info(req.param("username") + ' logged in');

					req.session.username = user.username;
					req.session.lastlogin = String(user.lastlogin);
					console.log(req.session.username + " is the session");
					json_responses = {

						"lastlogin" : user.last_login
					};

					console.log("valid Login");
					res.send(json_responses);

				} else {
					json_responses = {
						'statusCode' : 401

					};
					logger.info(req.param("username")
							+ ' invalid log in attempt');

					console.log("invalid login");
					res.send(json_responses);
				}
			} else {
				console.log("returned false");

				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});

	});
};

exports.login = login;
exports.afterLogin = afterLogin;
