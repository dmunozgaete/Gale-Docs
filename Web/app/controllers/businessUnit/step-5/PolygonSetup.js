angular.module('app.controllers')

//MODAL CONTROLLER
.controller('PolygonSetup', function(	
	$scope, 
	$timeout, 
	collections,
	polygon,
	$log, 
	$mdDialog, 
	$Api,
	$mdToast
){

	//Clone Original Information , for restoring
	var _restoringInformation = angular.copy({
		name: 		polygon.information.name,
		services: 	polygon.information.services,
		type: 		polygon.information.type
	});	

	//----------------------------------------------
	//SET POLYGON INTO SCOPE
	$scope.polygon 	= polygon;
	$scope.types 	= collections.types;
	
	//----------------------------------------------
/*
	$scope.toggleSelect = function(service) {
		service.selected = !service.selected;
		var array = polygon.information.services;

		if(!service.selected){
			//REMOVE
			for(var i = array.length - 1; i >= 0; i--){
			    if(array[i] == service.token){
			        array.splice(i,1);
			        break;
			    }
			}
		}else{
			//ADD SERVICE
			array.push(service.token);	
		}
	
	};*/

	$scope.setType = function(type) {
		polygon.changeType(type.identificador);
	};

	//----------------------------------------------
	//MODAL ACTION'S
	$scope.cancel = function() {

		//Restoring Before Cancel
		angular.extend(polygon.information, _restoringInformation);
		polygon.changeType(_restoringInformation.type);	//Visual restore

		$mdDialog.cancel();
	};

	$scope.save = function(polygon) {

		//CHECK NAME
		var array = collections.polygons;
		for(var i = array.length - 1; i >= 0; i--){
			if(array[i] !== polygon && array[i].information.name == polygon.information.name){
	        	$mdToast.show(
			      $mdToast.simple()
			        .content('Ya existe un polígono con ese nombre')
			        .position('bottom left')
			        .hideDelay(3000)
			    );
		        return;
		    }
		}

		$mdDialog.hide(polygon);
	};
	//----------------------------------------------
});