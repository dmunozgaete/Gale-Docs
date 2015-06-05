angular.module('app.controllers')

//MODAL CONTROLLER
.controller('RouteUpdateModalController', function( 
    $scope, 
    $mdDialog, 
    $mdToast,
    $karmaTable,
    $q,
    collections,
    task
){

    //------------------------------------------------------------------
    // SCOPE MODEL
    $scope.data = {
        collections: collections,
        availablePolygons: [],  //Filter by Type 
        task: {
            vehicle: null,
            type: null,
            polygons: []
        },

        finder: {
            items: [],
            filter: "",
            item: null,
            change: function(){},
            search: function(query){
                var filtered = [];
                var _query = query.toLowerCase();

                angular.forEach($scope.data.availablePolygons, function(item) {
                    if( item.nombre.toLowerCase().indexOf(_query) >= 0 ){
                        filtered.push(item);
                    }
                });

                return filtered;
            },

            add: function(item){
                var data = $scope.data;

                var exists = _.find(data.filteredPolygons, function(polygon){
                    return polygon.token == item.token;
                });

                if(!exists){
                    item.cantidad = 1;
                    data.filteredPolygons.push(item);
                }
                
            }
        },
    };
    //------------------------------------------------------------------    

    //------------------------------------------------------------------
    // Filter Polygons, by Service
    $scope.updatePolygons = function(){
        var data = $scope.data;
        var selectedVehicle = data.task.vehicle;
        var selectedType = data.task.type;
        var selectedDriver = data.collections.driver;

        if(!selectedType || !selectedDriver || !selectedVehicle){
            return;
        }

        //------------------------------------------------------------------
        data.availablePolygons = [];
        angular.forEach(data.collections.polygons, function(polygon){

            // RESET POLYGON's
            polygon.cantidad = 0;

            //The polygon , can be assignable to the service??
            var index = _.indexOf(polygon.servicios, selectedType.token)
            if(index>=0){
                data.availablePolygons.push(polygon);
            }

        });
        //------------------------------------------------------------------
        
        // Get Points, for the driver 
        var points = _.filter(data.collections.allPoints, function(point){
            var ret = (
                point.conductor.token == selectedDriver.token &&
                point.tipo.token == selectedType.token && 
                point.vehiculo.token == selectedVehicle.token
            );

            // Filter all points, which , was "temporal" removed :P
            if(point.temporal_state == "_REMOVED"){
                ret = false;
            }

            return ret;
        });


        var firstConfiguration = true;

        //--------------------------------------------------
        //GROUP POINT BY POLYGON'S
        var polygons = _.groupBy(points, function(point){
            return point.poligono.token;
        });
        
        for(var key in polygons){
            
            //VERIFICAMOS SI EL POLIGONO YA FUE CONFIGURADO PREVIAMENTE
            var points = polygons[key];
            var polygon = _.find(data.availablePolygons, {token: key})
            polygon.cantidad = points.length;      
            if(points.length > 0){
                // EN EL CASO EN QUE SEA LA PRIMERA CONFIGURACION , 
                // CORRERA EL CHEQUEO DE PROGRAMACION MENSUAL 
                // YA QUE ES LA PRIMERA VEZ QUE SE CONFIGURA ESTE TIPO
                // DE SERVICIO PARA EL USUARIO
                firstConfiguration = false;
            }  
        }
        //--------------------------------------------------

        // SI ES LA PRIMERA CONFIGURACION , ENTONCES SE INICA EL PASO DE 
        // PROGRAMAR VIA PROGRAMACION MENSUAL
        if(firstConfiguration){
            var programming = data.collections.program[selectedType.token];
            if(programming){
                _.each(data.availablePolygons, function(polygon){
                    

                    // LA VARIABLE "POINTS" CONTIENE LOS PUNTOS ASIGNADOS SOLO AL USUARIO.
                    // POR ENDE , SI BUSCO EL POLIGONO EN "TODOS LOS PUNTOS", Y LO ENCUENTRO
                    // SIGNIFICA QUE EL PUNTO YA SE ENCUENTRA ASIGNADO A OTRO USUARIO
                    // POR LO TANTO NO DEBE, PRESENTARSE PARA EL ACTUAL USUARIO
                    var exists = _.find(data.collections.allPoints, function(point){
                        return point.poligono.token == polygon.token && 
                               point.conductor.token !== selectedDriver.token
                    });

                    if(!exists){

                        // EXISTEN POLIGONOS PROGRAMADOS PARA 
                        // EL SEVICIO EN EL DIA SELECCIONADO??
                        if(_.contains(programming, polygon.token)){
                            polygon.cantidad = 1;   //CONFIGURA EL POLIGONO CON 1 RETIRO
                        }

                    }

                })
            }
        }


        // FINALMENTE FILTRAMOS TOOS LOS POLIGONOS QUE NO CONTENGAN RETIROS
        // CANTIDAD == 0;
        
        data.filteredPolygons = _.filter(data.availablePolygons, function(polygon){
            return polygon.cantidad > 0;
        })
    }
    //------------------------------------------------------------------
    
    //------------------------------------------------------------------
    if(task){
        // Finally Change Type!
        $scope.data.task = task;        
        $scope.updatePolygons();
    }
    //------------------------------------------------------------------
    
    //------------------------------------------------------------------
    // View Action's
    $scope.save = function(){
        var data = $scope.data;
        
        // Process each modified Polygons in Availables Polygons
        _.each(data.availablePolygons, function(polygon){
            var quantity = polygon.cantidad;

            //----------------------------------------------------------------------
            // Clean all already "Temporal Configuration"
            _.remove(data.collections.allPoints, function(point) {
                return (
                    point.conductor.token   == data.collections.driver.token &&
                    point.tipo.token        == data.task.type.token && 
                    point.vehiculo.token    == data.task.vehicle.token &&
                    point.poligono.token    == polygon.token &&
                    point.temporal_state    == "_CREATED"    //REMOVE TEMPORALY CREATED
                );
            });
            //----------------------------------------------------------------------
            
            //----------------------------------------------------------------------
            // Get current Points in allPoints
            var points = _.filter(data.collections.allPoints, function(point){
                var ret = (
                    point.conductor.token   == data.collections.driver.token &&
                    point.tipo.token        == data.task.type.token && 
                    point.vehiculo.token    == data.task.vehicle.token &&
                    point.poligono.token     == polygon.token
                );

                return ret;
            });
            //----------------------------------------------------------------------
            
            //----------------------------------------------------------------------
            // Clean all already "Temporal Configuration"
            _.forEachRight(points, function(point){
                if(point.temporal_state){
                    delete point.temporal_state;
                }
            });
            //----------------------------------------------------------------------
            
            var configuredPointsAlready = points.length;

            //----------------------------------------------------------------------
            // Re-Arrange Accord the "logic"
            if(quantity > configuredPointsAlready){
                //CREATE MORE POINT'S (TEMPORAL POINT) !!
                for(var i = quantity - configuredPointsAlready; i > 0; i--){


                    //add Point
                    var temporal_point = {
                        conductor:      data.collections.driver,
                        tipo:           data.task.type, 
                        vehiculo:       data.task.vehicle,
                        poligono:       polygon,
                        temporal_state: "_CREATED",
                        token:          null    //Temporal,
                    };

                    data.collections.allPoints.push(temporal_point);
                }
            }

            if(quantity < configuredPointsAlready){
                //TODO REDUCE (MARK AS DELETED STATE)
                while( configuredPointsAlready > quantity ){

                    var pointToRemove = points.pop();
                    pointToRemove.temporal_state = "_REMOVED";
                    configuredPointsAlready --;

                }
                
            }
            //----------------------------------------------------------------------

        });

        $mdDialog.hide( $scope.data.task );
    }

    $scope.back = function(){
        //TODO: Fix , press enter on the autcompelte, and this function is called :S
        $mdDialog.cancel();
    }
    //------------------------------------------------------------------

});