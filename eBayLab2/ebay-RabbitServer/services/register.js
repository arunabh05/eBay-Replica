var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var registerUser = function(msg, callback) {
	var res = {};
	// check user already exists
	mongo.getConnection(mongoURL, function() {
		console.log(msg.password);
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.insert({
			username : msg.username,
			password : msg.password,
			email : msg.email,
			firstname : msg.firstname,
			lastname : msg.lastname,
			lastlogin : new Date(),
			bday : "",
			phone : 1800123123,
			address : ""
		}, function(err, user) {
			var json_responses;
			if (user) {
				// This way subsequent requests will know the user is logged in.
				console.log("registered");
				res.statusCode = 200;
				callback(null, res);
				
			} else {
				console.log("Invalid Register");
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
};

exports.registerUser = registerUser;