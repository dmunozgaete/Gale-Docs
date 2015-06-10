angular.module('gale.directives')

.directive('toNumberOnBlur', function($filter,$locale) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            elm.bind('blur', function() {
                var filter = "number";
        		ctrl.$viewValue = $filter(filter)(ctrl.$modelValue);
        		ctrl.$render();
            });

            elm.bind('focus', function() {
        		ctrl.$viewValue = ctrl.$modelValue;
        		ctrl.$render();
            });
        }
    };  
});