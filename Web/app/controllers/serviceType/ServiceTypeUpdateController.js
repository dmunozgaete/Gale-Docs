angular.module('app.controllers')

.controller('ServiceTypeUpdateController', function (  
    $scope, 
    $state, 
    $window,
    $Api,
    $log,
    $stateParams,
    $karmaTable,
    $mdDialog,
    $Localization,
    UploadHelper
) {

    var token = $stateParams.token;

    //----------------------------------------------
    //GET USER FROM ODATA
    $Api.Read('/ServiceType', {
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
            $scope.data.imagen = _.first(files).token;
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

        $Api.Update('/ServiceType', token, data)
        .success(function(data){
            $scope.back();
        });

    }

    $scope.delete = function(data){

        // Appending dialog to document.body to cover sidenav in docs app
        $mdDialog.show(
            $mdDialog.confirm()
            .ariaLabel('')
            .targetEvent(event)
            .title($Localization.get('DELETE_CONFIRM_TITLE'))
            .content($Localization.get('DELETE_CONFIRM_CONTENT'))
            .ok($Localization.get('DELETE_CONFIRM_OK_LABEL'))
            .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
        ).then(function() {
            
            $Api.Delete('/ServiceType', token)
            .success(function(data){
                $scope.back();
            });

        });

    }
	//------------------------------------------
	
});