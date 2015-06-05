angular.module('app.controllers')

.controller('LoginController', function (	$scope, 
											$log,
											$Configuration, 
											$Localization, 
											$Api, 
											$mdToast, 
											$state,
											$timeout,
											Identity) {

	//Application Information
	$scope.signature = $Configuration.get("application");
	$scope.user = {};
        $scope.ventana = false;
        $scope.restablecer = function (){
            var url = "/CambiarPassword/?email={0}&host={1}".format ([$scope.user.correo, window.location.href]);
            $Api.Read(url, {})
                .success(function(data){

                    if (data.respuesta != 0 ) {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Su solicitud de contraseña fue enviada exitosamente')
                                .position("bottom left")
                                .hideDelay(4500)
                        );

                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Usuario no registrado, contactese con su administrador')
                                .position("bottom left")
                                .theme('exception')
                                .hideDelay(4500)
                        );
                    }




                }).error(function(data, xhr){

                    $mdToast.show(
                        $mdToast.simple()
                            .content(data)
                            .position("bottom left")
                            .theme('exception')
                            .hideDelay(4500)
                    );


                });

        };

	//Set State accord to user
	var changeState = function(new_state){
		var state = {};
		
		switch (new_state) {
			case "invalid":
				state = {
					text: "login.state.invalid.button",
					disabled: true,
					icon: null
				};
				break;
			case "valid":
				state = {
					text: "login.state.valid.button",
					disabled: false,
					icon: {
						name: 'ic_lock_open_24px',
						category: 'action'
					}
				};
				break;
			case "validating":
				state = {
					text: "login.state.validating.button",
					disabled: true,
					icon: null
				};
				break;
		}	
		state.name = new_state;
		$scope.state = state;

	}

	$scope.isValidating= function(){
		return $scope.state.name == 'validating';
	};

	$scope.onChange = function(form){
		changeState(form.$valid ? 'valid' : 'invalid');
	};

	$scope.login = function(credentials){
		changeState('validating');

		//Delay for UX
		$timeout(function(){

			Identity.authenticate(credentials)
			.success(function(data){

				$state.go("app.home");

			})
			.error(function(error){
				var error_message = $Localization.get("ERR.API.UNAVAILABLE");
				if(error && error.error_description){
					error_message = error.error_description;
				}

				$mdToast.show(
					$mdToast.simple()
					.content(error_message)
					.position('bottom left')
					.hideDelay(300000)
				);
				changeState("valid");

			});

		},500);
	};

	changeState('invalid');
});