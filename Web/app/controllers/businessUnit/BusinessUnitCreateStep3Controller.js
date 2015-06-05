angular.module('app.controllers')

.controller('BusinessUnitCreateStep3Controller', function (	$scope, 
															$state,
															$stateParams,
															$karmaTable,
															$Configuration,
															$Api,
															$log,
															$mdDialog,
															$Localization,
															$q,
															$window) {

	//------------------------------------------------------------------
	// (Override the businessUnit header)
	var businessUnit 		= $stateParams.businessUnit;
	var header 				= $Configuration.get("customHeaders")["businessUnit"];
	var customHeaders 		= {};
	customHeaders[header] 	= businessUnit;
	//------------------------------------------------------------------
	
	$scope.data = {
		drivers: {
			items: [],
			filter: "",
			item: null,
			change: function(){},
			search: function(query){
				var deferred = $q.defer();

				$Api.Read('/Sgs/Drivers', {
					filters: [
						{
							property: 'identificador',
							operator: 'contains',
							value: query
						}
					]
				}).success(function(data){
					deferred.resolve(data.items);	
				});
				
				return deferred.promise;
			},

			add: function(item){
				if(!item){
					return
				};
				var data = $scope.data.drivers;
				var find = _.find(data.items, {token: item.token});

				data.filter = "";
				data.item = null;

				if(!find){
					$Api.Create('/BusinessUnit/Drivers', {
						token: item.token
					}, customHeaders)
					.success(function(){
						data.items.unshift(item);
					});
				}
			},

			remove: function(item){

				// Delete Confirm
		        $mdDialog.show(
		            $mdDialog.confirm()
		            .ariaLabel('')
		            .targetEvent(event)
		            .title($Localization.get('DELETE_CONFIRM_TITLE'))
		            .content($Localization.get('DELETE_CONFIRM_CONTENT'))
		            .ok($Localization.get('DELETE_CONFIRM_OK_LABEL'))
		            .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
		        ).then(function() {
		            
		            //-----------------------------
		            var data = $scope.data.drivers;
					$Api.Delete('/BusinessUnit/Drivers', item.token , customHeaders)
					.success(function(){
						
						var index = _.indexOf(_.pluck(data.items, 'token'), item.token);
						if(index>=0){
							data.items.splice( index, 1); 
						}

					});
					//-----------------------------
					
		        });

			}
		},

		vehicles: {
			items: [],
			filter: "",
			item: null,
			change: function(){},
			search: function(query){

				var deferred = $q.defer();

				$Api.Read('/Sgs/Vehicles', {
					filters: [
						{
							property: 'identificador',
							operator: 'contains',
							value: query
						}
					]
				}).success(function(data){
					deferred.resolve(data.items);	
				});
				
				return deferred.promise;

			},

			add: function(item){
				if(!item){
					return
				};

				var data = $scope.data.vehicles;
				var find = _.find(data.items, {token: item.token});

				data.filter = "";
				data.item = null;

				if(!find){
					$Api.Create('/BusinessUnit/Vehicles', {
						token: item.token
					}, customHeaders)
					.success(function(){
						data.items.unshift(item);
					});
				}
				
			},

			remove: function(item){

				// Delete Confirm
		        $mdDialog.show(
		            $mdDialog.confirm()
		            .ariaLabel('')
		            .targetEvent(event)
		            .title($Localization.get('DELETE_CONFIRM_TITLE'))
		            .content($Localization.get('DELETE_CONFIRM_CONTENT'))
		            .ok($Localization.get('DELETE_CONFIRM_OK_LABEL'))
		            .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
		        ).then(function() {
		            
		            //-----------------------------
		            var data = $scope.data.vehicles;
					$Api.Delete('/BusinessUnit/Vehicles', item.token , customHeaders)
					.success(function(){
						
						var index = _.indexOf(_.pluck(data.items, 'token'), item.token);
						if(index>=0){
							data.items.splice( index, 1); 
						}

					});
					//-----------------------------
					
		        });

			}
		}
	};

	//------------------------------------------------------------------
	// Event Handlers
	$karmaTable.then(function(component){
		var TDrivers	= 'TDrivers';
		var TVehicles	= 'TVehicles';

		component.$on("cellClick", function(ev, item, xy){

			//Remove Column??
			if(xy.y == 3){
				$scope.data.drivers.remove(item);
			}

		}, TDrivers);

		component.$on("cellClick", function(ev, item, xy){

			//Remove Column??
			if(xy.y == 3){
				$scope.data.vehicles.remove(item);
			}

		}, TVehicles);

	})
	//------------------------------------------------------------------
	

	//------------------------------------------------------------------
	//Get the Configured Drivers in the BusinessUnit 
	$Api.Read('/BusinessUnit/Drivers', {}, customHeaders)
	.success(function(data){
		
		angular.forEach(data.items, function(item){
			$scope.data.drivers.items.push(item);
		});

	});


	//Get the Configured Vehicles in the BusinessUnit 
	$Api.Read('/BusinessUnit/Vehicles', {}, customHeaders)
	.success(function(data){

		$scope.loadCompleted = true;		//Stop Progress Linear Loading!

		angular.forEach(data.items, function(item){
			$scope.data.vehicles.items.push(item);
		});

	});
	//------------------------------------------------------------------


	$scope.back = function(){
		$window.history.back();
	}

	$scope.next= function(){
		$state.go("app.businessUnit-create-4", {
    		businessUnit: businessUnit
    	});
	}

});