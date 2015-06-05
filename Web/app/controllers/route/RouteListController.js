angular.module('app.controllers')

.controller('RouteListController', function (
	$scope, 
	$state, 
	$Api, 
	$karmaTable,
	moment,
	Identity,
	$mdDialog,
	$stateParams
) {
	//----------------------------------------------
    //--[ MODEL
	$scope.data = {
		date: ($stateParams.date ? new Date($stateParams.date) : new Date())
    };
    //----------------------------------------------

	var karmaComponent = null;

	$karmaTable.then(function(component){
		
		//------------------------------------------------------------------
		// Setup
		component.setup('/BusinessUnit/Routes?date={0}'.format([
			($scope.data.date).toISOString()	//ISO Date
		]));
		karmaComponent = component;
		//------------------------------------------------------------------

		//------------------------------------------------------------------
		//EVENT HANDLERS
		component.$on("loadComplete", function(data){

			_.each(data.items, function(item){


				var url = $Api.get_endpoint() + "/Printer/Routes?driver={0}&date={1}&businessUnit={2}".format([
					item.token,
					$scope.data.date.toISOString(),
					Identity.get().property("businessUnit").token
				]);

				item.pdf_url = url;
				
			});

			$scope.loadCompleted = true;	//Stop Progress Linear Loading!
		});

		component.$on("cellClick", function(ev, item, xy){
		
			if(xy.y == 4){

				//PRINT
			
			}else{

				//EDIT
				$state.go("app.administration-route-update", {
					token: 	item.token,
					date: 	($scope.data.date).toISOString()
				});

			}

		});
		//------------------------------------------------------------------

	})

	$scope.create = function(item){
		$state.go("app.administration-route-create", {});
	};

        /*$scope.changeDate = function(){
		$mdDialog.show({
			controller: 'CalendarModalController',
			escapeToClose: false,
			templateUrl: 'views/shared/calendar.html',
			clickOutsideToClose: false,
			locals: {
				currentDate: $scope.data.date
			}
		}).then(function(changeDate){

			$scope.data.date = changeDate;

			karmaComponent.setup('/BusinessUnit/Routes?date={0}'.format([
				($scope.data.date).toISOString()	//ISO Date
			]));

		});
	}*/


        //------------------------------------------------------------------

        $scope.changeDate = function(ev) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                template:
                '<md-dialog style="width: 600px" layout-margin>' +
                '   <time-date-picker ng-model="date" display-mode="date"></time-date-picker>' +
                '</md-dialog>',
                targetEvent: ev,
                controller: CalendarModalController
            }).then(function(changeDate){
                $scope.data.date = changeDate;
                karmaComponent.setup('/BusinessUnit/Routes?date={0}'.format([
                    ($scope.data.date).toISOString()	//ISO Date
                ]));

            });
        };


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

});