var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');

exports.makeBid = function(req, res) {
try{
	var item = req.param("item");
	var amount = req.param("amount");
	var selltime = new Date(item.selltime);
	var bidtime = new Date();
	logger.info(req.session.username + " placed a bid on item id: "+ item._id + " amount: " + req.param("amount"));
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
		console.error(ex);
	}
};

exports.highestBidder = function(req, res) {
	try{	
		logger.info(req.session.username + " requested /higgestBidder");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("highestBidders", {
			username : req.session.username,
		});
	}catch(ex){
	console.log(ex);
	}
};

exports.updateBid = function(req, res) {
	try{
		var msg_payload = { "refID":2};
		mq_client.make_request('bid_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else {
			if(results.statusCode === 200){
				var winList = results.winList;
				var bidList = results.bidList;
				res.send({"winList":winList,"bidList":bidList});
			} else {
				res.send({"statusCode":401});
			}
		}
	});
	}catch(ex){
		console.log(ex);
	}
};