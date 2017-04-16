var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('HomeController', function($scope, $http) {
	$scope.item_added = true;
	$scope.quantity = 1;
	$scope.bidding_over = true;
	$scope.bid_added = true;

	var items;
	if (!items) {
		$http({
			method : "GET",
			url : '/getProducts',
			data : {}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				items = data.productList;
				$scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}

	$scope.makeBid = function(amount, item) {
		var now = new Date();
		var selltime = new Date(item.selltime);
		var diffDays =  Math.abs((now.getTime() - selltime.getTime()) / (1000 * 3600 * 24)); 

		if(diffDays < 4)
		{
		$http({
			method : "POST",
			url : '/makeBid',
			data : {
				"item" : item,
				"amount" : amount
			}
		}).success(function(data) {
			$scope.quantity = 1;

			if (data.statusCode === 401) {
				$scope.bid_added = true;
			} else {
				$scope.quantity = 1;
				$scope.unknown_error = true;
				$scope.bid_added = false;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
		}else{
			$scope.bidding_over = false;
		}
	};

	$scope.addToCart = function(item, quantity, price) {
		
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"item" : item,
				"quantity" : quantity,
				"price" : price
			}
		}).success(function(data) {
	
			if (data.statusCode === 401) {
				console.log("error loading cart");
			} else {
				$scope.quantity = 1;
				$scope.unknown_error = true;
				$scope.item_added = false;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	};

	$scope.userProfile = function() {
		window.location.assign("/userProfile");
	};

	$scope.openCart = function() {
		window.location.assign("/cart");
	};
});