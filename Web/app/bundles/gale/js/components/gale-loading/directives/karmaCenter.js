angular.module('core.components.karma')

.directive('karmaCenter', function() {
    return {
        restrict: 'E',
        require: '^karmaLoading',
        scope: {
        },
        controller: function($scope, $element, $log ){
           
        },

        link: function (scope, element, attrs, ctrl) {
            element.attr("layout", "row");
            element.attr("layout-align", "start center");
        }
    };
});
