angular.module('app.controllers')

.controller('ErrorController', function($window, $scope) {

    $scope.error = {
        code: "??"
    };

    $scope.back = function() {
        $window.history.back();
    }

    $scope.$on("karma-page:title:changed", function(event, data) {
        $scope.error.code = data.title;
    })

});