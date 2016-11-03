var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

var sellProduct = function(msg, callback) {
	var res = {};
	mongo.connect(mongoURL, function() {
		var products = mongo.collection('Products');
		products.insert({
			_id : Math.random(),
			sellerID : msg.username,
			itemname : msg.itemname,
			itemdesc : msg.itemdesc,
			itemprice : msg.itemprice,
			itemquantity : msg.itemquantity,
			selltime : msg.selltime,
			itemimg : msg.itemimg,
			bidding : msg.bid
		}, function(err, products) {
			if (products) {
				res.statusCode = 200;
				callback(null, res);
				} 
			else {
				res.statusCode = 401;
				callback(null, res);
			}
		});
	});
};

exports.getSoldProducts = function(msg , callback) {
	console.log("session available. Getting sold list");
	var res = {};
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('Products');
		coll.find({
			sellerID : msg.username
		}).toArray(function(err, products) {
			var json_responses;
			if (products) {
				res.productList = products;
				res.statusCode = 200;
				callback(null,res);
			} else {
				res.statusCode = 401;
				callback(null ,res);
			}
		});
	});
};

exports.getPurchasedProducts = function(msg, callback) {
	var res = {};
	mongo.connect(mongoURL, function() {
	var coll = mongo.collection('users');
		coll.findOne({
			username : msg.username
		},function(err, user) {
			var json_responses;
			if (user) {
				res.productList = user.productsPurchased;
				res.statusCode = 200;
				callback(null,res);
			} else {
				res.statusCode = 401;
				callback(null,res);
			}
		});
	});
};

exports.sellProduct = sellProduct;