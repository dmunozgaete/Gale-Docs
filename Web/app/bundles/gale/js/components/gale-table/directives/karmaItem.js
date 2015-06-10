angular.module('core.components.karma')

.directive('karmaItem', function() {
    return {
        restrict: 'E',
        require: '^karmaTable',
        compile: function (element, attrs, $transclude) {
        },
        controller: function($scope, $element, $attrs, $interpolate, $compile) {
        }
    };
});