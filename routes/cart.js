var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.redirectToCart = function(req, res) {
	console.log("redirecting to homepage");
	if (req.session.username) {
		logger.info(req.session.username+" redirected to Cart");
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("cart", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.getCartItems = function(req, res) {
	if (req.session.username) {
		console.log("session available. Getting cart items list");
		var cartList;
		var getCartItems = "select * from shopping_cart where username='"
				+ req.session.username + "' and product_status = 'no';";
		console.log("Query is:" + getCartItems);
		mysql.fetchData(function(err, results) {
			console.log(results);
			if (err) {
				throw err;
			} else {
				var productList;
				var json_responses;
				if (results.length > 0) {
					productList = JSON.stringify(results);
					res.send({
						"productList" : productList
					});
				} else {
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);
				}
			}
		}, getCartItems);
	}
};

exports.removeItemFromCart = function(req, res) {
	if (req.session.username) {
		logger.info(req.session.username+" removed CartId:"+req.param("cartId")+" from cart");

		console.log("removing item from cart");

		console.log(req.param("cartId"));

		var removeItem = "delete from shopping_cart where cartid = '"
				+ req.param("cartId") + "';";

		console.log("Query is:" + removeItem);
		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results === 1) {
					console.log(results);
					console.log("Item removed from cart:::");

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
		}, removeItem);
	} else {
		res.redirec('/');
	}
};

var updateCart = function(items) {
	console.log("updating Stock");
	//console.log("items::::::"+items);
	for (var i = 0; i < items.length; i++) {
		var updateCart = "UPDATE  shopping_cart SET product_status = 'yes';";
		console.log("Query is:" + updateCart);
		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					console.log(results);
					console.log("updating Cart Stocks now");
				} else {
					console.log("stock update error");
				}
			}
		}, updateCart);
	}
};



var updateStock = function(items) {
	console.log("updating Stock");
	//console.log("items::::::"+items);
	updateCart(items);
	for (var i = 0; i < items.length; i++) {
		var updateStock = "UPDATE  sell_product SET itemquantity = GREATEST(0, itemquantity - "+items[i].itemquantity+")" +
				"WHERE  itemid = " + items[i].itemid + ";";
		console.log("Query is:" + updateStock);
		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {
				if (results === 1) {
					console.log(results);
					console.log("updating Stocks now");
				} else {
					console.log("stock update error");
				}
			}
		}, updateStock);
	}
};

exports.checkoutItemsFromCart = function(req, res) {
	console.log("updatingStock from cart");
	logger.info(req.session.username+" checked out items from cart");

	var items = req.param("items");
	var totalCost = 0;
	for (var i = 0; i < items.length; i++) {
		totalCost = totalCost + items[i].itemcost;
	}
	console.log("totalCost::" + totalCost);
	req.session.checkoutCost = totalCost;
	console.log(":::"+req.session.checkoutCost);

	updateStock(items);
	console.log("items::::::"+items);
	if (req.session.username) {
		console.log("checking out products");
		var checkout = "update shopping_cart set status = 'yes' where username = '"
				+ req.session.username + "';";
		console.log("Query is:" + checkout);
		mysql.insertData(function(err, results) {
			if (err) {
				throw err;
			} else {

				var json_responses;
				if (results === 1) {
					console.log(results);
					console.log("checkout");
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
		}, checkout);
	} else {
		res.redirec('/');
	}

	res.send({
		"statusCode" : 200
	});
};

exports.redirectToPayment = function(req, res) {
	console.log("checkoutCost::"+req.session.checkoutCost);
	if (req.session.username) {
		logger.info(req.session.username+" redirected to Payment");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("payment", {
			username : req.session.username,
			checkoutCost : req.session.checkoutCost
		});
	} else {
		res.redirect('/');
	}
};