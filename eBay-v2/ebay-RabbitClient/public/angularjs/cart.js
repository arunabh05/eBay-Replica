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
				$scope.items = items;
				var totalCost = 0;
				for (var i = 0; i < items.length; i++) {
					totalCost = totalCost + items[i].cost;
				}
				$scope.totalCost = totalCost;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

	}

	$scope.removeItemFromCart = function(itemid) {
		$http({
			method : "POST",
			url : '/removeItemFromCart',
			data : {
				"itemid" : itemid
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