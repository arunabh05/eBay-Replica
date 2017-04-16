var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('PaymentController' ,function($scope, $http) {

	$scope.invalid_card = true;
	$scope.valid_card = true;

	$scope.validateCard = function($timeout, $location) {
			$http({
				method : "POST",
				url : '/validateCard',
				data : {
					"cardNumber" : $scope.cardNumber,
					"expDate" : $scope.expDate,
					"cvv" : $scope.cvv
				}
			}).success(function(data) {
				if (data.statusCode === 401) {
					$scope.invalid_card = false;
					$scope.valid_card = true;
				} else {
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