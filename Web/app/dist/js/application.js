//#Manifiest
angular.manifiest('app', [
	'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'app.services.api',
    'app.demos'
]);;'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "a.\u00a0m.",
      "p.\u00a0m."
    ],
    "DAY": [
      "domingo",
      "lunes",
      "martes",
      "mi\u00e9rcoles",
      "jueves",
      "viernes",
      "s\u00e1bado"
    ],
    "ERANAMES": [
      "antes de Cristo",
      "despu\u00e9s de Cristo"
    ],
    "ERAS": [
      "a. C.",
      "d. C."
    ],
    "MONTH": [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "setiembre",
      "octubre",
      "noviembre",
      "diciembre"
    ],
    "SHORTDAY": [
      "dom.",
      "lun.",
      "mar.",
      "mi\u00e9.",
      "jue.",
      "vie.",
      "s\u00e1b."
    ],
    "SHORTMONTH": [
      "ene.",
      "feb.",
      "mar.",
      "abr.",
      "may.",
      "jun.",
      "jul.",
      "ago.",
      "set.",
      "oct.",
      "nov.",
      "dic."
    ],
    "fullDate": "EEEE, d 'de' MMMM 'de' y",
    "longDate": "d 'de' MMMM 'de' y",
    "medium": "dd-MM-y h:mm:ss a",
    "mediumDate": "dd-MM-y",
    "mediumTime": "h:mm:ss a",
    "short": "dd-MM-yy h:mm a",
    "shortDate": "dd-MM-yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "es-cl",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
;//------------------------------------------------------
// Company: Valentys Ltda.
// Author: dmunozgaete@gmail.com
// 
// Description: Material Icon's for using with the <md-icon/> directive
// 
// URL: https://www.google.com/design/icons/
// 
// MD-ICON USE:
//		<md-icon md-svg-icon="category:icon"></md-icon> 

//    	WHERE:
//        	category: Icon Category, example: action
//			icon:   Icon Name, example: home
//------------------------------------------------------
angular.module('material-icons', ['ngMaterial'])

.config(function($mdIconProvider) {
    //Icons Set's (https://github.com/nkoterba/material-design-iconsets)
    var bundle_src = "bundles/material-icons/svg/icons/{0}-icons.svg";
    angular.forEach([
        "action", "alert", "av", "communication", "content",
        "device", "editor", "file", "hardware", "icons", "image",
        "maps", "navigation", "notification", "social", "toggle"
    ], function(toolset) {
        $mdIconProvider.iconSet(toolset, bundle_src.format([toolset]), 24);
    });
});;angular.module('app.controllers')
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
        $galeLoading,
        Analytics
    ) {
        //------------------------------------------------------------------------------------
        // Model
        $scope.config = {
            application: $Configuration.get("application"),
            menu: $Configuration.get("menu"),
            google: $Configuration.get("google")
        };
        $scope.config.selected_menu = $scope.config.menu[0].items[0];
        
        //------------------------------------------------------------------------------------
        // Layout Actions
        $scope.link = function(url) {
            $timeout(function() {
                $state.go(url);
            }, 300);
            $mdSidenav('left').close();
        };
        
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleMenu = function(section) {
            section.open = !section.open;
        };
        $scope.navigateTo = function(item) {

            $scope.config.selected_menu = item;
            $state.go("app.{0}".format([item.$path]));
            
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
        , 'gale'                        //ANGULAR GALE LIBRARY
        , 'app'                         //CUSTOM PROJECT LIBRARY
        , 'material-icons'              //CUSTOM PROJECT LIBRARY
        , 'hljs'                        //HIGHLIGHT
        , 'angular-google-analytics'    //ANGULAR GOOGLE ANALITYCS
    ])
    .run(function($location, $Configuration, $log, Analytics) {
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
    // Set GOOGLE analytics account
    .config(function(AnalyticsProvider, CONFIGURATION) {
        AnalyticsProvider.setAccount(CONFIGURATION.google.analytics);
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
        //AnalyticsProvider.setDomainName('none'); FOR TESTING IN LOCALHOST
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
                if(item.label  !== ""){
                data.paths.push(item.name);
                data.labels.push(item.label||item.name);
                }

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
;angular.module("config", [])
    .constant("GLOBAL_CONFIGURATION", {

        //Application data
        application: {
            version: "2.2.5",
            author: "David Antonio Muñoz Gaete",
            environment: "development",
            language: "es",
            name: "Gale Doc's",
            home: "/demo/gettingStarted/introduction"
        },

        google: {
             analytics: "UA-66082630-2"
        },

        menu: [

            //Gettting Started
            {
                label: "Primeros Pasos",
                name: "gettingStarted",
                open: true,
                items: [
                    {
                        label: "Introducción",
                        name: "introduction"
                    },

                    {
                        label: "Instalación",
                        name: "installation"
                    }
                ]
            },

            //Server References
            {
                label: "API",
                name: "api",
                items: [
                    {
                        label: "Controladores",
                        name: "controllers",
                        items: [
                            { name: "RestController" },
                            { name: "BlueprintController" }
                        ]
                    },

                    {
                        label: "Modelos",
                        name: "models",
                        items: [
                            { name: "definition", label:"Definición" },
                            { name: "example", label:"Ejemplo de Creación" }
                        ]
                    },

                    {
                        label: "Servicios",
                        name: "services",
                        items: [
                            { name: "definition", label:"Definición" }
                        ]
                    },

                    {
                        label: "Respuestas HTTP",
                        name: "services",
                        items: [
                            { name: "HttpBaseActionResult" },
                            { name: "HttpFileActionResult" },
                            { name: "HttpCreationActionResult" },
                            { name: "HttpReadActionResult" },
                            { name: "HttpUpdateActionResult" },
                            { name: "HttpDeleteActionResult" },
                            { name: "HttpQueryableActionResult" }
                        ]
                    },

                    {
                        label: "Seguridad",
                        name: "security",
                        items: [
                            { name: "jwt" , label:"Autorización JWT" }
                        ]
                    } /*,

                    {
                        label: "Ambientes",
                        name: "staging",
                        items: [
                            { name: "Introduction" },
                            { name: "Deployment" },
                            { name: "Production" }
                        ]
                    } */
                ]
            },

            //Help US
            {
                label: "Contribuciones",
                name: "helpus",
                open: true,
                items: [
                    {
                        label: "Colaboradores",
                        name: "about"
                    },
                    {
                        label: "Recursos Externos",
                        name: "resources"
                    }
                ]
            },
        ]
    });
