angular.module('app.controllers')

.controller('ServiceTypeListController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable
) {


	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/ServiceType');
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})

	$scope.create = function(item){
		$state.go("app.administration-serviceType-create", {});
	};

	$scope.edit = function(item){
		$state.go("app.administration-serviceType-update", {
			token: item.token
		});

	};

});