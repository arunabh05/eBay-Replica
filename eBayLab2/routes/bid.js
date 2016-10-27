var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.makeBid = function(req, res) {

	if (req.session.username) {
		var item = req.param("item");
		var amount = req.param("amount");
		var selltime = new Date(item.selltime);
		var bidtime = new Date();

		logger.info(req.session.username + " placed a bid on item id: "
				+ req.param("itemid") + " amount: " + req.param("amount"));
		console.log("placing your bid");

		mongo.connect(mongoURL, function() {
			var coll = mongo.collection('bidsMade');
			coll.insert({
				username : req.session.username,
				itemid : item._id,
				itemname : item.itemname,
				quantity : item.itemquantity,
				amount : amount,
				bidtime : bidtime,
				selltime : selltime
			}, function(err, user) {
				var json_responses;
				if (user) {
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
			});
		});
	} else {
		res.redirect('/');
	}
};

exports.highestBidder = function(req, res) {
	console.log("redirecting to Bidding Table");
	if (req.session.username) {
		logger.info(req.session.username + " requested /higgestBidder");

		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("highestBidders", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};

exports.updateBid = function(req, res) {
	console.log("updating bidding table");
	var json_responses;
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('bidsMade');
		coll.aggregate([ {
			"$sort" : {
				"_id" : 1,
				"amount" : -1,
				"itemname" : 1,
				"username" : 1
			}
		}, {
			"$group" : {
				"_id" : "$itemid",
				"amount" : {
					"$first" : "$amount"
				},
				"itemname" : {
					"$first" : "$itemname"
				},
				"username" : {
					"$first" : "$username"
				},
				"selltime" : {
					"$first" : "$selltime"
				},
			}
		} ]).toArray(
				function(err, user) {
					if (user) {
						var now = new Date();
						var bidList = [];
						var winnerList = [];
						for (var i = 0; i < user.length; i++) {
							var selltime = new Date(user[i].selltime);
							var diffDays = Math.abs((now.getTime() - selltime
									.getTime())
									/ (1000 * 3600 * 24));

							if (diffDays < 4) {
								bidList.push(user[i]);
							} else {
								winnerList.push(user[i]);
							}
						}
						console.log("Bid");
						json_responses = {
							"bidList" : bidList,
							"winList" : winnerList
						};
						res.send(json_responses);
					} else {
						json_responses = {
							'statusCode' : 401
						};
						console.log("Bidding Error");
					}
				});
	});
};

/*exports.bidWinners = function(req, res) {
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
};*/