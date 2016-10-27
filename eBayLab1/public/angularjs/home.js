var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('HomeController', function($scope, $http) {
	$scope.item_added = true;
	$scope.bid_added = true;
	var a = '<%= username %>';
	console.log(a);
	console.log("Home Controller");
	var items;
	if (!items) {
		$http({
			method : "GET",
			url : '/getProducts',
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

	$scope.makeBid = function(amount, itemid, quantity, price) {
		console.log(itemid);
		console.log("q" + quantity);
		console.log("p" + price);
		console.log(amount);
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
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				console.log("error loading cart");
				$scope.bid_added = true;
			} else {
				$scope.quantity = "";
				console.log("bidding donee");
				$scope.unknown_error = true;
				$scope.bid_added = false;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});

	};

	$scope.addToCart = function(itemid, quantity, price) {
		console.log(itemid);
		console.log("q" + quantity);
		console.log("p" + price);
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"itemid" : itemid,
				"quantity" : quantity,
				"price" : price
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				console.log("error loading cart");
			} else {
				$scope.quantity = "";
				console.log("items added to cart");
				$scope.unknown_error = true;
				$scope.item_added = false;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	};

	$scope.userProfile = function() {
		console.log("loading userProfile");
		window.location.assign("/userProfile");
	};

	$scope.openCart = function() {
		console.log("loading cartItems");
		window.location.assign("/cart");
	};

});