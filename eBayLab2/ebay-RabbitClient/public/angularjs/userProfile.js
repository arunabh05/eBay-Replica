var EbayApp = angular.module('EbayApp',[]);

EbayApp.controller('ProfileController',function($scope,$http){
	$scope.update_success = true;
	$scope.update_fail = true;
	
	console.log("In profile controller");
	$scope.updateProfile = function(){
		console.log("In update profile");
		
		var bday = $scope.bday;
		var phone = $scope.phone;
		var address = $scope.address;
		
		console.log(typeof bday);
		console.log(phone);
		console.log(address);
		
		$http({
			method : "POST",
			url : '/updateProfile',
			data : {
				"bday": $scope.bday,
				"phone" : $scope.phone,
				"address" : $scope.address
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode === 401) {
				$scope.update_success = true;
				console.log("Update fail");

			} else {
				// Making a get call to the '/redirectToHomepage' API
			//	console.log("");
				$scope.update_success = false;
				//window.location.assign("/userProfile");
				console.log("Update Done");
			}
		}).error(function(error) {
			console.log("error");
		});
		
	};
	
	$scope.openCart = function() {
		console.log("loading cartItems");
		window.location.assign("/cart");
	};
});