var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Open Shopping Cart', function() {
	it('should open shopping cart on /cart GET', function(done) {
		  chai.request(server)
		    .get('/cart')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});

describe('Get products', function() {
	it('should get all the products available for sale on /getProducts GET', function(done) {
		  chai.request(server)
		    .get('/getProducts')
		    .end(function(err, res){
		    	res.should.have.status(200);
		    	done();		 });
	});
});

describe('Login page', function() {
	it('should open Login and registration page on / GET', function(done) {
		  chai.request(server)
		    .get('/')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});

describe('Home', function() {
	it('should open Home page on / GET', function(done) {
		  chai.request(server)
		    .get('/Home')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});


describe('Bidding winners', function() {
	it('should provide a list of winners of past biddings on /updateBid GET', function(done) {
		  chai.request(server)
		    .get('/updateBid')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});