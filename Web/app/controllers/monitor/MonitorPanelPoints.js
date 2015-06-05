angular.module('app.controllers')

.directive('monitorPanelPoints', function() {
    return {
        restrict: 'E',
        scope: {
            layers:   '=',    //Layers Data
            map:      '='     //Google Map Reference
        },
        templateUrl: 'views/monitor/panels/monitor-panel-points.html',
        controller: function($scope, $element, $log, $mdSidenav){

            var programming = $scope.layers['programming'].items;
            var types       = $scope.layers['services'].items;
            //------------------------------------------------
            //--[ ITEMS
            var points = _.groupBy(programming, function(point){
                return point.tipo.token;
            });
            //------------------------------------------------

            //------------------------------------------------
            //EVENT HANDLER'S
            $scope.$on("OnRealtimeDataReceived", function(ev, realtimeData){
                

                var realtimePoints = $scope.layers['points'].items;

                angular.forEach(types, function(type){

                    //----------------------------------------------------------------
                    //--[ LAYER ITEMS
                    var programmed =    points[type.token]||[];
                    var total      =    _.filter(realtimePoints, function(point){
                        return  point.tipo.token == type.token;
                    });
                    var realized   =    _.filter(total, function(point){
                        return  point.estado == "PRREA" ||
                                point.estado == "PRFAL";
                    });
                    var additional =    _.filter(total, function(point){
                        return  point.estado == "SPREA" ||
                                point.estado == "ADREA" ||
                                point.estado == "SPFAL" ||
                                point.estado == "ADFAL";
                    });
                    var polygons =    _.uniq(_.pluck(programmed, 'poligono'), function(polygon) { 
                        return polygon.token;
                    });
                    //----------------------------------------------------------------

                    type.points = total;
                    type.counters = {
                        programmed: programmed.length,
                        total:      total.length,
                        realized:   realized.length,
                        additional: additional.length,
                        polygons:   polygons.length
                    };

                });
                //------------------------------------------------

                //------------------------------------------------
                //MODEL
                $scope.data = {
                    types: types,
                    counters: {
                        total:  realtimePoints.length
                    }
                };
                //------------------------------------------------
                
            });
            //------------------------------------------------
        },

        link: function (scope, element, attrs, ctrl) {
        }
    };
});
