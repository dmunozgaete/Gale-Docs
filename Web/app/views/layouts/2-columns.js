angular.module('app.controllers')
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
