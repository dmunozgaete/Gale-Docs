angular.module('app.controllers')

.controller('ReportDailyMovementsController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable,
	moment,
	Identity,
	$mdDialog,
	$filter
) {
	$scope.loadCompleted 		= true;	//Start Loading
	$scope.data = {
		from: (new Date()),
		to: (new Date())
	}

	var _karmaComponent = null;
	var _changeFilters = function(from,to,type){
		var format= function(date){
			return $filter('capitalize')('{0} de {1}'.format([
				$filter('amDateFormat')(date, 'dddd, D'),
				$filter('amDateFormat')(date, 'MMMM YYYY')
			])); 
		}
		//------------------------------------------------------------------
		// SET VALUES (FROM)
		if(!from) {
			return;
		}
		$scope.data.from 			= from;
		$scope.data.formattedFromDate	= format(from);
       	//------------------------------------------------------------------

       	//------------------------------------------------------------------
		// SET VALUES (TO)
		if(!to) {
			return;
		}
		$scope.data.to 			= to;
		$scope.data.formattedToDate	= format(to);
       	//------------------------------------------------------------------
       	
       	//------------------------------------------------------------------
		// SET VALUES (TYPE)
		if(!type) {
			return;
		}
		$scope.data.type 			= type;
       	//------------------------------------------------------------------
       	
      
		//------------------------------------------------------------------
		// Component Setup
		$scope.loadCompleted 		= false;	//Start Loading
		_karmaComponent.setup('/Report/DailyMovements?from={0}&to={1}&type={2}'.format([
			from.toISOString(),	//ISO Date
			to.toISOString(),	//ISO Date
			type.token				//Type Token
		]));
		//------------------------------------------------------------------
	}

	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Component Reference
		_karmaComponent = component;
		//------------------------------------------------------------------
		
		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(data){

			$scope.reportData = data;
			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});
		//------------------------------------------------------------------

	});

	//----------------------------------------------
    //--[ GET SERVICES (FOR FILTER'S SERVICE TYPES AVAILABLE)
    $Api.Read('/BusinessUnit/Services')
    .success(function(data){
        $scope.data.collections = {
        	types: data.items
        }
    });
    //----------------------------------------------
    
	//----------------------------------------------
	// VIEW ACTION'S
	/*$scope.changeDate = function(part){
		$mdDialog.show({
			controller: 'CalendarModalController',
			escapeToClose: false,
			templateUrl: 'views/shared/calendar.html',
			clickOutsideToClose: false,
			locals: {
				currentDate: (part == 'from' ? $scope.data.from : $scope.data.to)
			}
		})*/
        $scope.changeDate = function(part) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                template:
                '<md-dialog style="width: 600px" layout-margin>' +
                '   <time-date-picker ng-model="date" display-mode="date"></time-date-picker>' +
                '</md-dialog>',
                locals: {
                    currentDate: (part == 'from' ? $scope.data.from : $scope.data.to)
                },
                controller: CalendarModalController
            }).then(function(newDate){

			if(part == 'from'){
				if($scope.data.from != newDate){
					_changeFilters(
						newDate,
						$scope.data.to,
						$scope.data.type
					);
				}
			}else{
				if($scope.data.to != newDate){
					_changeFilters(
						$scope.data.from,
						newDate,
						$scope.data.type
					);
				}
			}
			

		});
	}

        function CalendarModalController($scope, $mdDialog) {
            $scope.date = new Date();
            $scope.$watch(function(){
                return $scope.date;
            },function(newDate, oldDate){
                if(newDate !== oldDate){
                    $scope.closeDialog();
                }
            });

            $scope.closeDialog = function() {
                $mdDialog.hide($scope.date);
            };
        }

	$scope.changeType = function(type){
		_changeFilters(
			$scope.data.from,
			$scope.data.to,
			type
		);
	}

	$scope.export = function(){
		var data = $scope.data;
		var url = $Api.get_endpoint() + '/Printer/DailyMovements?from={0}&to={1}&type={2}&businessUnit={3}'.format([
			data.from.toISOString(),	//ISO Date
			data.to.toISOString(),		//ISO Date
			data.type.token,			//Type Token
			Identity.get().property("businessUnit").token
		]);

		window.open(url);
	}
	//----------------------------------------------

	_changeFilters($scope.data.from,$scope.data.to);
});