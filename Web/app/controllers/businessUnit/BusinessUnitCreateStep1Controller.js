angular.module('app.controllers')

.controller('BusinessUnitCreateStep1Controller', function (	
	$scope, 
	$state,
	$window,
	$karmaTable,
	$Api,
	$q,
	$log
) {
	$scope.data = {
		clients : []
	};

	var deferred = $q.defer();

	$Api.Read('/Sgs/Clients').success(function(data){
		deferred.resolve(data);	
	});

	$q.all([
        deferred.promise, 
    ]).then(function(resolves){
        $scope.data.clients = resolves[0].items;
        $scope.loadCompleted = true;
        $log.log($scope.data.clients);
    });


	/*$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/Sgs/Clients');
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})*/
	
    $scope.rowClick = function(item){
    	$log.log(item);
    	$state.go("app.businessUnit-create-2", {
    		client: item.token
    	});
    }

	$scope.back = function(){
		$window.history.back();
	}

});
