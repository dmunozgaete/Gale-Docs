angular.module('App', [
    'ui.router'                 //NG ROUTE
    ,'ngMaterial'               //MATERIAL DESIGN DIRECTIVES
    ,'uiGmapgoogle-maps'        //GOOGLE MAPS
    ,'core'                     //VALENTYS SDK LIBRARY
    ,'app'                      //CUSTOM PROJECT LIBRARY,
    ,'angularMoment'            //ANGULAR MOMENT
    ,'n3-pie-chart'             //N3 PIE CHARTS
    ,'mdDateTime'               //Date
    //,'mocks'
    ,'angularFileUpload'
    ,'mdDateTime'               //Date

])

.run(function ($rootScope, $state, $location, $log, Identity, $templateCache, $Api, $Configuration) {
    $log.debug("application is running!!");

    //RECOVERY AND CREATING PROCESS
    if($location.path().indexOf("/account/password/")>=0){
        return;
    }

    //RESTRICT ACCESS TO LOGIN USER'S ONLY
    $rootScope.$on('$stateChangeStart', function (event, toState,current) {
        
        
        if ( toState.name !== "login" && !Identity.isAuthenticated() ) {
            $state.go('login');
            event.preventDefault();
        }

        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }

    });

    //REDIRECT TO DASHBOARD WHEN IS AUTHENTICATED
    if(Identity.isAuthenticated()){
        $location.path('/app/home');
    
    }else{
        $location.path('/login'); 
    }

    //CALL WHEN IDENTITY HAS LOGOUT
    $rootScope.$on('Identity.onLogOut', function () {
        $state.go('login');
    });

    //REGISTER EVENT ON $API CALL's
    $Api.$on("beforeSend", function(headers){

        //SET AUTHORIZATION HEADER IF USER IS AUTHENTICATED
        if(Identity.isAuthenticated()){
            var jwt = Identity.token();
            headers['Authorization'] = jwt.token_type + " " + jwt.access_token;
        

            //RESITER: ADD BUSINESSUNIT IF NOT SETTED YET
            var header = $Configuration.get("customHeaders")["businessUnit"];
            if(!headers[header]){
                var businessUnit = Identity.get().property("businessUnit");
                if(businessUnit){
                    headers[header] = businessUnit.token;
                }
            }
        }
    });

})

.config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink')
    .warnPalette('red');

    //For Exceptions UI's
    $mdThemingProvider.theme('exception')
    .primaryPalette('red')

    //For Exceptions UI's
    $mdThemingProvider.theme('valentys')
    .primaryPalette('deep-orange')
})

.config(function($ApiProvider, ENVIRONMENT_CONFIGURATION) {
    $ApiProvider.setEndpoint(ENVIRONMENT_CONFIGURATION.endpoint)
})

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization,drawing'
    });
})

