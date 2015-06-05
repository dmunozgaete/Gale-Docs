angular.module('app.controllers')

.directive('polygonDetails', function() {
    return {
        restrict: 'E',
        scope: {
            details:        '=',    // Details
            collections:    '='     // Collection's
        },
        templateUrl: 'views/businessUnit/step-5/polygon-details.html',
        controller: function(
            $scope, 
            $element, 
            $log, 
            $mdSidenav, 
            $mdDialog, 
            $Localization, 
            $stateParams,
            $Configuration,
            $mdToast,
            $Api
        ){  
            //------------------------------------------------------------------
            // (Override the businessUnit header)
            var businessUnit        = $stateParams.businessUnit;
            var header              = $Configuration.get("customHeaders")["businessUnit"];
            var customHeaders       = {};
            customHeaders[header]   = businessUnit;
            //------------------------------------------------------------------
                

            //---------------------------------------------
            $scope.hovered = false; //EDIT POLYGON NAME AND TYPE
            $scope.$watch("details", function(value){
                if(value){
                    //Get Polygon Data
                    var polygon = $scope.details.data;

                    //Clone Original Information , for restoring
                    var _restoringInformation = angular.copy({
                        nombre:         polygon.nombre,
                        servicios:      polygon.servicios,
                        tipo:           polygon.tipo,
                        coordenadas:    polygon.coordenadas
                    }); 

                    //SET A RESTORE FUNCTION IN POLYGON
                    polygon.restore = function(){
                        //Restoring Before Cancel State
                        angular.extend(polygon, _restoringInformation);

                        //Restore Polygon
                        var coords = [];

                        // Get Coordinates
                        angular.forEach(_restoringInformation.coordenadas, function(coord){
                            var coord = new google.maps.LatLng(coord.lat, coord.lng);
                            coords.push(coord);
                        });

                        polygon.figure.setCoordinates(coords);

                    }

                    //MARK SELECTED SERVICES
                    _.each($scope.collections.services, function(service){

                        var exists = _.find(polygon.servicios, {
                            token: service.token
                        });
                        
                        service.selected = exists ? true: false;

                    });
                }
            })
            //---------------------------------------------
            
            //---------------------------------------------
            // VIEW ACTION'S
            $scope.toggleSelect = function(item){
                item.selected = !item.selected;
                $scope.setDirty(true);
            };

            $scope.setDirty = function(value){
                $scope.details.dirty = value; //SET MODIFIED
            }

            var getDirty = function(){
                return $scope.details.dirty;
            }

            $scope.save = function(){
                
                var polygon = $scope.details.data;

                //CHECK NAME
                var array = $scope.collections.polygons;
                for(var i = array.length - 1; i >= 0; i--){
                    if(array[i] !== polygon && array[i].nombre == polygon.nombre){
                        $mdToast.show(
                          $mdToast.simple()
                            .content('Ya existe un polígono con ese nombre')
                            .position('bottom right')
                            .hideDelay(3000)
                        );
                        return;
                    }
                }
                
                var services = [];

                //GET SELECTED SERVICES
                _.each($scope.collections.services, function(service){

                    if(service.selected){
                        services.push(service);
                    }

                });

                var data = {
                    nombre:         polygon.nombre,
                    servicios:      _.pluck(services,'token'),
                    tipo:           polygon.tipo.identificador,
                    coordenadas:    polygon.figure.getCoordinates()
                }; 

 
                //SERVER SYNC
                $Api.Create('/BusinessUnit/Polygons', data , customHeaders)
                .success(function(){
                        
                    //UPDATE CURRENT POLYGON
                    polygon.coordenadas = data.coordenadas;
                    polygon.servicios = services;
                    polygon.figure.setType(polygon.tipo.identificador);

                    
                    $mdSidenav('left-side-panel').close();
                    
                    //Check if not been added Yet!
                    for(var i = array.length - 1; i >= 0; i--){
                        if(array[i].nombre == polygon.nombre){
                            return; //Added Before!
                        }
                    }

                    $scope.collections.polygons.push(polygon);
                    

                });

            }

            $scope.delete = function(){
                var polygon = $scope.details.data;

                // Delete Confirm
                $mdDialog.show(
                    $mdDialog.confirm()
                    .ariaLabel('')
                    .targetEvent(event)
                    .title($Localization.get('DELETE_CONFIRM_TITLE'))
                    .content($Localization.get('DELETE_CONFIRM_CONTENT'))
                    .ok($Localization.get('DELETE_CONFIRM_OK_LABEL'))
                    .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
                ).then(function() {
                    var remove = function(){
                        var array = $scope.collections.polygons;

                        //REMOVE
                        for(var i = array.length - 1; i >= 0; i--){
                            if(array[i].nombre == polygon.nombre){
                                array.splice(i,1);
                                break;
                            }
                        }

                        polygon.figure.remove();
                        $mdSidenav('left-side-panel').close();
                    }

                    if(polygon.nombre.length>0){
                        //SERVER SYNC
                        $Api.Delete('/BusinessUnit/Polygons', polygon.nombre , customHeaders)
                        .success(function(){
                            
                            remove();

                        });
                    }else{
                        remove();
                    }
                    

                });

            }

            $scope.cancel = function(){
                var confirm = function(){
                    $scope.setDirty(false);

                    //Get Polygon Data
                    var polygon = $scope.details.data;
                    polygon.restore();

                    $mdSidenav('left-side-panel').close();
                }


                if (getDirty()){

                    // Delete Confirm
                    $mdDialog.show(
                        $mdDialog.confirm()
                        .ariaLabel('')
                        .targetEvent(event)
                        .title("Cambios sin Guardar")
                        .content([
                            "Se perderan los cambios ",
                            "\t\n",
                            "¿Está seguro de continuar?"
                        ].join(""))
                        .ok($Localization.get('DELETE_CONFIRM_TITLE'))
                        .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
                    ).then(function() {

                        confirm();

                    });

                }else{

                    confirm();

                }
                
            }   
            //---------------------------------------------
            
        },

        link: function (scope, element, attrs, ctrl) {
        }   
    };
})