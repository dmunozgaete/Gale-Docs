//#Manifiest
angular.manifiest('app', [
	'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'app.services.api',
    'app.demos'
]);;angular.module('mocks', ['App', 'ngMockE2E'])
.run(function($httpBackend, CONFIGURATION, $log) {
  
    var endpoint  = CONFIGURATION.endpoint;
    var Api = null;
    var build = function(Api){
        var exp = new RegExp(endpoint + Api ); 
        return exp;
    };
    
    //-------------------------------------------------------------
    //COMPONENTS: GALE-TABLE EXAMPLE 2
    Api = "/Mocks/User/";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
          "offset": 0,
          "limit": 10,
          "total": 10,
          "elapsedTime": "00:00:00.3685175",
          "items": [
            {
              "token": "f8302e8c-ea34-4daa-a2f1-9ec727d7a4e9",
              "nombre": "SPENCE",
              "cliente": "SPENCE",
              "imagen": "",
              "creacion": "2015-06-03T12:47:40",
              "latitud": "25",
              "longitud": "25",
              "zoom": "14"
            },
            {
              "token": "65b7a72b-b508-4594-9c89-2efdae9e7e91",
              "nombre": "PROYECTO-MEL",
              "cliente": "MINERA ESCONDIDA",
              "imagen": "",
              "creacion": "2015-06-03T12:47:40",
              "latitud": "-33,4227752685547",
              "longitud": "-70,6111831665039",
              "zoom": "12"
            }
          ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------

    //REQUIRED EXCEPTION FOR OTHER EXCEPTIONS
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();

});;(function() {
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
        .controller("GaleTableDemoController", function($scope) {
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
        })
        /*
            COMPONENTS: GALE-TABLE EXAMPLE 2
         */
        .controller("GaleTableServiceDemoController", function($scope, $galeTable, $timeout) {
            //----------------------------------------------
            // Gale Table
            $galeTable.then(function(component) {
                $timeout(function(){
                    var tbl_demo1 = 'tbl_demo1';
                    var email = "dmunoz@valentys.com";
                    var endpoint = '/Mocks/User/{0}'.format([email]);
                    component.setup(endpoint, null, tbl_demo1);
                    //Row Click 
                    component.$on("rowClick", function(ev, item) {
                        console.log(item);
                    }, tbl_demo1);
                    //On Complete Data
                    component.$on("loadComplete", function(data) {
                        //Add User Profiles
                        angular.forEach(data.items, function(profile) {
                            profile.icon = "bundles/app/css/images/logo.png";
                        });
                    }, tbl_demo1);
                
                },1000)
            });
            //----------------------------------------------
        });
})();
;angular.module('app.controllers')
    .controller('2ColumnsController', function(
        $rootScope,
        $scope,
        $mdSidenav,
        $state,
        $log,
        $Configuration,
        $mdDialog,
        $mdToast,
        $stateParams,
        $timeout,
        $galeLoading
    ) {
        //------------------------------------------------------------------------------------
        // Model
        $scope.config = {
            application: $Configuration.get("application"),
            selected_menu: "Gale  > Introducción",
            menu: $Configuration.get("menu_items")
        };
        //------------------------------------------------------------------------------------
        // Gale Communication - Change Page Title
        document.title = $scope.config.application.name;
        $scope.$on("gale-page:title:changed", function(event, data) {
            document.title = data.title;
        });
        
        //------------------------------------------------------------------------------------
        // Layout Actions
        $scope.link = function(url) {
            $timeout(function() {
                $state.go(url);
            }, 300);
            $mdSidenav('left').close();
        }
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleMenu = function(section) {
            section.open = !section.open;
        };
        $scope.navigateTo = function(section, item) {
            $scope.config.selected_menu = "{0} > {1}".format([
                section.label,
                item
            ]);
            $scope.navigate("app.{0}-{1}".format([
                section.name,
                item
            ]), item);
        };
        $scope.navigate = function(state, item) {
            
            document.title = $scope.config.application.name + " - " + item;

            $scope.config.selected_menu = item;
            $state.go(state);
        };
        //------------------------------------------------------------------------------------
        // CONTENT - LOADING (Show Loadig Circular While Loading Child View's)
        $scope.$on('$viewContentLoading', function(event) {
            $scope.config.loading = true;
        });
        // CONTENT - LOADED (Hie Loadig Circular)
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $scope.config.loading = false;
            }, 300);
        });
        //------------------------------------------------------------------------------------
    });
