var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var updateProfile = function(msg, callback) {
	var res = {};
	console.log("In update profile");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('users');
		console.log(msg);
		coll.update({username:msg.username},{$set:{bday:msg.bday,phone:msg.phone,address:msg.address}},function(err, user){
			if(user){
				console.log("Profile update Success");					
				res.statusCode = 200;
				callback(null, res);
			} else {
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
};

exports.updateProfile = updateProfile;