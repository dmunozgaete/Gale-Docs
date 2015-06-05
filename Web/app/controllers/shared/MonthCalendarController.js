angular.module('app.controllers')

//MODAL'S
.controller('MonthCalendarController', function(	
	$scope, 
	$mdDialog,
	$log,
	currentDate
){

	//----------------------------------------------
	// MODEL
	$scope.selectedDate = currentDate;
	//----------------------------------------------
	
	//----------------------------------------------
	//MODAL ACTION'S
	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.before = function(){
		var date = $scope.selectedDate;

		var yesterday = new Date(date);
		yesterday.setMonth(date.getMonth()-1);

		$scope.selectedDate = yesterday;
	}

	$scope.after = function(){
		var date = $scope.selectedDate;

		var tomorrow = new Date(date);
		tomorrow.setMonth(date.getMonth()+1);

		$scope.selectedDate = tomorrow;
	}

	$scope.save = function(date) {
		//Change Date
		$mdDialog.hide($scope.selectedDate);
	};
	//----------------------------------------------
});