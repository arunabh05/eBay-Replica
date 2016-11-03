var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.getCartItems = function(msg, callback) {
	console.log("session available. Getting cart items list");
	var res = {};
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		coll.findOne({
			username : msg.username
		}, function(err, user) {
			if (user) {
				var productList;
				var json_responses;
				productList = user.cartItems;
				res.productList = productList;
				res.statusCode = 200;
				callback(null, res);
			} else {
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
};

exports.removeItemFromCart = function(msg, callback) {
	var res = {};
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		coll.update({
			username : msg.username
			}, {
				$pull : {
				cartItems : {
				itemid : msg.itemid
				}
			}
		}, function(err, user) {
			if (user) {
				res.statusCode = 200;
				callback(null , res);
			} else {
				res.statusCode = 401;
				callback(null , res);
			}
		});
	});
};

var updateCart = function(items, username) {
	console.log("updating Stock");
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		for (var i = 0; i < items.length; i++) {
			coll.update({
				username : username
			}, {
				$pull : {
					cartItems : {
						itemid : items[i].itemid
					}
				}
		}, function(err, user) {
				if (user) {
					console.log("updating Cart Stocks now");
				} else {
					console.log("stock update error");
				}
			});
		}
	});
};

var updateStock = function(items, username) {
	console.log("updating Stock");
	updateCart(items, username);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('Products');
		for (var i = 0; i < items.length; i++) {
			console.log("::::::::::::"+i+"::::::::::::");
			coll.findOne({_id : items[i].itemid}, function(err, quant) {
				if (quant.itemquantity > 0) {
					for (var j = 0; j < items.length; j++) {
					console.log(":::::::"+j+":::::::"+quant._id);
						coll.update({
							_id : quant._id
						}, {
							$set : {
								itemquantity : quant.itemquantity - Number(items[j].quantity)
							}
						}, function(err, user) {
							if (user) {
								console.log("updating Cart Stocks now");
							} else {
								console.log("stock update error");
							}
						});
					}		
				}
			});
		}
	});
};

exports.checkoutItemsFromCart = function(msg, callback) {
	console.log("updatingStock from cart");
	var totalCost = 0;
	var res = {};
	for (var i = 0; i < msg.items.length; i++) {
		totalCost = totalCost + msg.items[i].cost;
		msg.items[i].buytime = new Date();
	}
	updateStock(msg.items, msg.username);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		coll.update({
			username : msg.username
		}, {
			$pushAll : {
				productsPurchased : msg.items
			}
		}, function(err, user) {
			if (user) {
				res.statusCode = 200;
				callback(null, res);
			} else {
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
};