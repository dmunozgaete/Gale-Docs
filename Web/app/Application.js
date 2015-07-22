angular.module('App', [
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
