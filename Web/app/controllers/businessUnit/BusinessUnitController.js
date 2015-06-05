angular.module('app.controllers')

.controller('BusinessUnitController', function (	
	$scope, 
	$state,
	$karmaTable
){

	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/BusinessUnit');
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})


	$scope.edit = function(item){
		$state.go("app.businessUnit-create-3", {
    		businessUnit: item.token
    	});
	}

	$scope.create = function(item){
		$state.go("app.businessUnit-create-1")
	}
});