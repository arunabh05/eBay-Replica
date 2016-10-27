var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.redirectToHomepage = function(req, res) {
	console.log(req.session.username+" redirecting to homepage");
	if (req.session.username) {
		logger.info(req.session.username+" redirected to Homepage");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("Home", {
			username : req.session.username,
			lastlogin : req.session.lastlogin
		});
	} else {
		res.redirect('/');
	}
};

exports.redirectToUserprofile = function(req, res) {
	console.log("redirecting to userprofile");
	if (req.session.username) {
		logger.info(req.session.username+" redirected to User Profile");
		console.log("session available");
		mongo.connect(mongoURL , function(){
			var coll = mongo.collection('users');
			coll.findOne({username:req.session.username},function(err, user){
				if(user){
					var data = user;
					console.log(user);
					console.log(data);
					res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render("userProfile", {
							username : req.session.username,
							data : data 
							});
				}else{
				res.redirect('/');	
				}
			});
		});
	}else{
		res.redirect('/');
	}
};
		
		
exports.redirectToSell = function(req, res) {
	console.log("redirecting to Sell");
	if (req.session.username) {
		logger.info(req.session.username+" redirected to Sell Item");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("Sell", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};


exports.getProducts = function(req, res) {
	if (req.session.username) {
		console.log("session available. Getting products list");
		var productList;

		mongo.connect(mongoURL,function(){
			var products = mongo.collection('Products');
			products.find({sellerID:{$ne: req.session.username}}).toArray(function(err, products){
				if (products) {
					var json_responses;
						productList = products;
						console.log(productList);
						res.send({"productList":productList});
				} else {
					res.send({"statusCode":401});
				}
			});	
		});
	}
};
// Logout the user - invalidate the session
exports.logout = function(req, res) {
	if(req.session.username){
		logger.info(req.session.username+" logged out");
		mongo.connect(mongoURL,function(){
			var coll = mongo.collection('users');
			coll.update(
					{username:req.session.username},
					{$set :{lastlogin: new Date()}},function(err,user){
				if(!err){
					console.log("Update Success");
					req.session.destroy();
					res.redirect('/login');

				} else {
					console.log("Update error");
					var json_responses = {
						"statusCode" : 401
					};
				}});
		});
	}else{
		res.redirect('/');
	}
};



exports.addToCart = function(req,res){
	if (req.session.username) {
		console.log("In add to cart");
		
		console.log(req.param("price"));
		console.log(req.param("quantity"));
		var item = req.param("item");
		var cost = Number(req.param("price")) * Number(req.param("quantity"));
		console.log(cost);
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
			coll.update({username: req.session.username},
					{$addToSet:{cartItems:{itemid:item._id,
						itemname:item.itemname,
						itemimg: item.itemimg,
						itemdesc : item.itemdesc,
						itemprice : item.itemprice,
						quantity : req.param("quantity"),
						cost : cost,
						}
					}
			},function(err, user){
				var json_responses;
				if(user){
					console.log("Add to cart Success");
					logger.info(req.session.username+" clicked on: Add to Cart added itemID: " +item._id);
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
	}
};