var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.redirectToHomepage = function(req, res) {
	console.log(req.session.username+" redirecting to homepage");
	// Checks before redirecting whether the session is valid
	if (req.session.username) {
		logger.info(req.session.username+" redirected to Homepage");

		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
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
	// Checks before redirecting whether the session is valid
	if (req.session.username) {
		logger.info(req.session.username+" redirected to User Profile");
		console.log("session available");
		var data1;
		var data2;
		
		var getLoginProfile = "select * from user_login where username='"+ req.session.username + "';";
		console.log("Query is:" + getLoginProfile);
		mysql.fetchData(function(err, results) {
			console.log(results);
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					console.log("results fetched");
					data1 = results[0];
				} else {
					res.redirect('/');
				}
			}
		}, getLoginProfile);
		
		var getProfile = "select * from user_profile where username='"+ req.session.username + "';";
		console.log("Query is:" + getProfile);
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					console.log("results fetched");
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
	console.log("redirecting to Sell");
	// Checks before redirecting whether the session is valid
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
		var loginProfile;
		var userProfile;
		var getProducts = "select * from sell_product where NOT username='"+req.session.username+"';";
		console.log("Query is:" + getProducts);
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {

				var json_responses;
				if (results.length > 0) {

					productList = JSON.stringify(results);
					var productList1 = JSON.parse(productList);
					console.log(productList);
					
					res.send({"productList":productList});
				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}
			}
		}, getProducts);
	}
};
// Logout the user - invalidate the session
exports.logout = function(req, res) {
	if(req.session.username){
		logger.info(req.session.username+" logged out");
		var updateLastLogin = "update user_login SET last_login=now() where username='"
			+ req.session.username + "';";
	console.log("Query is:" + updateLastLogin);
	mysql.insertData(function(err, result) {
		if (err) {
			throw err;
		} else {
			if (result === 1) {
				console.log(result);
				console.log("Update Success");
			} else {
				console.log(result);
				console.log("Update error");
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
		console.log("In add to cart");
		
		console.log(req.param("price"));
		console.log(req.param("quantity"));
		
		var cost = Number(req.param("price")) * Number(req.param("quantity"));
		console.log(cost);
		
		var addToCart = "insert into shopping_cart (itemid,itemname,username,itemprice,itemquantity,itemimg,itemcost,product_status) values " +
				"('"+req.param("itemid")+"',(select itemname from sell_product where itemid='"+req.param("itemid")+"')," +
				"'"+req.session.username+"','"+req.param("price")+"','" +""+req.param("quantity")+"',(select itemimg from sell_product" +
				" where itemid='"+req.param("itemid")+"'),"+cost+",'no');";

		console.log("Query is:" + addToCart);
		mysql.insertData(function(err, results) {
			var cartList;
			var json_responses;
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					console.log(results);
					console.log("Add to cart Success");
					logger.info(req.session.username+" clicked on: Add to Cart added itemID: " +req.param("itemid"));
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
		}, addToCart);
	}
};