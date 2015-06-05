angular.module('app.controllers')

.directive('monitorDetailsDriver', function() {
    return {
        restrict: 'E',
        scope: {
            driver:   '=',    //Driver Data
        },
        templateUrl: 'views/monitor/details/monitor-details-driver.html',
        controller: function($scope, $element, $log, $mdSidenav, $mdDialog){

            var _last_coords = null;
            $scope.speed = 0;
            $scope.$watch('driver', function(value) {
                if (value) {
                    //RESET COORDS
                    _last_coords = null;
                }
            });

            // radians = degrees * PI / 180
            var toRadians = function(value){
                return value * (Math.PI / 180);
            }

             //Watch for Changes
            $scope.$watch('driver.coordenadas', function(value) {
                if (value) {
                    if(_last_coords){

                        // Coordinates
                        var lat1 = _last_coords.latitud;
                        var lon1 = _last_coords.longitud;
                        var lat2 = value.latitud;
                        var lon2 = value.longitud;

                        // Calculate Speed
                        var R = 6371; // km
                        var dLat =  toRadians(lat2-lat1);
                        var dLon =  toRadians(lon2-lon1);
                        var rlat1 = toRadians(lat1);
                        var rlat2 = toRadians(lat2);

                        // Formula 
                        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rlat1) * Math.cos(rlat2); 
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                        var d = R * c;

                        $scope.speed = d;   //SPEED IN KM/HR

                    }
                    _last_coords = value;   //set las coords
                }
            });
        },

        link: function (scope, element, attrs, ctrl) {

        }
    };
})