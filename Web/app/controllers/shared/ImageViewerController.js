angular.module('app.controllers')

//MODAL'S
.controller('ImageViewerController', function(	
	$scope, 
	$mdDialog,
	$log,
	image,
	$filter
){

	var img = new Image();
    img.onload = function () {
        
        $scope.$apply(function() {
            $scope.image = {
                width: img.width,
                height: img.height,
                url: $filter('restricted')(image)
            }
        });
        
    }
    img.src = $filter('restricted')(image);

    //------------------------------------------------------------------
    // View Action's
    $scope.close = function(){
        $mdDialog.cancel();
    }
    //------------------------------------------------------------------

});