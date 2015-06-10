angular.module('app.controllers')

.controller('Administration_BpmInboxController', function ($scope, 
														  $state, 
													  	  $Api, 
													  	  $karmaTable) {

	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})
	
});