;angular.module('app.controllers')

.controller('ExceptionController', function($window, $scope) {

    $scope.back = function() {
        $window.history.back();
    };

});;angular.module('App', [
        'ui.router' //NG ROUTE
        , 'ngMaterial' //MATERIAL DESIGN DIRECTIVES
        , 'gale' //VALENTYS SDK LIBRARY
        , 'app' //CUSTOM PROJECT LIBRARY
        , 'hljs' //HIGHLIGHT
        , 'mocks'   //DEMO MOCK'S
    ])
    .run(function($location, $Configuration, $log) {
        var application = $Configuration.get("application");
        $log.info("application start... ;)!", {
            env: application.environment,
            version: application.version
        });
        $location.url(application.home);
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange')
            .warnPalette('red');
    })
    //API EndPoint Configuration
    .config(function($ApiProvider, CONFIGURATION) {
        $ApiProvider.setEndpoint(CONFIGURATION.endpoint);
    })
    
    .config(function($stateProvider, $urlRouterProvider, CONFIGURATION) {
        $stateProvider
            .state('app', {
                url: "/demo",
                abstract: true,
                // ---------------------------------------------
                // TWO COLUMNS TEMPLATE
                // ---------------------------------------------
                templateUrl: "views/layouts/2-columns.html",
                controller: "2ColumnsController"
            })
            .state('exception', {
                url: "/exception",
                abstract: true,
                // ---------------------------------------------
                // EXCEPTION TEMPLATE
                // ---------------------------------------------
                templateUrl: "views/layouts/exception.html",
                controller: "ExceptionController"
            })

            // ---------------------------------------------
            // GENERALES
            // ---------------------------------------------
            .state('exception.404', {
                url: '/404',
                views: {
                    content: {
                        templateUrl: 'views/error/404.html',
                    }
                }
            })
            .state('app.home-introduction', {
                url: '/home/introduction',
                views: {
                    content: {
                        templateUrl: 'views/home/index.html',
                    }
                }
            })
            .state('app.home-installation', {
                url: '/home/installation',
                views: {
                    content: {
                        templateUrl: 'views/home/installation.html',
                    }
                }
            })
            // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/exception/404");
        // ---------------------------------------------
        // GALE: Menu State's
        // ---------------------------------------------
        angular.forEach(CONFIGURATION.menu_items, function(category) {
            angular.forEach(category.items, function(service) {
                var arr = [
                    category.name.toLowerCase(),
                    service
                ]
                $stateProvider.state('app.{0}-{1}'.format(arr), {
                    url: '/{0}/{1}'.format(arr),
                    views: {
                        content: {
                            templateUrl: 'views/{0}/{1}.html'.format(arr),
                        }
                    }
                });
            });
        });
    });
;angular.module("config", [])
    .constant("GLOBAL_CONFIGURATION", {

        //Application data
        application: {
            version: "2.0.1",
            author: "David Antonio Muñoz Gaete",
            environment: "development",
            language: "es",
            name: "Gale Documentation",
            home: "/demo/home/introduction"
        },

        //CLEAN STEP WHEN A NEW VERSION IS UPDATE!
        on_build_new_version: function(new_version, old_version) {},

        //SideNav Menu
        menu_items: [{
            "label": "Servicios",
            "name": "services",
            "open": false,
            "items": [
                "$Configuration",
                "$Localization",
                "$Api",
                "$LocalStorage",
                "$Timer",
                "KQLBuilder",
                "Identity"
            ]
        }, {
            "label": "Componentes",
            "name": "components",
            "open": false,
            "items": [
                "gale-finder",
                "gale-loading",
                "gale-page",
                "gale-table"
            ]
        }, {
            "label": "Filtros",
            "name": "filters",
            "open": false,
            "items": [
                "capitalize",
                "localize",
                "template"
            ]
        }, {
            "label": "Directivas",
            "name": "directives",
            "open": false,
            "items": [
                "ngrange",
                "ngrut",
                "selectTextOnClick",
                "toNumbeOnBlur"
            ]
        }]
    });
