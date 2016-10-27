var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('PurchaseHistoryController', function($scope, $http) {
	var items;
	console.log("here");
	if (!items) {
		$http({
			method : "GET",
			url : '/getPurchasedProducts',
			data : {}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				// Making a get call to the '/redirectToHomepage' API
				items = data.productList;
				items = JSON.parse(items);
				console.log(items);
				$scope.items = items;
				// $scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}
	
	$scope.userProfile = function() {
		console.log("loading userProfile");
		window.location.assign("/userProfile");
	};
	
	$scope.openCart = function() {
		console.log("loading cartItems");
		window.location.assign("/cart");
	};

	
});