angular.module('app.controllers')

.directive('polygonList', function() {
    return {
        restrict: 'E',
        scope: {
            details:   '=',    //Details
        },
        templateUrl: 'views/businessUnit/step-5/polygon-list.html',
        controller: function($scope, $element, $log, $mdSidenav, $mdDialog){
            
            var lastPolygon = null;

            $scope.filter = function(query){
                var data    = $scope.details.data;
                var query   = query.toLowerCase();

                $scope.filteredPolygons = _.filter(data, function(s){
                    return s.nombre.toLowerCase().indexOf(query) >= 0;
                });
            }

            $scope.navigate = function(polygon){

                if(lastPolygon){
                    lastPolygon.figure.unMark();
                }

                polygon.navigate();
                polygon.figure.mark();

                lastPolygon = polygon;
            }

            $scope.$watch("details", function(value){
                if(value){
                    var data    = $scope.details.data;
                    $scope.filteredPolygons = data;
                }
            });
        },

        link: function (scope, element, attrs, ctrl) {

        }
    };
})