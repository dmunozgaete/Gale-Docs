angular.module('app.controllers')

.controller('BusinessUnitCreateStep2Controller', function (	$scope, 
															$state,
															$stateParams,
															$window,
															$Api,
															$karmaTable) {

	//Manual Setup
	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// SETUP
		component.setup('/Sgs/Branchs', {
			filters: [
				{
                    property: "cliente",
                    operator: "eq",
                    value: $stateParams.client
                },

                {
                    property: "configurada",
                    operator: "eq",
                    value: 0
                }
			]
		});
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(data){

			$scope.loadCompleted = true;

		});
		//------------------------------------------------------------------
		
	})

    $scope.rowClick = function(item){

    	//Create the businessUnit
    	$Api.Create("/BusinessUnit", {
    		branch: item.token
    	}).success(function(data){
    		//TODO: SHOW LOADING!!! 
    		$state.go("app.businessUnit-create-3", {
	    		businessUnit: data.token
	    	});

    	})
    }

	$scope.back = function(){
		$window.history.back();
	}

});