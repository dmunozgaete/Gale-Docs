angular.module('app.controllers')

.controller('BusinessUnitCreateStep6Controller', function (	$scope, 
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
		users: {
			items: [],
			filter: "",
			item: null,
			change: function(){},
			search: function(query){
				var deferred = $q.defer();

				$Api.Read('/User', {
					filters: [
						{
							property: 'name',
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
				var data = $scope.data.users;
				var find = _.find(data.items, {token: item.token});

				data.filter = "";
				data.item = null;

				if(!find){
					$Api.Create('/BusinessUnit/Users', {
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
		            var data = $scope.data.users;
					$Api.Delete('/BusinessUnit/Users', item.token , customHeaders)
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

		component.$on("cellClick", function(ev, item, xy){

			//Remove Column??
			if(xy.y == 3){
				$scope.data.users.remove(item);
			}

		});

	})
	//------------------------------------------------------------------
	

	//------------------------------------------------------------------
	//Get the Configured Users in the BusinessUnit 
	$Api.Read('/BusinessUnit/Users', {}, customHeaders)
	.success(function(data){
		
		$scope.loadCompleted = true;		//Stop Progress Linear Loading!

		angular.forEach(data.items, function(item){
			$scope.data.users.items.push(item);
		});

	});
	//------------------------------------------------------------------


	$scope.back = function(){
		$window.history.back();
	}

});