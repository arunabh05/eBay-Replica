var EbayApp = angular.module('EbayApp', []);
EbayApp.controller('SellController', function($scope, $http) {
	console.log("Sell Controller");
	$scope.sell_success = true;
	$scope.sell_fail = true;
	
	$scope.sellProduct = function() {
		console.log($scope.bid);
		console.log("inside Sell Product");
		$http({
			method : "POST",
			url : '/sellProduct',
			data : {
				"itemname": $scope.itemName,
				"itemdesc" : $scope.itemDesc,
				"itemprice" : $scope.itemPrice,
				"itemquantity" : $scope.itemQuantity,
				"itemimg" : $scope.itemImg,
				"bid" : $scope.bid
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.sell_fail = false;
				console.log("Sell fail");
			} else {
				console.log("Update Done");
				$scope.itemName = "";
				$scope.itemDesc = "";
				$scope.itemPrice = "";
				$scope.itemQuantity = "";
				$scope.sell_success = false;
			}
		}).error(function(error) {
			console.log("error");
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