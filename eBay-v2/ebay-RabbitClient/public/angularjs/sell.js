var EbayApp = angular.module('EbayApp', []);
EbayApp.controller('SellController', function($scope, $http) {
	$scope.sell_success = true;
	$scope.sell_fail = true;
	
	$scope.sellProduct = function() {
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
			if (data.statusCode === 401) {
				$scope.sell_fail = false;
			} else {
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
		window.location.assign("/userProfile");
	};
	$scope.openCart = function() {
		window.location.assign("/cart");
	};		
});