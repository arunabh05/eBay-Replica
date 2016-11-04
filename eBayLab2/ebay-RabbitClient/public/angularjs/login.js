/**
 * New node file
 */
var EbayApp = angular.module('EbayApp', []);

EbayApp.controller('loginRegisterController', function($scope, $http) {
	$scope.invalid_login = true;
	$scope.invalid_register = true;
	$scope.email_unmatch = true;
	$scope.username_error = true;
var usernames;
	$http({
		method : "GET",
		url : '/userList',
		data : {}
	}).success(function(data) {
		// checking the response data for statusCode
		if (data.statusCode === 401) {
			console.log("here");
			$scope.invalid_login = false;
		} else {
			$scope.invalid_login = true;
			console.log("there");
			console.log(data.username);
			usernames = data.username;
			$scope.username = usernames;
		}
	}).error(function(error) {
		console.log("here");
		$scope.invalid_login = true;
	});

	$scope.signIn = function(userId, pass) {
		console.log("Post login request");
		$http({
			method : "POST",
			url : '/afterLogin',
			data : {
				"username" : $scope.userId,
				"password" : $scope.password
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				
				$scope.invalid_login = false;

			} else {
				// Making a get call to the '/redirectToHomepage' API
			//	console.log(data.lastlogin);
	//			$sessionStorage.username = $scope.userId;
				window.location.assign("/Home");
				$scope.invalid_login = true;
			}
		}).error(function(error) {
			$scope.invalid_login = true;
		});
	};

	$scope.validateLogin = function() {
		$scope.invalid_login = true;

		console.log("Start validation");
		var userId = $scope.userId;
		var pass = $scope.password;
		console.log(userId);
		console.log(pass);

		if (userId.indexOf('=') !== -1 || userId.indexOf(';') !== -1
				|| pass.indexOf('=') !== -1 || pass.indexOf(';') !== -1) {
			$scope.invalid_login = false;
			console.log("Injection Attack");
		} else {
			$scope.signIn(userId, pass);
		}
	};

	$scope.registerUser = function(fname, lname, email, pass2) {
		console.log("Post register request");
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
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_register = true;

			} else {
				// Making a get call to the '/redirectToHomepage' API
				window.location.assign("/login");
				console.log("here");
				$scope.invalid_login = true;
			}
		}).error(function(error) {
			$scope.invalid_register = true;
		});
	};

	$scope.validateRegister = function() {

		$scope.invalid_register = true;
		$scope.email_unmatch = true;

		
		console.log("Start register validation");
		var fname = $scope.fname;
		var lname = $scope.lname;
		var username2 = $scope.username2;
		var email = $scope.email;
		var remail = $scope.remail;
		var pass2 = $scope.password2;
		
	//	console.log(usernames[0].username);
		for(var i=0;i<usernames.length;i++)
		{
			if(usernames[i].username==username2){
				$scope.username_error = false;
				console.log("finally");
				//break;
				return;
			}

		}
		
		if (remail !== email) {
			console.log("Email unmatch");
			$scope.email_unmatch = false;
		} 
		else {
			if (fname.indexOf('=') !== -1 || lname.indexOf('=') !== -1
					|| username2.indexOf('=') !== -1
					|| email.indexOf('=') !== -1 || pass2.indexOf(';') !== -1) {
				$scope.invalid_register = false;
				console.log("Injection Attack");
			} else {
				console.log("finally2");
				
				$scope.registerUser(fname, lname, username2, email, pass2);
			}
		}
	};

	$scope.guestUser = function() {
		console.log("In guest mode");
	};
	$scope.forgotPassword = function() {
		console.log("Password recovery");
	};
});