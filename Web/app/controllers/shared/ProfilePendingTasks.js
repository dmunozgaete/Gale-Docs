angular.module('app.directives')

.directive('profilePendingTasks', function() {
    return {
        restrict: 'E',
        scope: {
            profile:   '=',    //Point Data
        },
        templateUrl: 'views/shared/profile-pending-tasks.html',
        controller: function($scope, $element, $log, $mdSidenav, Identity){
            
                        

        },

        link: function (scope, element, attrs, ctrl) {

        }
    };
})