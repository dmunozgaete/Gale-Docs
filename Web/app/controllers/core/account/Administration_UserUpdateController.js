angular.module('app.controllers')

.controller('Administration_UserUpdateController', function (  
    $scope, 
    $state, 
    $window,
    $Api,
    $log,
    $stateParams,
    $karmaTable,
    $mdDialog,
    $Localization,
    UploadHelper,
    $karmaLoading
) {

    var userProfiles = [];
    var token = $stateParams.token;

    //----------------------------------------------
    //GET USER FROM ODATA
    $Api.Read('/User', {
        filters: [
            {
                property: 'token',
                operator: 'eq',
                value: token
            }
        ]
    })
    .success(function(data){
        $scope.data = _.first(data.items);
    });
    //----------------------------------------------
    

    //----------------------------------------------
    // Karma Table
    $karmaTable.then(function(component){

        var endpoint = '/User/Roles/?user={0}'.format([token]);
        component.setup(endpoint);

        //Row Click 
        component.$on("cellClick", function(ev, item, xy){

            if(xy.y == 0){
                //Toggle Selected
                item.selected = !item.selected;

            }

            var index = _.indexOf(userProfiles, item.token);
            if(item.selected){

                //Add to selected profiles
                if(index < 0){
                    userProfiles.push(item.token);
                }

            }else{

                //Remove profiles from the user
                if(index >= 0){
                    userProfiles.splice( index, 1); 
                }

            }

        });

        //On Complete Data
        component.$on("loadComplete", function(data){

            //Add User Profiles
            angular.forEach(data.items, function(profile){
                if(profile.selected){
                    userProfiles.push(profile.token);
                }
            });

        });

    })
    //----------------------------------------------
    

	//https://github.com/danialfarid/ng-file-upload
    $scope.upload = function (files) {
        
        UploadHelper.upload(files)
        .$on("beforeStart", function(files){
            
            $scope.uploadData = {
                <!-- -->
                options: {
                    thickness: 5, 
                    mode: "gauge", 
                    total: 100
                },
                <!-- -->
                progress: [{
                    label: $Localization.get('UPLOADHELPER_UPLOADING_LABEL'), 
                    value: 0, 
                    color: "#FF5722", 
                    suffix: "%"
                }]
                <!-- -->
            };
        })
        .$on("progress", function(progress){
            if($scope.uploadData){
                $scope.uploadData.progress[0].value = progress;  
            }
        })
        .$on("complete", function(files){
            //Change User Photo 
            $scope.data.photo = _.first(files).token;
            $scope.uploadData = null;

        })
        .$on("error", function(data){
            $scope.uploadData = null;
        });
    };

    
	//------------------------------------------
	//VIEW ACTION'S
	$scope.back = function(){
		$window.history.back();
	}

    $scope.save = function(data){
        data.profiles = userProfiles;

        $karmaLoading.show();
        $Api.Update('/User', token, data)
        .success(function(data){

            $karmaLoading.hide();
            $scope.back();

        }).error(karmaLoading.hide);

    }

    $scope.delete = function(data){

        $mdDialog.show(
            $mdDialog.confirm()
            .ariaLabel('')
            .targetEvent(event)
            .title($Localization.get('DELETE_CONFIRM_TITLE'))
            .content($Localization.get('DELETE_CONFIRM_CONTENT'))
            .ok($Localization.get('DELETE_CONFIRM_OK_LABEL'))
            .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
        ).then(function() {
            
            $karmaLoading.show();
            $Api.Delete('/User', token)
            .success(function(data){
                $scope.back();
                $karmaLoading.hide();
            })
            .error($karmaLoading.hide);

        });

    }

    $scope.recovery = function(data){

        $mdDialog.show(
            $mdDialog.confirm()
            .ariaLabel('')
            .targetEvent(event)
            .title("Recuperar Contraseña")
            .content("Se enviará una solicitud de recuperación de contraseña al usuario")
            .ok('Enviar Solicitud')
            .cancel($Localization.get('GLOBAL_CANCEL_LABEL'))
        ).then(function() {
          
            $karmaLoading.show();
            $Api.invoke('GET', '/Account/PasswordRecovery', {
                token: token,
                host: window.location.href
            })
            .success(function(data){

                $karmaLoading.hide();
                $scope.back();

            })
            .error($karmaLoading.hide);

        });

    }
	//------------------------------------------
	
});