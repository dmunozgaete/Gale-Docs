angular.module('app.controllers')

.controller('PolygonTypeListController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable
) {


	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/PolygonType');
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})

	$scope.create = function(item){
		$state.go("app.administration-polygonType-create", {});
	};

	$scope.edit = function(item){
		$state.go("app.administration-polygonType-update", {
			token: item.token
		});

	};

});