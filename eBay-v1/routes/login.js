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
			res.end('An error occured');
		}
	});
};

var afterLogin = function(req, res) {
	
	var json_responses;
	var pass = req.param("password");
	var getUser = "select * from user_login where username='"
			+ req.param("username") + "';";

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
					if (bcrypt.compareSync(pass, results[0].password)) {
						req.session.username = req.param("username");
						logger.info(req.param("username")+' logged in');
						json_responses = {
							"lastlogin" : results[0].last_login
						};
						req.session.lastlogin = String(results[0].last_login);
						res.send(json_responses);
					} else {
						json_responses = {
							'statusCode' : 401
						};
						logger.info(req.param("username")+' invalid log in attempt');
						res.send(json_responses);
					}
			}
		}
	}, getUser);
};

exports.login = login;
exports.afterLogin = afterLogin;