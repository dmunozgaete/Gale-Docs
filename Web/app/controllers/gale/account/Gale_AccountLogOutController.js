angular.module('app.controllers')

.controller('Gale_AccountLogOutController', function (	$scope, 
											$state,
											Identity) {

	Identity.logOut();
	
});