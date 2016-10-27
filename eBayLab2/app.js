

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var login = require('./routes/login');
var home = require('./routes/home');
var register = require('./routes/register');
var userProfile = require('./routes/userProfile');
var sell = require('./routes/sell');
var cart = require('./routes/cart');
var payment = require('./routes/payment');
var bid = require('./routes/bid');
var ebayHandle = require('./routes/ebayHandle');

var session = require('client-sessions');
var app = express();
//all environments
//configure the sessions with our application
app.use(session({   
	cookieName: 'session',    
	secret: 'ebay_app',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently
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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// get request
app.get('/', login.login);
app.get('/users', user.list);
app.get('/login',login.login);
app.get('/Home',home.redirectToHomepage);
app.get('/userProfile',home.redirectToUserprofile);
app.get('/Sell',home.redirectToSell);
app.get('/getProducts',home.getProducts);
app.get('/cart',cart.redirectToCart);
app.get('/getCartItems',cart.getCartItems);
app.get('/payment',cart.redirectToPayment);
app.get('/sellingHistory',sell.sellingHistory);
app.get('/getSoldProducts',sell.getSoldProducts);
app.get('/purchaseHistory',sell.purchaseHistory);
app.get('/getPurchasedProducts',sell.getPurchasedProducts);
app.get('/updateBid',bid.updateBid);
app.get('/highestBidder',bid.highestBidder);
//app.get('/bidWinners',bid.bidWinners);
app.get('/users/:id',ebayHandle.ebayHandle);


// post request
app.post('/afterLogin',login.afterLogin);
app.post('/logout',home.logout);
app.post('/register',register.registerUser);
app.post('/updateProfile',userProfile.updateProfile);
app.post('/sellProduct',sell.sellProduct);
app.post('/addToCart',home.addToCart);
app.post('/removeItemFromCart',cart.removeItemFromCart);
app.post('/checkout',cart.checkoutItemsFromCart);
app.post('/validateCard',payment.validateCard);
app.post('/makeBid',bid.makeBid);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
