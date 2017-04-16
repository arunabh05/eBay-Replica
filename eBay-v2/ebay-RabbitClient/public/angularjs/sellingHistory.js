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
				for(var i=0;i<items.length;i++){
					items[i].selltime = String(new Date(items[i].selltime));
				}
				$scope.items = items;
				$scope.unknown_error = true;
			}
		}).error(function(error) {
			$scope.unknown_error = true;
		});
	}
	
	$scope.userProfile = function() {
		window.location.assign("/userProfile");
	};
	
	$scope.openCart = function() {
		window.location.assign("/cart");
	};
});