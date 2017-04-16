var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.redirectToHomepage = function(req, res) {
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
	if (req.session.username) {
		logger.info(req.session.username+" redirected to User Profile");
		var data1;
		var data2;
		
		var getLoginProfile = "select * from user_login where username='"+ req.session.username + "';";
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					data1 = results[0];
				} else {
					res.redirect('/');
				}
			}
		}, getLoginProfile);
		
		var getProfile = "select * from user_profile where username='"+ req.session.username + "';";
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					data2 = results[0];
					res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render("userProfile", {
							username : req.session.username,
							data : data1,
							data2 : data2
						});
				} else {
					data2 = {
							username : "-",
							bday : "-",
							phone : "-",
							address : "-"
						};
					res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render("userProfile", {
								username : req.session.username,
								data : data1,
								data2 : data2
								});
					}
				}
			}, getProfile);
	} else {
		res.redirect('/');
	}
};

exports.redirectToSell = function(req, res) {
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
		var productList;
		var loginProfile;
		var userProfile;
		var getProducts = "select * from sell_product where NOT username='"+req.session.username+"';";
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					productList = JSON.stringify(results);
					var productList1 = JSON.parse(productList);
					res.send({"productList":productList});
				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}
			}
		}, getProducts);
	}
};

exports.logout = function(req, res) {
	if(req.session.username){
		logger.info(req.session.username+" logged out");
		var updateLastLogin = "update user_login SET last_login=now() where username='"
			+ req.session.username + "';";
	mysql.insertData(function(err, result) {
		if (err) {
			throw err;
		} else {
			if (result === 1) {
				console.log("Update Success");
			} else {
				var json_responses = {
					"statusCode" : 401
				};
			}
		}
	}, updateLastLogin);
	req.session.destroy();
	res.redirect('/login');

	}else{
		res.redirect('/');
	}

};

exports.addToCart = function(req,res){
	if (req.session.username) {
		var cost = Number(req.param("price")) * Number(req.param("quantity"));
		
		var addToCart = "insert into shopping_cart (itemid,itemname,username,itemprice,itemquantity,itemimg,itemcost,product_status) values " +
				"('"+req.param("itemid")+"',(select itemname from sell_product where itemid='"+req.param("itemid")+"')," +
				"'"+req.session.username+"','"+req.param("price")+"','" +""+req.param("quantity")+"',(select itemimg from sell_product" +
				" where itemid='"+req.param("itemid")+"'),"+cost+",'no');";

		mysql.insertData(function(err, results) {
			var cartList;
			var json_responses;
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					logger.info(req.session.username+" clicked on: Add to Cart added itemID: " +req.param("itemid"));
					json_responses = {
							"statusCode" : 200
					};
					res.send(json_responses);
				} else {
					json_responses = {
						'statusCode' : 401
					};
					res.send(json_responses);
				}
			}
		}, addToCart);
	}
};