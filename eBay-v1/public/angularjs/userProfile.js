var EbayApp = angular.module('EbayApp',[]);

EbayApp.controller('ProfileController',function($scope,$http){
	$scope.update_success = true;
	$scope.update_fail = true;
	
	$scope.updateProfile = function(){
		
		var bday = $scope.bday;
		var phone = $scope.phone;
		var address = $scope.address;
		
		$http({
			method : "POST",
			url : '/updateProfile',
			data : {
				"bday": $scope.bday,
				"phone" : $scope.phone,
				"address" : $scope.address
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.update_success = true;
				console.log("Update fail");

			} else {
				$scope.update_success = false;
			}
		}).error(function(error) {
			console.log("error");
		});
	};
	
	$scope.openCart = function() {
		window.location.assign("/cart");
	};
});