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
            });

            // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/exception/404");

        // ---------------------------------------------
        // GALE: Menu State's
        // ---------------------------------------------
        (function iterate(items, ref){
            angular.forEach(items, function(item) {
                
                var data = angular.copy(ref);
                data.paths.push(item.name);
                data.labels.push(item.label||item.name);

                if(!item.items){
                    var path = data.paths.join("-");
                    var url = "/" + data.paths.join("/");

                    //attach _$variable to menu item
                    item.$path = path;
                    item.$title = data.labels.join(" > ");

                    //Add Dynamic State
                    $stateProvider.state('app.{0}'.format([path]), {
                        url: url,
                        views: {
                            content: {
                                templateUrl: 'views{0}.html'.format([url]),
                            }
                        }
                    });

                    return;
                }

                iterate(item.items, data);
            });  
        })(
            CONFIGURATION.menu,
            { paths: [], labels: [] }
        );
    });
