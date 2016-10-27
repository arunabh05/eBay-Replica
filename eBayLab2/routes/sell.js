var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var sellProduct = function(req, res) {
	var json_responses;
	if (req.session.username) {
		console.log("Store Item Details");
		var username = req.session.username;
		var itemname = req.param("itemname");
		var itemdesc = req.param("itemdesc");
		var itemprice = req.param("itemprice");
		var itemquantity = req.param("itemquantity");
		var selltime = new Date();
		var itemimg = req.param("itemimg");
		var bid = req.param("bid");
		mongo.connect(mongoURL, function() {
			var products = mongo.collection('Products');
			products.insert({
				_id : Math.random(),
				sellerID : username,
				itemname : itemname,
				itemdesc : itemdesc,
				itemprice : itemprice,
				itemquantity : itemquantity,
				selltime : selltime,
				itemimg : itemimg,
				bidding : bid
			}, function(err, products) {
				var json_responses;
				if (products) {
					logger.info(req.session.username
							+ " clicked on: Sell. Product Name:" + itemname);
					json_responses = {
						"statusCode" : 200
					};
					console.log("Heeeeeerreeee");
					res.send(json_responses);

				} else {
					json_responses = {
						'statusCode' : 401
					};
					console.log("item details fail");
					res.send(json_responses);
				}
			});
		});
	} else {
		res.redirect('/');
	}
};

exports.sellingHistory = function(req, res) {
	console.log("redirecting to selling History");
	if (req.session.username) {
		logger.info(req.session.username + " redirected to selling history");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("sellingHistory", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};

exports.purchaseHistory = function(req, res) {
	console.log("redirecting to purchase History");
	if (req.session.username) {
		logger.info(req.session.username + " redirected to purchase history");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("purchaseHistory", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};

exports.getSoldProducts = function(req, res) {
	if (req.session.username) {
		console.log("session available. Getting sold list");
		var productList;

		mongo.connect(mongoURL, function() {
			var coll = mongo.collection('Products');
			coll.find({
				sellerID : req.session.username
			}).toArray(function(err, products) {
				var json_responses;
				if (products) {
					productList = products;
					console.log(productList);
					res.send({
						"productList" : productList
					});
				} else {
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);
				}
			});
		});
	}
};

exports.getPurchasedProducts = function(req, res) {
	if (req.session.username) {
		console.log("session available. Getting purchased list");

		mongo.connect(mongoURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({
				username : req.session.username
			},function(err, products) {
				var json_responses;
				if (products) {
					var productList = products.productsPurchased;
					console.log(productList);
					res.send({
						"productList" : productList
					});
				} else {
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);
				}
			});
		});
	}
};

exports.sellProduct = sellProduct;