//DECORATE $LOG
.config(function( $provide ) {
    
    //------------------------------------------------------------------------
    //DECORATE ERROR
    $provide.decorator( '$log', function( $delegate, $injector )
    {
        // Save the original $log.debug()
        var errorFn = $delegate.error;

        $delegate.error = function( )
        {
            //BroadCast UnhandledException
            var rScope = $injector.get('$rootScope');
            if(rScope){
                rScope.$broadcast('$log.unhandledException', arguments);
            }

            var env = $injector.get('ENVIRONMENT_CONFIGURATION');
            if(env.debugging){

                errorFn.apply(null, arguments)  
                
            }
        };

        return $delegate;
    });
    //------------------------------------------------------------------------
    
    //------------------------------------------------------------------------
    $provide.decorator('mdSidenavDirective', function ($delegate, $controller, $rootScope) {
        var directive = $delegate[0];
        var compile = directive.compile;

        directive.compile = function (tElement, tAttrs) {
            var link = compile.apply(this, arguments);
            return function (scope, elem, attrs) {
                
                scope.$watch('isOpen', function (val) {
                    
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


.config(function ($stateProvider, $urlRouterProvider) {

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
    // MOMITOR
    // ---------------------------------------------
    // 
    .state('app.monitor', {
        url: '/monitor',
        views: {
            content: {
                templateUrl: 'views/monitor/monitor.html',
                controller: 'MonitorController'
            }   
        }
    })

    // ---------------------------------------------
    // REPORTES
    // ---------------------------------------------
    
    .state('app.reports-services', {
        url: '/reports/services',
        views: {
            content: {
                templateUrl: 'views/reports/services.html',
                controller: 'ReportServicesController'
            }   
        }
    })

    .state('app.reports-services-in-range', {
        url: '/reports/services-in-range',
        views: {
            content: {
                templateUrl: 'views/reports/services-in-range.html',
                controller: 'ReportServicesInRangeController'
            }   
        }
    })

    .state('app.reports-images-in-range', {
        url: '/reports/images-in-range',
        views: {
            content: {
                templateUrl: 'views/reports/images-in-range.html',
                controller: 'ReportImagesInRangeController'
            }   
        }
    })
	
	.state('app.reports-daily-movements', {
        url: '/reports/daily-movements',
        views: {
            content: {
                templateUrl: 'views/reports/daily-movements.html',
                controller: 'ReportDailyMovementsController'
            }   
        }
    })
    // ---------------------------------------------
    // UNIDAD DE NEGOCIO
    // ---------------------------------------------
    
    .state('app.my-businessUnit', {
        url: '/unidadnegocio/resume',
        views: {
            content: {
                templateUrl: 'views/businessUnit/resume.html',
                controller: 'BusinessUnitResumeController'
            }   
        }
    })

    .state('app.businessUnit', {
        url: '/unidadnegocio',
        views: {
            content: {
                templateUrl: 'views/businessUnit/list.html',
                controller: 'BusinessUnitController'
            }   
        }
    })

    .state('app.businessUnit-create-1', {
        url: '/unidadnegocio/crear/1/',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-1.html',
                controller: 'BusinessUnitCreateStep1Controller'
            }   
        }
    })

    .state('app.businessUnit-create-2', {
        url: '/unidadnegocio/crear/2/:client',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-2.html',
                controller: 'BusinessUnitCreateStep2Controller'
            }   
        }
    })

    .state('app.businessUnit-create-3', {
        url: '/unidadnegocio/crear/3/:businessUnit',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-3.html',
                controller: 'BusinessUnitCreateStep3Controller'
            }   
        }
    })

    .state('app.businessUnit-create-4', {
        url: '/unidadnegocio/crear/4/:businessUnit',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-4.html',
                controller: 'BusinessUnitCreateStep4Controller'
            }   
        }
    })

    .state('app.businessUnit-create-5', {
        url: '/unidadnegocio/crear/5/:businessUnit',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-5.html',
                controller: 'BusinessUnitCreateStep5Controller'
            }   
        }
    })

    .state('app.businessUnit-create-6', {
        url: '/unidadnegocio/crear/6/:businessUnit',
        views: {
            content: {
                templateUrl: 'views/businessUnit/create-step-6.html',
                controller: 'BusinessUnitCreateStep6Controller'
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

    // ---------------------------------------------
    // ADMINISTRATION - SERVICE TYPE
    // ---------------------------------------------

    .state('app.administration-serviceType', {
        url: '/serviceType',
        views: {
            content: {
                templateUrl: 'views/serviceType/list.html',
                controller: 'ServiceTypeListController'
            }   
        }
    })

    .state('app.administration-serviceType-create', {
        url: '/serviceType/create',
        views: {
            content: {
                templateUrl: 'views/serviceType/create.html',
                controller: 'ServiceTypeCreateController'
            }   
        }
    })

    .state('app.administration-serviceType-update', {
        url: '/serviceType/update/:token',
        views: {
            content: {
                templateUrl: 'views/serviceType/update.html',
                controller: 'ServiceTypeUpdateController'
            }   
        }
    })

    // ---------------------------------------------
    // ADMINISTRATION - POLYGON TYPE
    // ---------------------------------------------

    .state('app.administration-polygonType', {
        url: '/polygonType',
        views: {
            content: {
                templateUrl: 'views/polygonType/list.html',
                controller: 'PolygonTypeListController'
            }   
        }
    })

    .state('app.administration-polygonType-create', {
        url: '/polygonType/create',
        views: {
            content: {
                templateUrl: 'views/polygonType/create.html',
                controller: 'PolygonTypeCreateController'
            }   
        }
    })

    .state('app.administration-polygonType-update', {
        url: '/polygonType/update/:token',
        views: {
            content: {
                templateUrl: 'views/polygonType/update.html',
                controller: 'PolygonTypeUpdateController'
            }   
        }
    })

    // ---------------------------------------------
    // ADMINISTRATION - MONTH PROGRAMMING
    // ---------------------------------------------

    .state('app.administration-programming', {
        url: '/programming/:month',
        views: {
            content: {
                templateUrl: 'views/programming/list.html',
                controller: 'ProgrammingListController'
            }   
        }
    })

    .state('app.administration-programming-update', {
        url: '/programming/update/:service/:month',
        views: {
            content: {
                templateUrl: 'views/programming/update.html',
                controller: 'ProgrammingUpdateController'
            }   
        }
    })

    // ---------------------------------------------
    // ADMINISTRATION - ROUTE
    // ---------------------------------------------
    
    .state('app.administration-route', {
        url: '/route/:date',
        views: {
            content: {
                templateUrl: 'views/route/list.html',
                controller: 'RouteListController'
            }   
        }
    })

    .state('app.administration-route-update', {
        url: '/route/update/:token/:date',
        views: {
            content: {
                templateUrl: 'views/route/update.html',
                controller: 'RouteUpdateController'
            }   
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/error/404");

});