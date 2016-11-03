//super simple rpc server example
var amqp = require('amqp'), util = require('util');
var login = require('./services/login');
var register = require('./services/register');
var home = require('./services/home');
var userProfile = require('./services/userProfile');
var sell = require('./services/sell');
var ebayHandle = require('./services/ebayHandle');
var cart = require('./services/cart');
var bid = require('./services/bid');

var cnn = amqp.createConnection({
	host : '127.0.0.1'
});

cnn.on('ready', function() {
	console.log("listening on Home_queue");
	cnn.queue('Home_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			if(message.refID === 1){
				console.log("in here");
				home.redirectToUserprofile(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2){
				console.log("in here");
				home.getProducts(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3){
				console.log("in here");
				home.logout(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 4){
				console.log("in there");
				home.addToCart(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});

	console.log("listening on register_queue");
	cnn.queue('register_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			register.registerUser(message, function(err, res) {
				// return index sent
				console.log(res);
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	console.log("listening on UserProfile_queue");
	cnn.queue('UserProfile_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			userProfile.updateProfile(message, function(err, res) {
				// return index sent
				console.log(res);
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	console.log("listening on Sell_queue");
	cnn.queue('Sell_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			if(message.refID === 1 ){
				sell.sellProduct(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2 ){
				sell.getSoldProducts(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3 ){
				sell.getPurchasedProducts(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});
	
	console.log("listening on eBayHandle_queue");
	cnn.queue('ebayHandle_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			ebayHandle.ebayHandle(message, function(err, res) {
				// return index sent
				console.log(res);
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	console.log("listening on cart_queue");
	cnn.queue('cart_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			if(message.refID === 1){
				cart.getCartItems(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2){
				cart.removeItemFromCart(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3){
				cart.checkoutItemsFromCart(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});
	
	console.log("listening on bid_queue");
	cnn.queue('bid_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			if(message.refID === 1){
				bid.makeBid(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2){
				bid.updateBid(message, function(err, res) {
					// return index sent
					console.log(res);
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});
});