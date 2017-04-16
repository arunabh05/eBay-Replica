var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');

exports.redirectToCart = function(req, res) {
	try{
		logger.info(req.session.username + " redirected to Cart");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("cart", {
			username : req.session.username
		});
	}catch(ex){
		console.log(ex);
	}
};

exports.getCartItems = function(req, res) {
	try{
		var username = req.session.username;
		var msg_payload = { "refID":1,"username": username};
		var productList;
		mq_client.make_request('cart_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				productList = results.productList;
				res.send({"productList":productList});
			} else {
				res.send({"statusCode":401});
			}
		}  
	});
	}catch(ex){
		console.log(ex);
	}
};

exports.removeItemFromCart = function(req, res) {
	try{
		var itemid = req.param("itemid");
		var username = req.session.username;
		logger.info(username + " removed CartId:"+ itemid + " from cart");
		var msg_payload = { "refID":2,"username": username, "itemid":itemid};
		mq_client.make_request('cart_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}
			else {
			if(results.statusCode === 200){
				res.send({"statusCode":200});
			} else {
				res.send({"statusCode":401});
			}
		}  
	});
	}catch(ex){
		console.log(ex);
	}
};

exports.checkoutItemsFromCart = function(req, res) {
	try{
		logger.info(req.session.username + " checked out items from cart");
		var username = req.session.username;
		var items = req.param("items");
		var totalCost = 0;
		for (var i = 0; i < items.length; i++) {
			totalCost = totalCost + items[i].cost;
		}
		var msg_payload = { "refID":3,"username": username, "items":items};
		mq_client.make_request('cart_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.statusCode === 200){
					req.session.checkoutCost = totalCost;
					res.send({"statusCode":200});
				} else {
					res.send({"statusCode":401});
				}
			}  
		});
	}catch(ex){
		console.log(ex);
	}
};

exports.redirectToPayment = function(req, res) {
	try{
		logger.info(req.session.username + " redirected to Payment");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("payment", {
			username : req.session.username,
			checkoutCost : req.session.checkoutCost
		});
	}catch(ex){
	console.log(ex);
	}
};