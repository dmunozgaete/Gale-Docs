angular.module('app.controllers')

.controller('ProgrammingListController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable,
	$mdDialog,
	$stateParams
) {

	//----------------------------------------------
    //--[ MODEL
	$scope.data = {
		date: ($stateParams.month ? new Date($stateParams.month) : new Date())
    };
    //----------------------------------------------

	//----------------------------------------------
    //--[ GET PROGRAMMING
    $Api.invoke('GET','/Programming',{
    	month: $scope.data.date.toISOString()
    })
    .success(function(data){
        $scope.data.services = data.items;
    });
    //----------------------------------------------
    

	$karmaTable.then(function(component){

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("beforeRender", function(){
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	})

	//------------------------------------------------------------------
	// VIEW ACTION's
	$scope.edit = function(item){
		$state.go("app.administration-programming-update", {
			service: item.token,
			month: $scope.data.date.toISOString()
		});

	};

	$scope.changeDate = function(){
		$mdDialog.show({
			controller: 'MonthCalendarController',
			escapeToClose: false,
			templateUrl: 'views/shared/monthCalendar.html',
			clickOutsideToClose: false,
			locals: {
				currentDate: $scope.data.date
			}
		}).then(function(changeDate){

			$scope.data.date = changeDate;

			//----------------------------------------------
		    //--[ GET PROGRAMMING
		    $Api.invoke('GET','/Programming',{
		    	month: $scope.data.date.toISOString()
		    })
		    .success(function(data){
		        $scope.data.services = data.items;
		    });
		    //----------------------------------------------

		});
	}
	//------------------------------------------------------------------




});