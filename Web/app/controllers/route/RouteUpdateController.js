angular.module('app.controllers')

.controller('RouteUpdateController', function (  
    $scope, 
    $state, 
    $window,
    $Api,
    $log,
    $stateParams,
    $karmaTable,
    $mdDialog,
    $Localization,
    UploadHelper,
    $q
) {

    $scope.data = {
        driver:     $stateParams.token,
        date: new Date($stateParams.date)
    };

    //----------------------------------------------
    //PROMISES
    var polygonPromise  = $q.defer();
    var typePromise     = $q.defer();
    var routePromise    = $q.defer();
    var vehiclePromise  = $q.defer();
    var servicePromise  = $q.defer();
    var programPromise  = $q.defer();
    //----------------------------------------------
    
    //----------------------------------------------
    //--[ GET POLYGONS FROM BUSINESSUNIT
    $Api.Read('/BusinessUnit/Polygons')
    .success(function(data){
        polygonPromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    //--[ GET VEHICLES FROM BUSINESSUNIT
    $Api.Read('/BusinessUnit/Vehicles')
    .success(function(data){
        vehiclePromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    //--[ GET SERVICES (FOR FILTER'S SERVICE TYPES AVAILABLE)
    $Api.Read('/BusinessUnit/Services')
    .success(function(data){
        servicePromise.resolve(data);
    });
    //----------------------------------------------

    //----------------------------------------------
    //--[ GET SERVICES TYPES
    $Api.Read('/ServiceType')
    .success(function(data){
        typePromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // EXTRAE TODAS LAS RUTAS DEL DIA
    $Api.Read('/BusinessUnit/Routes?date={0}'.format([
        $scope.data.date.toISOString()
    ]))
    .success(function(data){
        routePromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // EXTRAE LA PROGRAMACION PARA EL DIA SELECCIONADO
    // EN LA PROGRAMACION MENSUAL
    $Api.invoke('GET', '/Programming/Day',{
        day: $scope.data.date.toISOString()
    })
    .success(function(data){
        programPromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // WAITING FOR PROMISE TO LOAD THE GOOGLE MAPS
    $q.all([
        polygonPromise.promise, 
        typePromise.promise, 
        servicePromise.promise,
        routePromise.promise,
        vehiclePromise.promise,
        programPromise.promise
    ]).then(function(resolves){
        
        var data        = $scope.data;
        var polygons    = resolves[0];
        var types       = resolves[1];
        var services    = resolves[2];
        var drivers     = resolves[3];
        var vehicles    = resolves[4];
        var driver      = _.find(drivers.items, {token: data.driver});
        var program     = resolves[5];  //PROGRAMACION MENSUAL   

        //--------------------------------------------------------------------------------
        //--[ REDUCE PROGRAM TO GROUPED ARRAY 
        var _program    = {};
        var _groupedProgram = _.groupBy(program, function(program){
            return program.tipo;
        });
        for(var type in _groupedProgram){
            _program[type] = _.pluck(_groupedProgram[type], 'poligono');
        }
        //--------------------------------------------------------------------------------

        //--------------------------------------------------------------------------------
        //--[ TOKEN'S TO OBJECT 
        
        // Set Data
        angular.extend(data, {
            viewport:   polygons.viewport,
            polygons:   polygons.polygons,
            types:      [],
            driver:     driver,
            vehicles:   vehicles.items,
            drivers:    drivers.items,
            allPoints:  [],
            program:    _program
        });

        // Filter service types , only for the services availables (Token to Object)        
        angular.forEach(services.items,function(service){

            var type = _.find(types.items, {token: service.token});
            data.types.push(type);

        });

        //Group All Point
        data.allPoints =  _.flatten(_.pluck(data.drivers, 'puntos'));

        //Re-Generate the User Routes (Token's to Object) ! (Always has to be a driver!)
        angular.forEach(data.allPoints, function(route){

            route.poligono = _.find(data.polygons, {token: route.poligono});
            route.vehiculo = _.find(data.vehicles, {token: route.vehiculo});
            route.tipo     = _.find(data.types,    {token: route.tipo});
            route.conductor= _.find(data.drivers,  {token: route.conductor});
            
        });
        //--------------------------------------------------------------------------------
        
        bootstrap(data);
    })
    //----------------------------------------------
    
    //----------------------------------------------
    // BOOTSTRAP (INITIALIZATION)
    var bootstrap = function(data){
        
        resumeTable(data.driver);
    }
    //----------------------------------------------
    
    //----------------------------------------------
    // GROUP POINT BY VEHICLE && DRIVER
    var resumeTable = function(driver){
        
        var resume = [];

        //Get Points, for the driver 
        var points = _.filter($scope.data.allPoints, function(point){
            var ret = (
                point.conductor.token == driver.token
            );

            //Filter all points, which , was "temporal" removed :P
            if(point.temporal_state == "_REMOVED"){
                ret = false;
            }

            return ret;
        });

        driver.puntos = points;   //Update Points

        var vehicles =_.groupBy(points,  function(punto){
            return punto.vehiculo.token;
        });

        for(var vehicle in vehicles){
            var points = vehicles[vehicle];

            var types = _.groupBy(points,  function(punto){
                return punto.tipo.token;
            });

            for(var type in types){
                var points = types[type];

                resume.push({
                    vehicle:    _.find($scope.data.vehicles,   {token: vehicle}),
                    type:       _.find($scope.data.types,      {token: type}),
                    points:     points
                });
            }

        }

        resume = _.sortBy(resume, function(item){
            return item.vehicle.patente;
        });

        $scope.data.resume = resume;
    
    }
    //----------------------------------------------

    //----------------------------------------------
    // UPLOAD COMPONENT
	//     https://github.com/danialfarid/ng-file-upload
    $scope.upload = function (files) {
        
        UploadHelper.upload(files)
        .$on("beforeStart", function(files){
            
            $scope.uploadData = {
                <!-- -->
                options: {
                    thickness: 5, 
                    mode: "gauge", 
                    total: 100
                },
                <!-- -->
                progress: [{
                    label: $Localization.get('UPLOADHELPER_UPLOADING_LABEL'), 
                    value: 0, 
                    color: "#FF5722", 
                    suffix: "%"
                }]
                <!-- -->
            };
        })
        .$on("progress", function(progress){
            if($scope.uploadData){
                $scope.uploadData.progress[0].value = progress;  
            }
        })
        .$on("complete", function(files){
            //Change User Photo 
            $scope.data.driver.imagen = _.first(files).token;
            $scope.uploadData = null;

        })
        .$on("error", function(data){
            $scope.uploadData = null;
        });
    };
    //------------------------------------------
    
	//------------------------------------------
	// VIEW ACTION'S
    $scope.add = function(task){
        
        $mdDialog.show({
            controller: 'RouteUpdateModalController',
            templateUrl: 'modal.tmpl',
            clickOutsideToClose: false,
            targetEvent: event,
            locals: {
                collections: $scope.data,
                task: task
            }
        }).then(function(task){

            resumeTable($scope.data.driver);

        });

    }

    $scope.edit = function(item){
        $scope.add(item);
    }

	$scope.cancel = function(){
		$state.go("app.administration-route", {
            date:   ($scope.data.date).toISOString()
        });
	}

    $scope.save = function(){
        var data    = $scope.data;
        var driver  = angular.copy(data.driver);
        delete driver.puntos;

        //----------------------------------------------------------------------
        // -- [GET ALL ROUTES FOR THE DRIVER]
        var points = _.filter(data.allPoints, function(point){
            return point.conductor.token == driver.token;
        });
        //----------------------------------------------------------------------
        

        var items = [];


        _.each(points, function(point){

            //Serialize Point
            var _point = {
                conductor:      driver.token,
                tipo:           point.tipo.token,
                vehiculo:       point.vehiculo.token,
                poligono:       point.poligono.token,
                estado:         point.temporal_state||point.estado,   //For Flagged
                token:          point.token             //Temporal,
            };

            items.push(_point);

        });

        //Send Driver to Update IMAGE
        $Api.Create('/BusinessUnit/Routes/?date={0}'.format([ data.date.toISOString()]), 
        {
            driver: driver,
            points: items
        })
        .success(function(data){
            $window.history.back();
        });

    }
	//------------------------------------------
	
});