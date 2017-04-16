var express = require('express'); 
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var login = require('./routes/login');
var home = require('./routes/home');
var register = require('./routes/register');
var userProfile = require('./routes/userProfile');
var sell = require('./routes/sell');
var cart = require('./routes/cart');
var payment = require('./routes/payment');
var bid = require('./routes/bid');
var ebayHandle = require('./routes/ebayHandle');
var passport = require('passport');
require('./routes/passport')(passport);

var mongo = require('./routes/mongo');
var mongoSessionConnectURL = "mongodb://localhost:27017/ebayappdemo";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

var session = require('client-sessions');
var app = express();
// all environments
// configure the sessions with our application
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
// get request
app.get('/', login.login);
app.get('/users', user.list);

app.get('/login', login.login);
app.get('/userList',login.userList);

//app.get('/Home', home.redirectToHomepage);

app.post('/afterLogin', function(req, res, next) {
	passport.authenticate('login', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send({"statusCode":401});
		}
		req.logIn(user, {
			session : false
		}, function(err) {
			if (err) {
				console.log("9");
				return next(err);
			}
			req.session.username = user.username;
			req.session.lastlogin = String(user.lastlogin);
			console.log("session initilized");
			return res.render('Home', {
				username : user.username,
				lastlogin : String(user.lastlogin)
			});
		});
	})(req, res, next);
});

function isAuthenticated(req, res, next) {
	  if(req.session.username) {
	     console.log(req.session.username+"+++++"+req.session.lastlogin);
	     return next();
	  }
	  res.redirect('/');
	}
app.get('/Home', isAuthenticated, home.redirectToHomepage);
app.get('/userProfile',isAuthenticated, home.redirectToUserprofile);
app.get('/Sell',isAuthenticated, home.redirectToSell);
app.get('/getProducts',isAuthenticated, home.getProducts);
app.get('/cart',isAuthenticated, cart.redirectToCart);
app.get('/getCartItems',isAuthenticated, cart.getCartItems);
app.get('/payment',isAuthenticated, cart.redirectToPayment);
app.get('/sellingHistory',isAuthenticated, sell.sellingHistory);
app.get('/getSoldProducts',isAuthenticated, sell.getSoldProducts);
app.get('/purchaseHistory',isAuthenticated, sell.purchaseHistory);
app.get('/getPurchasedProducts',isAuthenticated, sell.getPurchasedProducts);
app.get('/updateBid',isAuthenticated, bid.updateBid);
app.get('/highestBidder',isAuthenticated, bid.highestBidder);
// app.get('/bidWinners',bid.bidWinners);
app.get('/users/:id', ebayHandle.ebayHandle);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

// post request
//app.post('/afterLogin', login.afterLogin);
try{
app.post('/logout',isAuthenticated, home.logout);
app.post('/register', register.registerUser);
app.post('/updateProfile',isAuthenticated, userProfile.updateProfile);
app.post('/sellProduct',isAuthenticated, sell.sellProduct);
app.post('/addToCart',isAuthenticated, home.addToCart);
app.post('/removeItemFromCart',isAuthenticated, cart.removeItemFromCart);
app.post('/checkout',isAuthenticated, cart.checkoutItemsFromCart);
app.post('/validateCard',isAuthenticated, payment.validateCard);
app.post('/makeBid',isAuthenticated, bid.makeBid);
}
catch(ex){
	console.log(ex.message);
}



mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});

module.exports = app;
