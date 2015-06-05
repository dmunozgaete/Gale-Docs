angular.module('app.controllers')

.directive('programmingScroll', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: function($scope, $element, $log, $mdSidenav, $mdDialog){
           
        },

        link: function (scope, element, attrs, ctrl) {
            var $ = function(elm){
                return angular.element(elm);
            }
            var polygons = $($(element.children()[0]).children()[1]);
            var calendar = $($(element.children()[1]).children()[1]);

            polygons.bind("scroll", function(ev){
                calendar[0].scrollTop = this.scrollTop;
            });

            calendar.bind("scroll", function(ev){
                polygons[0].scrollTop = this.scrollTop;
            });
        }
    };
})