angular.module('App', [
        'ui.router' //NG ROUTE
        , 'ngMaterial' //MATERIAL DESIGN DIRECTIVES
        , 'gale' //VALENTYS SDK LIBRARY
        , 'app' //CUSTOM PROJECT LIBRARY
        , 'hljs' //HIGHLIGHT
    ])
    .run(function($rootScope, $state, $location, $log, Identity, $templateCache, $Api, $Configuration) {
        $log.debug("application is running!!");
        //$location.url("/demo/home/introduction");
        $location.url("/demo/components/gale-table");
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange')
            .warnPalette('red');
    })
    .config(['$mdIconProvider', function($mdIconProvider) {
        var bundle_src = "bundles/md-iconset/icons/{0}-icons.svg";
        var sets = [
            "action",
            "alert",
            "av",
            "communication",
            "content",
            "device",
            "editor",
            "file",
            "hardware",
            "icons",
            "image",
            "maps",
            "navigation",
            "notification",
            "social",
            "toggle"
        ]
        angular.forEach(sets, function(toolset) {
            $mdIconProvider
                .iconSet(
                    toolset,
                    bundle_src.format([
                        toolset
                    ]),
                    24);
        });
    }])
    //API EndPoint Configuration
    .config(function($ApiProvider, ENVIRONMENT_CONFIGURATION) {
        $ApiProvider.setEndpoint(ENVIRONMENT_CONFIGURATION.endpoint)
    })
    //DECORATE $LOG
    .config(function($provide) {
        //------------------------------------------------------------------------
        //DECORATE ERROR
        $provide.decorator('$log', function($delegate, $injector) {
            // Save the original $log.debug()
            var errorFn = $delegate.error;
            $delegate.error = function() {
                //BroadCast UnhandledException
                var rScope = $injector.get('$rootScope');
                if (rScope) {
                    rScope.$broadcast('$log.unhandledException', arguments);
                }
                var env = $injector.get('ENVIRONMENT_CONFIGURATION');
                if (env.debugging) {
                    errorFn.apply(null, arguments)
                }
            };
            return $delegate;
        });
        //------------------------------------------------------------------------
        //------------------------------------------------------------------------
        $provide.decorator('mdSidenavDirective', function($delegate, $controller, $rootScope) {
            var directive = $delegate[0];
            var compile = directive.compile;
            directive.compile = function(tElement, tAttrs) {
                var link = compile.apply(this, arguments);
                return function(scope, elem, attrs) {
                    scope.$watch('isOpen', function(val) {
                        if (!angular.isUndefined(val)) {
                            $rootScope.$broadcast('$mdSideNavChange',
                                tAttrs.mdComponentId,
                                scope.isOpen
                            );
                        }
                    });
                    link.apply(this, arguments);
                };
            };
            return $delegate;
        });
        //------------------------------------------------------------------------
    })
    .config(function($stateProvider, $urlRouterProvider, GLOBAL_CONFIGURATION) {
        $stateProvider
            .state('app', {
                url: "/demo",
                abstract: true,
                templateUrl: "views/shared/2-columns.html",
                controller: "2ColumnsController"
            })
            // ---------------------------------------------
            // ERRORES
            // ---------------------------------------------
            .state('error', {
                url: "/error",
                abstract: true,
                templateUrl: "views/shared/error.html",
                controller: "ErrorController"
            })
            .state('error.404', {
                url: '/404',
                views: {
                    content: {
                        templateUrl: 'views/error/404.html',
                    }
                }
            })
            // ---------------------------------------------
            // GENERALES
            // ---------------------------------------------
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
        $urlRouterProvider.otherwise("/error/404");
        // ---------------------------------------------
        // GALE: Menu State's
        // ---------------------------------------------
        angular.forEach(GLOBAL_CONFIGURATION.menu_items, function(category) {
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
