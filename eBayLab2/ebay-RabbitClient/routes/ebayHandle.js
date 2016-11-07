var ejs = require("ejs");
var logger = require('./logger');
var mq_client = require('../rpc/client');


exports.ebayHandle = function(req,res){
try{
	var username = req.session.username;
	var ebayHandle = req.param("id");
	var msg_payload = { "ebayHandle":ebayHandle};
	logger.info(username+" requested ebayHandle: "+ebayHandle);
	mq_client.make_request('ebayHandle_queue',msg_payload, function(err,results){
		console.log(results.statusCode);
		if(err){
			throw err;
		}
		else {
			if(results.statusCode === 200){
				console.log("all OK");
				var user = results.user;
				res.render('ebayHandle', {"ebayHandle":ebayHandle,"userProfile":user,"username":username});
			}
			else {    
				res.redirect('/');
			}
		}  
	});
}catch(ex){
	console.log(ex);
}
};