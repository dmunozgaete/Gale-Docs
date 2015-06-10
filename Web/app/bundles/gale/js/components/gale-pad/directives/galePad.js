angular.module('gale.components')

.directive('galePad', function() {
    return {
        restrict: 'E',
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs) {
            element.addClass("bottom");
            element.addClass("alignRight");
        }
    };
});