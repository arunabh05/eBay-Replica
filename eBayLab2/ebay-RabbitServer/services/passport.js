var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./db/mongo');
var loginDatabase = "mongodb://localhost:27017/login";
var bcrypt = require("bcrypt-nodejs");


var passport = function(passport) {
	passport.use('login', new LocalStrategy(function(username, password, done) {
		mongo.connect(loginDatabase, function(connection) {
			var loginCollection = mongo.collection('users');
			var whereParams = {
				username : username
			};
			process.nextTick(function() {
				loginCollection.findOne(whereParams, function(err, user) {
					if (err) {
						console.log("1");
						return done(err);
					}
					if (!user) {
						console.log("2");
						return done(null, false);
					}
					if (bcrypt.compareSync(password, user.password) === false) {
						console.log(user);
						console.log("3");
						done(null, false);
					}
					console.log(user);
					connection.close();
					console.log("4");
					console.log(user.username);
					done(null, user);
				});
			});
		});
	}));
};

exports.passport = passport;