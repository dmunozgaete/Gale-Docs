angular.module('core.components.karma')

.directive('karmaPad', function() {
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