var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('BiddingController', function($scope, $http) {
	var items;
		$http({
			
			method : "GET",
			url : '/updateBid',
			data : {}
		}).success(function(data) {
			console.log("here update bid");
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				// Making a get call to the '/redirectToHomepage' API
				items = data.bidList;
				console.log(":::"+items);
				$scope.items = items;
				// $scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

		var items2;
		$http({
			
			method : "GET",
			url : '/bidWinners',
			data : {}
		}).success(function(data) {
			console.log("bid winners");
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				// Making a get call to the '/redirectToHomepage' API
				items2 = data.winnerList;
				console.log(":::"+items2);
				$scope.items2 = items2;
				// $scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

	$scope.userProfile = function() {
	console.log("loading userProfile");
	window.location.assign("/userProfile");
	};

	
	$scope.openCart = function() {
		console.log("loading cartItems");
		window.location.assign("/cart");
	};

	
});