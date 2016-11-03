var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('SellHistoryController', function($scope, $http) {
	var items;
	if (!items) {
		$http({
			method : "GET",
			url : '/getSoldProducts',
			data : {}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.unknown_error = false;
			} else {
				items = data.productList;
				var items2;
				console.log(items);
				for(var i=0;i<items.length;i++){
					items[i].selltime = String(new Date(items[i].selltime));
			//		console.log((items[i].selltime).toString());
					console.log("1");
				}
				console.log(items[0].selltime);
				$scope.items = items;

				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}
	
	$scope.userProfile = function() {
		console.log("loading userProfile");
		window.location.assign("/userProfile");
	};
	
	$scope.openCart = function() {
		console.log("loading cartItems");
		window.location.assign("/cart");
	};
});