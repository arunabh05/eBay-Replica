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
				console.log(items);
				$scope.items = items;
				var totalCost = 0;
				console.log(items.length);
				for (var i = 0; i < items.length; i++) {
					totalCost = totalCost + items[i].cost;
					console.log(items[i].cost);
					console.log(totalCost);
				}
				$scope.totalCost = totalCost;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

	}

	$scope.removeItemFromCart = function(itemid) {
		console.log(itemid);
		$http({
			method : "POST",
			url : '/removeItemFromCart',
			data : {
				"itemid" : itemid
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.remove_error = false;
				
			} else {
				// Making a get call to the '/redirectToHomepage' API
				$scope.remove_error = true;
				window.location.assign("/cart");
				console.log("Item sucessfully removed!!");
			}
		}).error(function(error) {
			$scope.remmove_error = false;
		});

	};

	$scope.userProfile = function() {
		console.log("loading userProfile");
		window.location.assign("/userProfile");
	};
	
	$scope.checkout = function(){
		console.log("checkout");
		$http({
			method : "POST",
			url : '/checkout',
			data : {"items" : items,
				}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.remove_error = false;
				
			} else {
				// Making a get call to the '/redirectToHomepage' API
				$scope.remove_error = true;
				window.location.assign("/payment");
				console.log("Checkout sucessfull!!");
			}
		}).error(function(error) {
			$scope.remmove_error = false;
		});
	};
});