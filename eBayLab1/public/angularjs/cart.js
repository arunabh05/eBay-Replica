var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('CartController', function($scope, $http) {
	var items;
	var cost;

	if (!items) {
		$http({
			method : "GET",
			url : '/getCartItems',
			data : {}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				items = data.productList;
				items = JSON.parse(items);
				$scope.items = items;
				var totalCost = 0;

				for (var i = 0; i < items.length; i++) {
					totalCost = totalCost + items[i].itemcost;
				}
				$scope.totalCost = totalCost;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}

	$scope.removeItemFromCart = function(cartid) {
		$http({
			method : "POST",
			url : '/removeItemFromCart',
			data : {
				"cartId" : cartid
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.remove_error = false;
			} else {
				$scope.remove_error = true;
				window.location.assign("/cart");
			}
		}).error(function(error) {
			$scope.remmove_error = false;
		});
	};

	$scope.userProfile = function() {
		window.location.assign("/userProfile");
	};
	
	$scope.checkout = function(){
		$http({
			method : "POST",
			url : '/checkout',
			data : {"items" : items,
				}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.remove_error = false;
			} else {
				$scope.remove_error = true;
				window.location.assign("/payment");
			}
		}).error(function(error) {
			$scope.remmove_error = false;
		});
	};
});