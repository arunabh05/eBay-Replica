var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";
var mq_client = require('../rpc/client');


exports.makeBid = function(req, res) {
try{
	console.log(pllp);
}catch(ex){
	console.error(ex);
}
	var item = req.param("item");
	var amount = req.param("amount");
	var selltime = new Date(item.selltime);
	var bidtime = new Date();
	logger.info(req.session.username + " placed a bid on item id: "+ item._id + " amount: " + req.param("amount"));
	console.log("placing your bid");
	var username = req.session.username;
	var msg_payload = { "refID":1,
		"username": username,
		"itemid" : item._id,
		"itemname" : item.itemname,
		"quantity" : item.itemquantity,
		"amount" : amount,
		"bidtime" : bidtime,
		"selltime" : selltime
		};
	mq_client.make_request('bid_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else {
		if(results.statusCode === 200){
			console.log("all OK");
			res.send({"statusCode":200});
		} else {
			res.send({"statusCode":401});
		}
	}});
};

exports.highestBidder = function(req, res) {
	console.log("redirecting to Bidding Table");
	logger.info(req.session.username + " requested /higgestBidder");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("highestBidders", {
		username : req.session.username,
	});
};

exports.updateBid = function(req, res) {
	console.log("updating bidding table");
	var msg_payload = { "refID":2};
	mq_client.make_request('bid_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else {
			if(results.statusCode === 200){
				console.log("all OK");
				var winList = results.winList;
				var bidList = results.bidList;
				res.send({"winList":winList,"bidList":bidList});
			} else {
				res.send({"statusCode":401});
			}
		}
	});
};