angular.module('gale.components')

.directive('galeLoading', function() {
    return {
        restrict: 'E',
        scope: {
            defaultMessage:     '@'     //Default Message
        },
        templateUrl: 'bundles/core/js/components/gale-loading/templates/template.html',
        controller: function($scope, $element, $log , $karmaLoading){
            var self        = {};

            //-------------------------------------------------
            //--[ GLOBAL FUNCTION'S
            self.hide = function(){
                $element.removeClass("show");
            }

            self.show = function(message){
                $element.addClass("show");
                var elm = $element.find("gale-text");
                if(message){
                    elm.html(message);
                }else{
                    elm.html($scope.defaultMessage);
                }
            }
            //-------------------------------------------------
           
            //-------------------------------------------------
            //Register for Service Interaction
            $karmaLoading.$$register(self);  

            //Garbage Collector Destroy
            $scope.$on('$destroy', function() {
                $karmaLoading.$$unregister();      //UnRegister for Service Interaction
            });
            //-------------------------------------------------
        },

        link: function (scope, element, attrs, ctrl) {
            
            element.attr("layout", "row");
            element.attr("layout-align", "center center");


        }
    };
});
