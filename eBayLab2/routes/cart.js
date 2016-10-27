var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";
var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.redirectToCart = function(req, res) {
	console.log("redirecting to homepage");
	if (req.session.username) {
		logger.info(req.session.username + " redirected to Cart");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("cart", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.getCartItems = function(req, res) {
	if (req.session.username) {
		console.log("session available. Getting cart items list");
		var cartList;

		mongo.connect(mongoURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({
				username : req.session.username
			}, function(err, user) {
				if (user) {
					var productList;
					var json_responses;
					productList = user.cartItems;
					res.send({
						"productList" : productList
					});
				} else {
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);
				}
			})
		});

	} else {
		res.redirect('/');
	}
};

exports.removeItemFromCart = function(req, res) {
	if (req.session.username) {
		var itemid = req.param("itemid");
		logger.info(req.session.username + " removed CartId:"
				+ req.param("cartId") + " from cart");
		console.log("removing item from cart");

		mongo.connect(mongoURL, function() {
			var coll = mongo.collection('users');
			var json_responses;
			coll.update({
				username : req.session.username
			}, {
				$pull : {
					cartItems : {
						itemid : itemid
					}
				}
			}, function(err, user) {
				if (user) {
					console.log("Item removed from cart:::");
					json_responses = {
						"statusCode" : 200
					};
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					console.log("Cart error");
					res.send(json_responses);
				}
			});
		});
	} else {
		res.redirec('/');
	}
};

var updateCart = function(items, username) {
	console.log("updating Stock");
	// console.log("items::::::"+items);

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
	
	// for (var i = 0; i < items.length; i++) {
	// }
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
					}					}
				 else {
//					 console.log("::://////:::::::"+i+":::::::::");
				}
			});
		}
	});
};

exports.checkoutItemsFromCart = function(req, res) {
	console.log("updatingStock from cart");
	logger.info(req.session.username + " checked out items from cart");
	var username = req.session.username;
	var items = req.param("items");
	var totalCost = 0;
	for (var i = 0; i < items.length; i++) {
		totalCost = totalCost + items[i].cost;
		items[i].buytime = new Date();
	}
	updateStock(items, username);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');

		coll.update({
			username : req.session.username
		}, {
			$pushAll : {
				productsPurchased : items
			}
		}, function(err, user) {
			var json_responses;
			if (user) {
				console.log("totalCost::" + totalCost);
				req.session.checkoutCost = totalCost;

				console.log("checkout");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);
				console.log(":::" + req.session.checkoutCost);
			} else {
				json_responses = {
					'statusCode' : 401
				};
				console.log("Cart error");
				res.send(json_responses);
			}
		});
	});
};

exports.redirectToPayment = function(req, res) {
	console.log("checkoutCost::" + req.session.checkoutCost);
	if (req.session.username) {
		logger.info(req.session.username + " redirected to Payment");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("payment", {
			username : req.session.username,
			checkoutCost : req.session.checkoutCost
		});
	} else {
		res.redirect('/');
	}
};