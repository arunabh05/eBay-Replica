var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');


var sellProduct = function(req, res) {
try{
	console.log("Store Item Details");
	var username = req.session.username;
	var itemname = req.param("itemname");
	var itemdesc = req.param("itemdesc");
	var itemprice = req.param("itemprice");
	var itemquantity = req.param("itemquantity");
	var selltime = new Date();
	var itemimg = req.param("itemimg");
	var bid = req.param("bid");
	var productList;	
	var msg_payload = { 
			"refID":1,"username": username,
			"itemname":itemname,
			"itemdesc":itemdesc,
			"itemprice":itemprice,
			"itemquantity":itemquantity,
			"selltime":selltime,
			"itemimg":itemimg,
			"bid":bid
			};
	mq_client.make_request('Sell_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode === 200){
				logger.info(username+ " clicked on: Sell. Product Name:" + itemname);
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

exports.sellingHistory = function(req, res) {
try{
	logger.info(req.session.username + " redirected to selling history");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("sellingHistory", {
		username : req.session.username,
	});
}catch(ex){
	console.log(ex);
}
};

exports.purchaseHistory = function(req, res) {
try{
	logger.info(req.session.username + " redirected to purchase history");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("purchaseHistory", {
		username : req.session.username,
	});
}catch(ex){
	console.log(ex);
}
};

exports.getSoldProducts = function(req, res) {
try{
	var username = req.session.username;
	var msg_payload = { "refID":2,"username": username};
	var productList;
	mq_client.make_request('Sell_queue',msg_payload, function(err,results){
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

exports.getPurchasedProducts = function(req, res) {
try{
	var username = req.session.username;
	var msg_payload = { "refID":3,"username": username};
	var productList;
	mq_client.make_request('Sell_queue',msg_payload, function(err,results){
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

exports.sellProduct = sellProduct;