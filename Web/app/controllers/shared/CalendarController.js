angular.module('app.controllers')

//MODAL'S
.controller('CalendarModalController', function(	
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
		yesterday.setDate(date.getDate()-1);

		$scope.selectedDate = yesterday;
	}

	$scope.after = function(){
		var date = $scope.selectedDate;

		var tomorrow = new Date(date);
		tomorrow.setDate(date.getDate()+1);

		$scope.selectedDate = tomorrow;
	}

	$scope.save = function(date) {
		//Change Date
		$mdDialog.hide($scope.selectedDate);
	};
	//----------------------------------------------
});