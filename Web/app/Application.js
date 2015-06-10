angular.module('App', [
    'ui.router' //NG ROUTE
    , 'ngMaterial' //MATERIAL DESIGN DIRECTIVES
    , 'gale' //VALENTYS SDK LIBRARY
    , 'app' //CUSTOM PROJECT LIBRARY,
    , 'angularMoment' //ANGULAR MOMENT
    , 'angularFileUpload' //Angular File Upload
])

.run(function($rootScope, $state, $location, $log, Identity, $templateCache, $Api, $Configuration) {
    $log.debug("application is running!!");

    //RECOVERY AND CREATING PROCESS
    if ($location.path().indexOf("/account/password/") >= 0) {
        return;
    }

    //RESTRICT ACCESS TO LOGIN USER'S ONLY
    $rootScope.$on('$stateChangeStart', function(event, toState, current) {


        if (toState.name !== "login" && !Identity.isAuthenticated()) {
            $state.go('login');
            event.preventDefault();
        }

        if (typeof(current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }

    });

    //REDIRECT TO DASHBOARD WHEN IS AUTHENTICATED
    if (Identity.isAuthenticated()) {
        $location.path('/app/home');

    } else {
        $location.path('/login');
    }

    //CALL WHEN IDENTITY HAS LOGOUT
    $rootScope.$on('Identity.onLogOut', function() {
        $state.go('login');
    });

    //REGISTER EVENT ON $API CALL's
    $Api.$on("beforeSend", function(headers) {

        //SET AUTHORIZATION HEADER IF USER IS AUTHENTICATED
        if (Identity.isAuthenticated()) {
            var jwt = Identity.token();
            headers['Authorization'] = jwt.token_type + " " + jwt.access_token;
        }
    });

})

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('pink')
        .warnPalette('red');

    //For Exceptions UI's
    $mdThemingProvider.theme('exception')
        .primaryPalette('red')
})

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


.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    // ---------------------------------------------
    // ACCOUNT
    // ---------------------------------------------

        .state('login', {
        url: '/login',
        templateUrl: 'views/security/login.html',
        controller: 'LoginController'
    })

    .state('logout', {
        url: '/logout',
        controller: 'LogOutController'
    })

    .state('account-password-create', {
        url: '/account/password/create/:token',
        templateUrl: 'views/account/password-create.html',
        controller: 'AccountPasswordCreateController'
    })

    .state('account-password-recovery', {
        url: '/account/password/recovery/:token',
        templateUrl: 'views/account/password-recovery.html',
        controller: 'AccountPasswordCreateController'
    })

    // ---------------------------------------------    
    // ABSTRACT
    // ---------------------------------------------
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/shared/layout.html",
        controller: "LayoutController"
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
    // BPM
    // ---------------------------------------------

    .state('app.bpm-inbox', {
        url: '/bpm/inbox/',
        views: {
            content: {
                templateUrl: 'views/administration/bpm/inbox.html',
                controller: 'Administration_BpmInboxController'
            }
        }
    })

    .state('app.bpm-notification', {
        url: '/bpm/notification/',
        views: {
            content: {
                templateUrl: 'views/administration/bpm/notification.html',
                controller: 'Administration_BpmNotificationController'
            }
        }
    })


    // ---------------------------------------------
    // GENERALES
    // ---------------------------------------------

    .state('app.home', {
        url: '/home'
    })

    .state('app.dashboard', {
        url: '/dashboard',
        views: {
            content: {
                templateUrl: 'views/dashboard/dashboard.html',
                controller: 'DashboardController'
            }
        }
    })

    .state('app.dashboard-details', {
        url: '/dashboard/details/:date',
        views: {
            content: {
                templateUrl: 'views/dashboard/dashboard-details.html',
                controller: 'DashboardDetailsController'
            }
        }
    })

    // ---------------------------------------------
    // ADMINISTRATION - USER
    // ---------------------------------------------

    .state('app.administration-user', {
        url: '/administration/user',
        views: {
            content: {
                templateUrl: 'views/administration/user/list.html',
                controller: 'Administration_UserListController'
            }
        }
    })

    .state('app.administration-user-create', {
        url: '/administration/user/create',
        views: {
            content: {
                templateUrl: 'views/administration/user/create.html',
                controller: 'Administration_UserCreateController'
            }
        }
    })

    .state('app.administration-user-update', {
        url: '/administration/user/update/:token',
        views: {
            content: {
                templateUrl: 'views/administration/user/update.html',
                controller: 'Administration_UserUpdateController'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/error/404");

});