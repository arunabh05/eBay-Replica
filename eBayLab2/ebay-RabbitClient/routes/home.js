var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');

exports.redirectToHomepage = function(req, res) {
		logger.info(req.session.username+" redirected to Homepage");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("Home", {
			username : req.session.username,
			lastlogin : req.session.lastlogin
		});
	};


exports.redirectToUserprofile = function(req, res) {
	console.log("redirecting to userprofile");
	logger.info(req.session.username+" redirected to User Profile");
	var username = req.session.username;
	var msg_payload = { "refID":1,"username": username};
	mq_client.make_request('Home_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else {
			if(results.statusCode === 200){
				console.log("all OK");
				var data = results.data;
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("userProfile", {
					username : req.session.username,
					data : data 
					});
				}
			else {    
				res.redirect('/');
			}
		}  
	});
};
		
		
exports.redirectToSell = function(req, res) {
	logger.info(req.session.username+" redirected to Sell Item");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("Sell", {
		username : req.session.username
	});
};


exports.getProducts = function(req, res) {
		console.log("Getting products list");
		var productList;
		var username = req.session.username;
		var msg_payload = { "refID":2,"username": username};
		mq_client.make_request('Home_queue',msg_payload, function(err,results){
			console.log(results.statusCode);
			if(err){
				throw err;
			}
			else 
			{
				if(results.statusCode === 200){
					console.log("all OK");
					productList = results.productList;
					res.send({"productList":productList});
				} else {
					res.send({"statusCode":401});
				}
			}  
		});
};
// Logout the user - invalidate the session
exports.logout = function(req, res) {
		logger.info(req.session.username+" logged out");
		var username = req.session.username;
		var msg_payload = { "refID":3,"username": username};
		mq_client.make_request('Home_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
	});
	req.session.destroy();
	res.redirect('/login');
};

exports.addToCart = function(req,res){
		console.log("In add to cart");
		var item = req.param("item");
		var quantity = req.param("quantity");
		var cost = Number(req.param("price")) * Number(req.param("quantity"));
		console.log(cost);
		var username = req.session.username;
		var msg_payload = { "refID":4,"username": username, "item": item, "cost":cost, "quantity":quantity};
		mq_client.make_request('Home_queue',msg_payload, function(err,results){
			console.log(results.statusCode);
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				logger.info(req.session.username+" clicked on: Add to Cart added itemID: " +item._id);
				res.send({"statusCode":200});
			} else {
				res.send({"statusCode":401});
			}
		}  
	});
};