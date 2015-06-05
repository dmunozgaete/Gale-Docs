angular.module('app.controllers')

.directive('monitorPanelDrivers', function() {
    return {
        restrict: 'E',
        scope: {
            layers:   '=',    //Layers Data
        },
        templateUrl: 'views/monitor/panels/monitor-panel-drivers.html',
        controller: function($scope, $element){

            var layers      = $scope.layers;
            var drivers     = $scope.layers["drivers"].items;
            var programming = layers['programming'].items;

            //------------------------------------------------
            //MODEL
            $scope.data = {
                drivers: drivers
            };
            //------------------------------------------------
            
            //------------------------------------------------
            //EVENT HANDLER'S
            $scope.$on("OnRealtimeDataReceived", function(ev, realtimeData){
 
                //----------------------------------------------------------------
                //--[ LAYER ITEMS
                var realized_points = _.filter(realtimeData.points.items, function(point){
                    return  point.estado == "PRREA" ||
                            point.estado == "SPREA" ||
                            point.estado == "ADREA" ||
                            point.estado == "PRFAL" ||
                            point.estado == "SPFAL" ||
                            point.estado == "ADFAL";
                });
                //----------------------------------------------------------------
                
                _.each(drivers, function(driver){

                    driver.counters = {
                        programmed: _.filter(programming, function(item){
                            return item.conductor.token == driver.token;
                        }).length,
                        realized:   _.filter(realized_points, function(item){
                            return item.conductor.token == driver.token;
                        }).length
                    }

                });
            });
            //------------------------------------------------


        },

        link: function (scope, element, attrs, ctrl) {
        }
    };
});
