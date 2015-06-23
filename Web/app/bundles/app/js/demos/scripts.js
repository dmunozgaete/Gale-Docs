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
        })
        /*
            COMPONENTS: GALE-FINDER
         */
        .controller("GaleFinderDemoController", function($scope, $galeFinder, $q) {
            $scope.onSearch = function(query) {
                var defer = $q.defer();
                var callToServer = function() {
                    setTimeout(function() {
                        var items = [];
                        //Dummy Iterator
                        for (var dummy = 0; dummy < 6; dummy++) {
                            items.push({
                                name: query + " " + (dummy + 1),
                                type: "Ejemplo",
                                icon: "bundles/app/css/images/logo.png"
                            })
                        }
                        defer.resolve(items);
                    }, 250);
                }
                callToServer();
                return defer.promise;
            };
            $scope.onSelect = function(item) {
                $scope.selected = item;
                return true;
            }
            $scope.show = function() {
                $galeFinder.show();
            }
        })
        /*
            COMPONENTS: GALE-LOADING
         */
        .controller("GaleLoadingDemoController", function($scope, $galeLoading, $q) {
            var delay = 2000;
            $scope.show = function() {
                setTimeout($galeLoading.hide, delay);
                $galeLoading.show();
            }
            $scope.showWithMessage = function() {
                setTimeout($galeLoading.hide, delay);
                $galeLoading.show("Este es un mensaje de Ejemplo!");
            }
        })
        /*
            COMPONENTS: GALE-PAGE
         */
        .controller("GalePageDemoController", function($scope) {
            $scope.title = "Wow!!!";
            $scope.onKeyDown = function(event, keyCode) {
                $scope.pressedChar = String.fromCharCode(event.keyCode);
                $scope.pressedKey = event;
                $scope.$apply();
            }
        })
        /*
            COMPONENTS: GALE-TABLE
         */
        .controller("GaleTableDemoController", function($scope, $galeTable) {
            $scope.dataSource1 = [{
                icon: "Dmunoz1-160x160.jpg",
                name: "David Gaete",
                email: "dmunoz@valentys.com"
            }, {
                icon: "Velasquez-160x160.jpg",
                name: "Danilo Velasquez",
                email: "dvelasquez@valentys.com"
            }, {
                icon: "MRUIZ-160x160.jpg",
                name: "Marco Ruiz",
                email: "mruiz@valentys.com"
            }, {
                icon: "Rheredia-160x160.png",
                name: "Rafael Heredia",
                email: "rheredia@valentys.com"
            }, {
                icon: "ASHAE-160x160.jpg",
                name: "Alejandro Shae",
                email: "ashae@valentys.com"
            }];
        });
})();
