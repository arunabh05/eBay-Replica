var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('PaymentController' ,function($scope, $http) {

	$scope.invalid_card = true;
	$scope.valid_card = true;

	$scope.validateCard = function($timeout, $location) {
		console.log($scope.cvv);
			$http({
				method : "POST",
				url : '/validateCard',
				data : {
					"cardNumber" : $scope.cardNumber,
					"expDate" : $scope.expDate,
					"cvv" : $scope.cvv
				}
			}).success(function(data) {
				console.log(data.statusCode);
				// checking the response data for statusCode
				if (data.statusCode === 401) {
					console.log("error loading cart");
					$scope.invalid_card = false;
					$scope.valid_card = true;
				} else {
					console.log("payment successful");
					$scope.invalid_card = true;
					$scope.valid_card = false;
					var delay = 1000; //Your delay in milliseconds
					setTimeout(function(){ window.location = '/Home'; }, delay);
				}
			}).error(function(error) {
				$scope.unknown_error = true;
			});

	};

});