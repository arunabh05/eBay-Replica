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
				"itemName": $scope.itemName,
				"itemDesc" : $scope.itemDesc,
				"itemPrice" : $scope.itemPrice,
				"itemQuantity" : $scope.itemQuantity,
				"itemImg" : $scope.itemImg,
				"bid" : $scope.bid
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.sell_fail = false;
				console.log("Sell fail");
			} else {
				// Making a get call to the '/redirectToHomepage' API
			//	console.log("here");
			//	window.location.assign("/userProfile");
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