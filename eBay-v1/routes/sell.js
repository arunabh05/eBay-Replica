var ejs = require("ejs");
var mysql = require('./mysql');
var  logger = require('./logger');

var sellProduct = function(req, res) {
	var json_responses;
	if (req.session.username) {

		var username = req.session.username;
		if (req.param("bid") === true) {
			var sellProduct = "insert into sell_product(username, itemname,itemdesc,itemprice,itemquantity, selltime,itemimg " +
			",bid,sellername,sellerphone,selleraddress) values('"+username+"','"+req.param("itemName")+"'" +
			",'"+req.param("itemDesc")+"','"+Number(req.param("itemPrice"))+"','"+req.param("itemQuantity")+"'," +
			"now(),'"+req.param("itemImg")+"','yes',(select firstname from user_login where username='"+username+"')," +
			"(select phone from user_profile where username='"+username+"'),(select address from user_profile where " +
			"username='"+username+"'));";

		} else {
			var sellProduct = "insert into sell_product(username, itemname,itemdesc,itemprice,itemquantity, selltime,itemimg " +
					",bid,sellername,sellerphone,selleraddress) values('"+username+"','"+req.param("itemName")+"'" +
					",'"+req.param("itemDesc")+"','"+Number(req.param("itemPrice"))+"','"+req.param("itemQuantity")+"'," +
					"now(),'"+req.param("itemImg")+"','no',(select firstname from user_login where username='"+username+"')," +
					"(select phone from user_profile where username='"+username+"'),(select address from user_profile where " +
					"username='"+username+"'));";
		}

		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					logger.info(req.session.username+" clicked on: Sell. Product Name:"+req.param("itemName"));
					json_responses = {
						"statusCode" : 200
					}
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					res.send(json_responses);
				}
			}
		}, sellProduct);
	}
};

exports.sellingHistory = function(req,res){
	if (req.session.username) {
		logger.info(req.session.username+" redirected to selling history");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("sellingHistory", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};

exports.purchaseHistory = function(req,res){
	if (req.session.username) {
		logger.info(req.session.username+" redirected to purchase history");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("purchaseHistory", {
			username : req.session.username,
		});
	} else {
		res.redirect('/');
	}
};



exports.getSoldProducts = function(req,res){
	if (req.session.username) {
		var productList;
		var getSoldProducts = "select * from sell_product where username='"+req.session.username+"';";
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					productList = JSON.stringify(results);
					res.send({"productList":productList});
				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}
			}
		}, getSoldProducts);
	}
};


exports.getPurchasedProducts = function(req,res){
	if (req.session.username) {
		var productList;
		var getPurchasedProducts = "select * from shopping_cart where username='"+req.session.username+"' and product_status = 'yes';";
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					productList = JSON.stringify(results);
					res.send({"productList":productList});
				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}
			}
		}, getPurchasedProducts);
	}
};

exports.sellProduct = sellProduct;