var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebayappdemo";

exports.ebayHandle = function(req,res){
	logger.info(req.session.username+" requested ebayHandle: "+req.param("id"));
	var ebayHandle = req.param("id");
		console.log("Ebay handle request");
		var json_responses;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
			coll.findOne({username:ebayHandle},function(err,user){
				if(user){
					  res.render('ebayHandle', {"ebayHandle":ebayHandle,"userProfile":user,"username":req.session.username});

				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}					
				});
		});
};