var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('loginRegisterController', function($scope, $http) {
	$scope.invalid_login = true;
	$scope.invalid_register = true;
	$scope.email_unmatch = true;

	$scope.signIn = function(userId, pass) {
		$http({
			method : "POST",
			url : '/afterLogin',
			data : {
				"username" : $scope.userId,
				"password" : $scope.password
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
			} else {
				window.location.assign("/Home");
				$scope.invalid_login = true;
			}
		}).error(function(error) {
			$scope.invalid_login = true;
		});
	};

	$scope.validateLogin = function() {
		$scope.invalid_login = true;
		var userId = $scope.userId;
		var pass = $scope.password;
		if (userId.indexOf('=') !== -1 || userId.indexOf(';') !== -1
				|| pass.indexOf('=') !== -1 || pass.indexOf(';') !== -1) {
			$scope.invalid_login = false;
		} else {
			$scope.signIn(userId, pass);
		}
	};

	$scope.registerUser = function(fname, lname, email, pass2) {
		$http({
			method : "POST",
			url : '/register',
			data : {
				"username" : $scope.username2,
				"password" : $scope.password2,
				"email" : $scope.email,
				"firstname" : $scope.fname,
				"lastname" : $scope.lname
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.invalid_register = true;
			} else {
				window.location.assign("/login");
				$scope.invalid_login = true;
			}
		}).error(function(error) {
			$scope.invalid_register = true;
		});
	};

	$scope.validateRegister = function() {
		$scope.invalid_register = true;
		$scope.email_unmatch = true;
		var fname = $scope.fname;
		var lname = $scope.lname;
		var username2 = $scope.username2;
		var email = $scope.email;
		var remail = $scope.remail;
		var pass2 = $scope.password2;
		if (remail !== email) {
			$scope.email_unmatch = false;
		} else {
			if (fname.indexOf('=') !== -1 || lname.indexOf('=') !== -1|| username2.indexOf('=') !== -1||
			    	email.indexOf('=') !== -1 || pass2.indexOf(';') !== -1) {
				$scope.invalid_register = false;
			} else {
				$scope.registerUser(fname, lname, username2, email, pass2);
			}
		}
	};

	$scope.guestUser = function() {
	};
	$scope.forgotPassword = function() {
	};
});
