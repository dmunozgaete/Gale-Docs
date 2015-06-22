(function() {
    /*
        DIRECTIVES: RANGE
     */
    angular.module('app.demos')
        .controller("RangeDemoController", function($scope) {

            $scope.submit = function(form){
                console.log("submit!")
            };
        });
})();
