var ejs = require("ejs");
var mysql = require('./mysql');
var logger = require('./logger');

exports.ebayHandle = function(req,res){
	logger.info(req.session.username+" requested ebayHandle: "+req.param("id"));
	var ebayHandle = req.param("id");
		console.log("Ebay handle request");
		var getUserDetails = "select firstname, lastname, bday, address, phone from  user_profile a JOIN user_login b ON a.username = " +
				"b.username and a.username = '"+ebayHandle+"';";
		console.log("Query is:" + getUserDetails);
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var json_responses;
				if (results.length > 0) {
					console.log(results[0].bday);
					  res.render('ebayHandle', {"ebayHandle":ebayHandle,"userProfile":results,"username":req.session.username});

				} else {
					json_responses= {"statusCode":401};
					res.send(json_responses);
				}
			}
		}, getUserDetails);
};