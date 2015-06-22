(function() {
    /*
        DIRECTIVES: RANGE
     */
    angular.module('app.demos', ['gale', 'ngMaterial'])
        .controller("RangeDemoController", function($scope) {
            $scope.submit = function(form) {
                console.log("submit!")
            };
        })
        /*
            DIRECTIVES: RUT
         */
        .controller("RutDemoController", function($scope) {
            $scope.submit = function(form) {
                console.log("submit!")
            };
        })
        /*
            DIRECTIVES: SELECT TEXT ON CLICK
         */
        .controller("SelectTextOnClickDemoController", function($scope) {
            $scope.welcome = "Hola Mundo!!";
        })
        /*
            DIRECTIVES: TO NUMBER ON BLUR
         */
        .controller("toNumberOnBlurDemoController", function($scope) {
            $scope.amount = 999999;
        });
})();
