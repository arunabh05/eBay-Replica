var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.redirectToUserprofile = function(msg, callback) {
	var res = {};
	mongo.getConnection(mongoURL , function(){
		var coll = mongo.collection('users');
		coll.findOne({username:msg.username},function(err, user){
			if(user){
				var data = user;
				res.data = data;
				res.statusCode = 200;
				callback(null, res);
			}else{
			res.statusCode = 401;
			callback(null, res);
			}
		});
	});
};
		
exports.getProducts = function(msg, callback) {
	var res = {};
	var productList;
	mongo.getConnection(mongoURL,function(){
		var products = mongo.collection('Products');
		products.find({sellerID:{$ne: msg.username}}).toArray(function(err, products){
			if (products) {
				var json_responses;
				res.productList = products;
				res.statusCode = 200;
				callback(null,res);
			} else {
				res.statusCode = 401;
				callback(null,res);
			}
		});	
	});
};

exports.logout = function(msg, callback) {
	var res = {};
	mongo.getConnection(mongoURL,function(){
	var coll = mongo.collection('users');
	coll.update(
		{username:msg.username},
		{$set :{lastlogin: new Date()}},function(err,user){
		if(!err){
			res.statusCode = 200;
			callback(null,res);
		} else {
			res.statusCode = 401;
			callback(null, res);
		}});
	});
};

exports.addToCart = function(msg, callback){
	var res = {};
	mongo.getConnection(mongoURL, function(){
		var coll = mongo.collection('users');
		coll.update({username: msg.username},
			{$addToSet:{cartItems:{itemid:msg.item._id,
			itemname:msg.item.itemname,
			itemimg: msg.item.itemimg,
			itemdesc : msg.item.itemdesc,
			itemprice : msg.item.itemprice,
			quantity : msg.quantity,
			cost : msg.cost,
			}}},function(err, user){
			var json_responses;
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