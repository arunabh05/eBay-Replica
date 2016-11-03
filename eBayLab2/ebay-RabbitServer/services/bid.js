var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.makeBid = function(msg ,callback) {
	var res = {};
	console.log("placing your bid");
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('bidsMade');
		coll.insert({
			username : msg.username,
			itemid : msg.itemid,
			itemname : msg.itemname,
			quantity : msg.quantity,
			amount : msg.amount,
			bidtime : msg.bidtime,
			selltime : msg.selltime
		}, function(err, user) {
			if (user) {
				console.log("BidPlaced");
				res.statusCode = 200;
				callback(null ,res);
			} else {
				res.statusCode = 401;
				callback(null ,res);
			}
		});
	});
};

exports.updateBid = function(msg, callback) {
	var res = {};
	console.log("updating bidding table");
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('bidsMade');
		coll.aggregate([ {
			"$sort" : {
				"_id" : -1,
				"amount" : 1,
				"itemname" : -1,
				"username" : -1
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
		} ]).toArray(function(err, user) {
			if (user) {
				var now = new Date();
				var bidList = [];
				var winnerList = [];
				for (var i = 0; i < user.length; i++) {
					var selltime = new Date(user[i].selltime);
					var diffDays = Math.abs((now.getTime() - selltime.getTime())/ (1000 * 3600 * 24));
					if (diffDays < 4) {
						bidList.push(user[i]);
					} else {
						winnerList.push(user[i]);
					}
				}
				console.log("Bid");
				res.bidList = bidList;
				res.winList	= winnerList;
				res.statusCode = 200;
				callback(null, res);
			} else {
				res.statusCode = 401;
				console.log("Bidding Error");
				callback(null, res);
			}
		});
	});
};