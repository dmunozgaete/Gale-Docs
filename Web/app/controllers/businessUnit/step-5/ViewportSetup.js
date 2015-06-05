angular.module('app.controllers')

//MODAL s
.controller('ViewportSetup', function(	
	$scope, 
	$mdDialog, 
	$Api,
	$log
){

	$scope.viewport = {};
	
	//----------------------------------------------
	//MODAL ACTION'S
	$scope.cancel = function() {

		$mdDialog.cancel();
	};


	$scope.save = function(viewport) {

		//CHANGE
		viewport.zoom 		= viewport.zoom.replace(",", ".");
		viewport.latitude 	= viewport.latitude.replace(",", ".");
		viewport.longitude 	= viewport.longitude.replace(",", ".");

		viewport.zoom = parseInt(viewport.zoom);
		viewport.latitude = parseFloat(viewport.latitude);
		viewport.longitude = parseFloat(viewport.longitude);

		$mdDialog.hide(viewport);
		
	};
	//----------------------------------------------
});



