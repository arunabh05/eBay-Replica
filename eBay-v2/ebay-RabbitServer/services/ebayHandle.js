var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.ebayHandle = function(msg, callback){
	var res = {};
	mongo.getConnection(mongoURL, function(){
		var coll = mongo.collection('users');
		coll.findOne({username:msg.ebayHandle},function(err,user){
			if(user){
				  res.user = user;
				  res.statusCode = 200;
				  callback(null, res);
			} else {
				res.statusCode = 401;
				callback(null, res);
			}					
		});
	});
};