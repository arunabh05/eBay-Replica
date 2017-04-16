var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('BiddingController', function($scope, $http) {
	var items;
	var items2;
		$http({
			method : "GET",
			url : '/updateBid',
			data : {}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				items = data.bidList;
				items2 = data.winList;
				$scope.items2 = items2;
				$scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

	$scope.userProfile = function() {
	window.location.assign("/userProfile");
	};

	$scope.openCart = function() {
		window.location.assign("/cart");
	};
});