angular.module('app.controllers')

.controller('LogOutController', function (	$scope, 
											$state,
											Identity) {

	Identity.logOut();
	
});