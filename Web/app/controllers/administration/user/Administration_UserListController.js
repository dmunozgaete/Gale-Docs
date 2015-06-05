angular.module('app.controllers')

.controller('Administration_UserListController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable
) {


	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/User');
		//------------------------------------------------------------------
		
		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})

	$scope.create = function(item){
		$state.go("app.administration-user-create", {});
	};

	$scope.edit = function(item){
		$state.go("app.administration-user-update", {
			token: item.token
		});

	};

});