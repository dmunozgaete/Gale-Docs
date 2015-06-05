angular.module('app.controllers')

.controller('ServiceTypeCreateController', function (  
    $scope, 
    $state, 
    $window,
    $Api,
    $log,
    UploadHelper
) {

    $scope.data = {};

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
                    label: 'Subiendo...', 
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

        $Api.Create('/ServiceType', data)
        .success(function(data){
            $scope.back();
        });

    }
    //------------------------------------------
	
});