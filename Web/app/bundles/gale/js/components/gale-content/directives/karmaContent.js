angular.module('core.components.karma')

.directive('karmaContent', function() {
    return {
        restrict: 'E',
        scope: {
            onKeydown: '='
        },
        controller: function($scope, $element, $attrs) {

            var onKeyDown = $scope.onKeydown;
            if(onKeyDown){
                $element.bind('keydown', function( event ) {
                   
                   onKeyDown(event, event.keyCode);

                });
            }
        },

        link: function (scope, element, attrs) {
            
        }
    };
});