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
	cnn.queue('login_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log(":::::::::" + m.replyTo);
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			if(message.refID === 2){
				login.userList(message, function(err, res) {
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});}
		});
	});

	cnn.queue('Home_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			if(message.refID === 1){
				home.redirectToUserprofile(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2){
				home.getProducts(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3){
				home.logout(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 4){
				home.addToCart(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});

	cnn.queue('register_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			register.registerUser(message, function(err, res) {
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('UserProfile_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			userProfile.updateProfile(message, function(err, res) {
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('Sell_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			if(message.refID === 1 ){
				sell.sellProduct(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2 ){
				sell.getSoldProducts(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3 ){
				sell.getPurchasedProducts(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});
	
	cnn.queue('ebayHandle_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			ebayHandle.ebayHandle(message, function(err, res) {
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('cart_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			if(message.refID === 1){
				cart.getCartItems(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 2){
				cart.removeItemFromCart(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
			if(message.refID === 3){
				cart.checkoutItemsFromCart(message, function(err, res) {
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
		});
	});
	
	cnn.queue('bid_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			if(message.refID === 1){
				bid.makeBid(message, function(err, res) {
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
				//	console.log(res);
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