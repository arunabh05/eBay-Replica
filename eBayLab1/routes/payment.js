var logger = require('./logger');

exports.validateCard = function(req, res) {
	var cardNumber = req.param("cardNumber");
	var expDate = req.param("expDate");
	var CVV = req.param("cvv");
		console.log("here");
	console.log(typeof Number(cardNumber));
	console.log(cardNumber);
	if ((isNaN(cardNumber) === true) || (isNaN(CVV) === true)
			|| cardNumber.length !== 16 || CVV.length !== 3) {
		console.log("invalid Card");
		res.send({
			"statusCode" : 401
		});
	} else {
		logger.info(req.session.username+" paid "+req.session.checkoutCost);
		console.log("valid Card");
		res.send({
			"statusCode" : 200
		});
	}
};
