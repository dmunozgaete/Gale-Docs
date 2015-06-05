angular.module('app.controllers')

.directive('monitorDetailsPoint', function() {
    return {
        restrict: 'E',
        scope: {
            point:   '=',    //Point Data
        },
        templateUrl: 'views/monitor/details/monitor-details-point.html',
        controller: function($scope, $element, $log, $mdSidenav, $mdDialog){

             $scope.showImage = function(image){
                $mdDialog.show({
                    controller: 'ImageViewerController',
                    templateUrl: 'views/shared/image-viewer.html',
                    escapeToClose: true,
                    clickOutsideToClose: true,
                    locals: {
                        image: image
                    }
                });

            }

        },

        link: function (scope, element, attrs, ctrl) {

        }
    };
})