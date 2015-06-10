angular.module('app.controllers')

.controller('LayoutController', function (	$rootScope, 
											$scope, 
											$mdSidenav, 
											$state, 
											$timeout, 
											$log,
											Identity,
											$Configuration,
											$LocalStorage,
											$mdDialog,
											moment,
											$mdToast,
											$stateParams,
											$Api){

	var $key = "$_businessUnit";
	var $fullReload = "$_reloaded";

	$scope.config = {
		loading: false,
		profile: Identity.get(),
		menu: [],
		businessUnits: []
	};

	//------------------------------------------------------------------------------------
    // Karma Communication - Change Page Title
	$scope.$on("karma-page:title:changed", function(event, data){
		document.title = data.title;
	});
	//------------------------------------------------------------------------------------
    

	//------------------------------------------------------------------------------------
    // Identity Unauthorized , Check Token Expired
    $rootScope.$on('Identity.Unauthorized', function(ev, data){

    	//Token Expired
        if(data.code == "TOKEN_EXPIRED"){

        	var _alert = $mdDialog.alert()
			.title('Sesión Expirada')
			.content('La sesión actual ha expirado, debe volver a identificarse')
			.ariaLabel('')
			.ok('Ir a la pantalla de Identificación')

			$mdDialog.show( _alert ).finally(function() {
	          Identity.logOut();
	        });

	      	return;
        }

    });
    //------------------------------------------------------------------------------------
    

    //------------------------------------------------------------------------------------
    // Global Exception Handling
    $rootScope.$on("$log.unhandledException", function(event, args){
		
		var handle  = function(content){
			$mdToast.show(
				$mdToast.simple()
				.content(content)
				.position("bottom left")
				.theme('exception')
				.hideDelay(4500)
			);
		};

		//HTTP Error??
		if(args.length > 3 && args[3].url){
			var err 	= args[0];
			var status	= args[1];
			var headers = args[2];
			var config 	= args[3];

			var message = null;

			//Has Default Error Format??
			if(err.error && err.error_description){
				
				message = "{0} {1}: {2}".format([
					moment().format('HH:mm:ss'),
					err.error,
					err.error_description
				]);

			}else{
				
				switch(status){
					case 404:
					case 405:
					case 500:
						message = "{2}: {0} {1}".format([
							config.method, 
							config.url,
							status
						]);
						break;
					case 401:
						//Custom Handled
						break;
				}
				
			}

			if(message){
				handle(message);
			}
		}


		event.preventDefault();
	});
    //------------------------------------------------------------------------------------
    

    //------------------------------------------------------------------------------------
	// Get Access Information From the User
	$Api.invoke('GET','/Account/Access')
	.success(function(data){
		
		//Menu
		$scope.config.menu 			= data.menu;

		if($scope.config.profile.isInRole("ADMIN")){
			
			//Go To Start Page
			$state.go('app.administration-user');

		}else{

			if(data.businessUnits.length == 0){

				var _alert = $mdDialog.alert()
				.title('Sin Unidad de Negocio')
				.content('No hemos encontrado ninguna unidad de negocio que usted tenga asociada')
				.ariaLabel('al')
				.ok('Cerrar Sesión');

		      	$mdDialog.show( _alert ).finally(function() {
		          Identity.logOut();
		        });

		      	return;
			}
		
		
			$scope.config.businessUnits = data.businessUnits;
		
			//--------------------
			// TRY TO GET THE CURRENT BUSINESSUNIT , IF NOT, SET FIRST BUNIT 
			var businessUnit = $LocalStorage.get($key);
			if(businessUnit){
				businessUnit = _.find(data.businessUnits, {
					token: businessUnit
				});
			}

			if(!businessUnit){
				businessUnit	= data.businessUnits[0]
			}

			//Set Selected BusinessUnit
			$LocalStorage.set($key, businessUnit.token);

			$scope.config.businessUnit = businessUnit;
			//--------------------
			
			//Extend Identity
			Identity.property({
				"businessUnit" : businessUnit
			});

			//FIX RELOAD
			if(!$LocalStorage.get($fullReload)){
				//Go To Start Page
				$state.go($Configuration.get("start_url_page"));
			}
			$LocalStorage.remove($fullReload);
		}
	});
	//------------------------------------------------------------------------------------
	

	//------------------------------------------------------------------------------------
	// Layout Actions
	$scope.changeBusinessUnit = function(item){

		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
		.title('Cambio de Unidad de Negocio')
		.content('¿Está seguro de continuar?')
		.ariaLabel('al')
		.ok('Cambiar Unidad')
		.cancel('Cancelar')

		$mdDialog.show(confirm).then(function() {

			//Set Selected BusinessUnit
			$LocalStorage.set($key, $scope.config.businessUnit.token);
			Identity.property("businessUnit", $scope.config.businessUnit);

			$LocalStorage.set($fullReload, 1);
			$state.reload();
			

		});

	};

	$scope.link = function(url){
		$timeout(function(){
			$state.go(url);	
		}, 300);

		$mdSidenav('left').close();
		$mdSidenav('right').close();
	}

	$scope.toggleLeft = function(){
		$mdSidenav('left').toggle();
	};

	$scope.toggleRight = function(){
		$mdSidenav('right').toggle();
	};


	$scope.toggleMenu = function(section){
		section.open = !section.open;
	};

	$scope.logOut = function(ev){

		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
		.title('Se cerrará su sesión actual')
		.content('¿Está seguro de continuar?')
		.ariaLabel('Cerrar sesión')
		.ok('Cerrar Sesión')
		.cancel('Cancelar')
		.targetEvent(ev);

		$mdDialog.show(confirm).then(function() {
			$state.go("logout");
		}, function() {});
	};
	//------------------------------------------------------------------------------------
	

	//------------------------------------------------------------------------------------
	// CONTENT - LOADING (Show Loadig Circular While Loading Child View's)
	$scope.$on('$viewContentLoading', function(event) {
        $scope.config.loading = true;

    });

	// CONTENT - LOADED (Hie Loadig Circular)
    $scope.$on('$viewContentLoaded', function(event) {
    	$timeout(function(){
    		$scope.config.loading = false;	
    	},300);
    });
    //------------------------------------------------------------------------------------
});