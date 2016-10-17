var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.makeBid = function(req,res){
	
	if(req.session.username){
			logger.info(req.session.username+" placed a bid on item id: "+req.param("itemid")+" amount: "+req.param("amount"));
			console.log("placing your bid");
			var makeBid = "insert into bidding_placed (itemid,itemname,username,itemquantity,amount,selltime ,biddingtime) values " +
					"('"+req.param("itemid")+"',(select itemname from sell_product where itemid='"+req.param("itemid")+"')," +
					"'"+req.session.username+"',1,'"+req.param("amount")+"',(select selltime from sell_product where itemid = "
					+req.param("itemid")+"),now());";
			console.log("Query is:" + makeBid);
			mysql.insertData(function(err, results) {
				var json_responses;
				if (err) {
					throw err;
				} else {
					if (results === 1) {
						console.log(results);
						console.log("BidPlaced");
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
				}
			}, makeBid);
		}
	else{
		res.redirect('/');
	}
};

exports.highestBidder = function(req,res){
	console.log("redirecting to Bidding Table");
	if (req.session.username) {
		logger.info(req.session.username+" requested /higgestBidder");

		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("highestBidders", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};

exports.updateBid = function(req,res){
	console.log("updating bidding table");
		var getMaxBid = "SELECT t.itemid, t.itemname, t.username, t.amount as bid FROM ( SELECT itemid , MAX(amount) AS bid1 FROM bidding_placed where biddingtime <= selltime + interval 4 day and now() <= selltime + interval 4 day GROUP BY itemid ) AS m INNER JOIN bidding_placed AS t ON t.itemid = m.itemid AND t.amount = m.bid1;";
		console.log("Query is:" + getMaxBid);
		mysql.fetchData(function(err, results) {
			var json_responses;
			if (err) {
				throw err;
			} else {
				if (results.length > 0) {
					console.log(results);
					console.log("Bid");
					json_responses = {
							"bidList" : results
					};
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					console.log("Bidding Error");
				}
			}
		}, getMaxBid);
};

exports.bidWinners = function(req,res){
	console.log("winner bidding table");
		var getBidWinners = "SELECT t.itemid, t.itemname, t.username, t.amount as bid FROM ( SELECT itemid , MAX(amount) AS bid1 FROM bidding_placed where now() >= selltime + interval 4 day GROUP BY itemid ) AS m INNER JOIN bidding_placed AS t ON t.itemid = m.itemid AND t.amount = m.bid1;";
		console.log("Query is:" + getBidWinners);
		mysql.fetchData(function(err, results) {
			var json_responses;
			if (err) {
				throw err;
			} else {
				if (results.length > 0) {
					console.log(results);
					console.log("WinnerList");
					json_responses = {
							"winnerList" : results
					};
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					console.log("Bidding Error");
				}
			}
		}, getBidWinners);
};