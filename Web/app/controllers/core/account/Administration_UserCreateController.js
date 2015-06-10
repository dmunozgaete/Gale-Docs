angular.module('app.controllers')

.controller('Administration_UserCreateController', function (  
    $scope, 
    $state, 
    $window,
    $Api,
    $log,
    $Configuration,
    $karmaTable,
    UploadHelper,
    $karmaLoading
) {

	
    var userProfiles = [];
    $scope.data = {
        language: $Configuration.get("application")["language"]
    };
   
    //----------------------------------------------
    // Karma Table
    $karmaTable.then(function(component){

        component.setup('/Role');

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
        data.host = window.location.href;

        $karmaLoading.show();

        $Api.Create('/User', data)
        .success(function(data){

            $karmaLoading.hide();
            $scope.back();
            
        }).error($karmaLoading.hide);

    }
    //------------------------------------------
	
});