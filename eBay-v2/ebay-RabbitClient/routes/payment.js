var logger = require('./logger');

exports.validateCard = function(req, res) {
try{
	var cardNumber = req.param("cardNumber");
	var expDate = req.param("expDate");
	var CVV = req.param("cvv");
		console.log("here");

	if ((isNaN(cardNumber) === true) || (isNaN(CVV) === true)
			|| cardNumber.length !== 16 || CVV.length !== 3) {
		res.send({
			"statusCode" : 401
		});
	} else {
		logger.info(req.session.username+" paid "+req.session.checkoutCost);
		res.send({
			"statusCode" : 200
		});
	}
}catch(ex){
	console.log(ex);
}
};
