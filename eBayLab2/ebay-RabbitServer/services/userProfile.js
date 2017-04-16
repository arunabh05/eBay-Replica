var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var updateProfile = function(msg, callback) {
	var res = {};
	mongo.getConnection(mongoURL, function(){
		var coll = mongo.collection('users');
		coll.update({username:msg.username},{$set:{bday:msg.bday,phone:msg.phone,address:msg.address}},function(err, user){
			if(user){
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