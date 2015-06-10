angular.module('app.controllers')

.controller('Gale_AccountPasswordRecovery', function ($scope, 
	$state, 
	$Api,
	$galeLoading,
	$mdToast,
	$stateParams,
	$log,
	$mdDialog,
	$location,
	Identity
) {
	var access_token = $stateParams.token;	
	 
 	//Get Payload
	var payload = access_token.split('.')[1];
	data = decodeURIComponent(escape(atob(payload)));
	data = JSON.parse( data );
	$scope.user = data
	

	$scope.save = function(user){

		if(user.password != user.passwordconfirm){
			$mdToast.show(
				$mdToast.simple()
				.content("Las Contraseñas no coinciden")
				.position("bottom left")
				.theme('exception')
				.hideDelay(4500)
			);

			return;
		}

		$galeLoading.show();
		$Api.Create("/Account/PasswordCreate", {
			password: user.password
		}, 
		{
			'Authorization': 'Bearer {0}'.format([$stateParams.token])
		})
        .success(function(data){

        	$galeLoading.hide();

        	var _alert = $mdDialog.alert()
			.title('Actualización de Contraseña')
			.content('Se ha cambiado su contraseña de manera exitosa!, será enviado a la ventana de identificación de usuario para su ingreso')
			.ariaLabel('')
			.ok('Ir a la pantalla de Identificación')

			$mdDialog.show( _alert ).finally(function() {

			Identity.logOut();

			var path = window.location.href;
			path = path.substring(0, path.indexOf("#"));
			window.location.href = path;


				
				

	        });
            
        }).error(function(data, xhr){

    		$mdToast.show(
				$mdToast.simple()
				.content(data)
				.position("bottom left")
				.theme('exception')
				.hideDelay(4500)
			);

			$galeLoading.hide();

        });


	}
});