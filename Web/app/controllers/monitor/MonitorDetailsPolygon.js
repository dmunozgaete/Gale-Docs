angular.module('app.controllers')

.directive('monitorDetailsPolygon', function() {
    return {
        restrict: 'E',
        scope: {
            polygon:   '=',    //Polygon Data
        },
        templateUrl: 'views/monitor/details/monitor-details-polygon.html',
        controller: function($scope, $element, $log, $mdSidenav, $mdDialog){

        },

        link: function (scope, element, attrs, ctrl) {

        }
    };
})