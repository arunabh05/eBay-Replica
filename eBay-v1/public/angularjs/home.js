var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('HomeController', function($scope, $http) {
	$scope.item_added = true;
	$scope.bid_added = true;
	var a = '<%= username %>';
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
				items = JSON.parse(items);

				$scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}

	$scope.makeBid = function(amount, itemid, quantity, price) {
		$http({
			method : "POST",
			url : '/makeBid',
			data : {
				"itemid" : itemid,
				"quantity" : quantity,
				"price" : price,
				"amount" : amount
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.bid_added = true;
			} else {
				$scope.quantity = "";
				$scope.unknown_error = true;
				$scope.bid_added = false;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	};

	$scope.addToCart = function(itemid, quantity, price) {
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"itemid" : itemid,
				"quantity" : quantity,
				"price" : price
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				console.log("error loading cart");
			} else {
				$scope.quantity = "";
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
