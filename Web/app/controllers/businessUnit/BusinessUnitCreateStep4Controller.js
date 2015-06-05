angular.module('app.controllers')

.controller('BusinessUnitCreateStep4Controller', function (	
	$scope, 
	$state,
	$stateParams,
	$karmaTable,
	$Configuration,
	$Localization,
	$mdDialog,
	$Api,
	$window
) {

	$scope.data = {
		items: []
	};

	//------------------------------------------------------------------
	// (Override the businessUnit header)
	var businessUnit 		= $stateParams.businessUnit;
	var header 				= $Configuration.get("customHeaders")["businessUnit"];
	var customHeaders 		= {};
	customHeaders[header] 	= businessUnit;
	//------------------------------------------------------------------
	
	//------------------------------------------------------------------
	//Get the Configured Service Type in the BusinessUnit 
	$Api.Read('/BusinessUnit/Services', {}, customHeaders)
	.success(function(data){
		
		angular.forEach(data.items, function(item){
			$scope.data.items.push(item);
		});

		$scope.loadCompleted = true;
	});
	//------------------------------------------------------------------

	//------------------------------------------------------------------
	// Event Handlers
	$karmaTable.then(function(component){
		var TServices = 'TServices';

		component.$on('cellClick', function(ev, item, xy){

			if(xy.y==8){

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
		            var data = $scope.data;
					var index = _.indexOf(_.pluck(data.items, 'token'), item.token);
					if(index>=0){
						data.items.splice( index, 1); 
					}
					//-----------------------------
					
		        });

			}

		});
	});
	//------------------------------------------------------------------
	
	//------------------------------------------------------------------
	// View Action's
	$scope.add = function(){
		$mdDialog.show({
			controller: 'BusinessUnitCreateStep4ModalController',
			templateUrl: 'modal.tmpl',
			clickOutsideToClose: false,
			targetEvent: event,
			locals: {
				confguredServicesTypes: $scope.data.items
			}
		}).then(function(data){

			angular.forEach(data.types, function(type){
				type["identificador"]	= data.contract.identificador;
				type["contrato"]		= data.contract.token;
				$scope.data.items.push(type);
			});

		})
	}

	$scope.back = function(){
		$window.history.back();
	}


	$scope.save = function(){
		var services = angular.copy($scope.data.items);	//Remove angular stuff like $$hashKey

		$Api.Create('/BusinessUnit/Services', services, customHeaders)
		.success(function(){
			
			$state.go("app.businessUnit-create-5", {
	    		businessUnit: $stateParams.businessUnit
	    	});

		});
	}
	//------------------------------------------------------------------

})


//MODAL CONTROLLER
.controller('BusinessUnitCreateStep4ModalController', function(	
	$scope, 
	$log, 
	$mdDialog, 
	$Api,
	$mdToast,
	$karmaTable,
	$q,
	confguredServicesTypes
){

	$scope.data = {

		serviceTypes: [],

		contract: {
			items: [],
			filter: "",
			item: null,
			search: function(query){
				var deferred = $q.defer();

				$Api.Read('/Sgs/Contracts', {
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
			add: function(item){},
			change: function(item){}
		}
	}
	//------------------------------------------------------------------
	// Event Handlers
	$karmaTable.then(function(component){
		var TTypes = 'TTypes';
		var items = [];

		component.setup('/ServiceType', {} , TTypes);
		
		component.$on('loadComplete', function(data){

			//Remove all service types , which already configured
			angular.forEach(confguredServicesTypes, function(item){
				var _tokens = _.pluck(data.items, 'token');
				var index = _.indexOf(_tokens, item.token);
				if(index>=0){
					data.items.splice(index,1);
				}
			});

			$scope.loadCompleted =	true;
			items = data.items;

		}, TTypes);

		component.$on('rowClick', function(ev, item){

			item.selected = !item.selected;

			//set all Selected's
			var selecteds = [];
			angular.forEach(items, function(item){
				if(item.selected){
					selecteds.push(item);
				}
			});

			$scope.data.serviceTypes = selecteds;

		}, TTypes);

	})
	//------------------------------------------------------------------
	
	//------------------------------------------------------------------
	// View Action's
	$scope.save = function(){
		$mdDialog.hide({
			types: $scope.data.serviceTypes,
			contract: $scope.data.contract.item
		});
	}

	$scope.back = function(){
		//TODO: Fix , press enter on the autcompelte, and this function is called :S
		$mdDialog.cancel();
	}
	//------------------------------------------------------------------

});