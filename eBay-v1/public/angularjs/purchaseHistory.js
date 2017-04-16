var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('PurchaseHistoryController', function($scope, $http) {
	var items;
	if (!items) {
		$http({
			method : "GET",
			url : '/getPurchasedProducts',
			data : {}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				items = data.productList;
				items = JSON.parse(items);

				$scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}
	
	$scope.userProfile = function() {
		window.location.assign("/userProfile");
	};
	
	$scope.openCart = function() {
		window.location.assign("/cart");
	};
});