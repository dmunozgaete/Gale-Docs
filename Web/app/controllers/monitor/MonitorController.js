angular.module('app.controllers')

.controller('MonitorController', function (
	$scope, 
	$log, 
	$state, 
	GoogleMapDrawingHelper,
	$Timer,
	$q,
	$Api,
	$mdSidenav,
	$rootScope,
	$Configuration,
	$mdToast,
	$filter,
	Finder
){
	var pin_url = "bundles/app/css/images/pines/{0}";

	//----------------------------------------------
    //PROMISES
    var polygonPromise  = $q.defer();
    var typePromise     = $q.defer();
    var routePromise    = $q.defer();
    var vehiclePromise  = $q.defer();
    var servicePromise  = $q.defer();
    var realtimePromise = $q.defer();
    //----------------------------------------------
    
	//------------------------------------------------
	//MODEL
	$scope.data = {
		date: new Date(),
		map: {
			options: {
				overviewMapControl: false,
				mapTypeControl: true, 
				streetViewControl: false,
				panControl: false,
				mapTypeId: "satellite",
				zoomControlOptions: {
					position: 9	//RIGHT BOTTOM
				}
			}
		},
		chart: null
	};
	//------------------------------------------------
	
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
    //--[ GET SERVICES FROM BUSINESSUNIT
    $Api.Read('/BusinessUnit/Services')
    .success(function(data){
        servicePromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // GET POINTS FROM BUSINESSUNIT
    $Api.Read('/BusinessUnit/Routes?date={0}'.format([
        $scope.data.date.toISOString()
    ]))
    .success(function(data){
        routePromise.resolve(data);
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
    // WAITING FOR PROMISE TO LOAD THE GOOGLE MAPS
    $q.all([
        polygonPromise.promise, 
        typePromise.promise, 
        servicePromise.promise,
        routePromise.promise,
        vehiclePromise.promise
    ]).then(function(resolves){
        
        var data        = $scope.data;
        var viewport    = resolves[0].viewport;
        var polygons    = resolves[0].polygons;
        var allTypes    = resolves[1].items;
        var services    = resolves[2].items;
        var drivers     = resolves[3].items;
        var vehicles    = resolves[4].items;
        var realtime    = resolves[5];

        //--------------------------------------------------------------------------------
        //--[ TOKEN'S TO OBJECT 
       
        // Filter service types , only for the services availables (Token to Object)  
        var types = [];      
        angular.forEach(services,function(service){

            var type = _.find(allTypes, {token: service.token});
            types.push(type);

        });

        // Polygons
        angular.forEach(polygons,function(polygon){

    		angular.forEach(polygon.servicios,function(servicio, index){

            	var serviceType = _.find(allTypes, {token: servicio});
	            
	            polygon.servicios[index] = serviceType;
	        });

        });

        //Group All Point
        var programming =  _.flatten(_.pluck(drivers, 'puntos'));

        //Re-Generate the User Routes (Token's to Object) !
        angular.forEach(programming, function(route){

            route.poligono 	= _.find(polygons, {token: route.poligono});
            route.vehiculo 	= _.find(vehicles, {token: route.vehiculo});
            route.tipo     	= _.find(types,    {token: route.tipo});
            route.conductor	= _.find(drivers,  {token: route.conductor});

        });

        //Add Toolbar and Filter's
		angular.extend(data, {
	        toolbars: {
				selected: null,
				items: {
					'layers': {
						icon:{
							category: 'maps',
							name: 'ic_layers_24px'
						},
						label: 		'Capas',
						isLayer: 	false,
						hidden: true
					},

					'drivers': {
						icon:{
							category: 'action',
							name: 'ic_account_circle_24px'
						},
						label: 		'Conductores',
						isLayer: 	true,
						items: 		drivers,
						realtime: 	true,
						enabled: 	true,
						key: 		'C'
					},
					
					'vehicles': {
						icon:{
							category: 'maps',
							name: 'ic_local_shipping_48px'
						},
						label: 		'Vehiculos',
						items: 		vehicles,
						hidden: 	true
					},
					
					'services': {
						icon: {
							category: 'maps',
							name: 'ic_my_location_24px'
						},
						label: 		'Servicios',
						isLayer: 	false,
						items: 		services,
						hidden: 	true
					},

					'polygons': {
						icon: {
							category: 'image',
							name: 'ic_filter_center_focus_24px'
						},
						label: 'Polígonos',
						isLayer: 	true,
						items: 		polygons,
						hidden: 	true,
						enabled: 	true
					},

					'programming': {
						icon: {
							category: 'action',
							name: 'ic_alarm_24px'
						},
						label: 'Programación',
						isLayer: 	true,
						items: 		programming,
						enabled: 	true,
						key: 		'P'
					},

					'points': {
						icon: {
							category: 'action',
							name: 'ic_thumbs_up_down_24px'
						},
						label: 'Serv. Realizados',
						isLayer: 	true,
						items: 		[],
						enabled: 	true,
						key: 		'R'
					},

					'notifications': {
						icon: {
							category: 'notification',
							name: 'ic_sms_24px'
						},
						label: 'Notificaciones',
						isLayer: false,
						hidden: 	true,
						key: 		'N'
					}	
				}
			}
		});

		data.toolbars.ordered = [];
		for(var key in data.toolbars.items){
			var toolbar = data.toolbars.items[key];

			if(toolbar.hidden == true){
				continue;
			}

			//Add Item to show
			data.toolbars.ordered.push(
				toolbar
			);

		}
        //--------------------------------------------------------------------------------
        
        //------------------------------------------------
		//--[ INITIALIZE MAP
        $scope.gmap = GoogleMapDrawingHelper.setup($scope, {
        	latitude: 	viewport.latitud, 
        	longitude: 	viewport.longitud,
        	zoom: 		viewport.zoom
        });
        //------------------------------------------------
        
		//------------------------------------------------
		//--[ ADD EVENT ON MAP LOADED
		$scope.$on("gmaps.mapLoaded",function(ev, map){

			// Load Completed (Hide Loading!!)
			$scope.loadCompleted = true;

			// Delay Step!
			_.delay(bootstrap, 500);
						
		});	
		//------------------------------------------------
    })
    //----------------------------------------------
    
    //---------------------------------x-------------
    // SETUP A TIMER
    var updateRealtime = function(){
			
		// GET REALTIME DATA
		$Api.Read('/Monitor/Realtime?date={0}'.format([
	        $scope.data.date.toISOString()
	    ]))
		.success(function(data){

			var layer 			= function(layer){ return $scope.data.toolbars.items[layer]; };
			var realtimeData 	= data;

	    	//----------------------------------------------------------------
	    	//--[ LAYER ITEMS
	    	var vehicles 		= layer('vehicles').items;
	    	var drivers 		= layer('drivers').items;
	    	var points 		 	= layer('points').items;
	    	var programming	 	= layer('programming').items;
	    	var services	 	= layer('services').items;
	    	var polygons	 	= layer('polygons').items;
	    	//----------------------------------------------------------------

	    	//----------------------------------------------------------------
	    	//--[ TOKEN TO OBJECT's
	    	_.each(realtimeData.drivers.items, function(driver){

	    		//SET REALTIME DATA INTO THE CURRENT DRIVER
	    		var _driver = _.find(drivers, {
					token: driver.conductor
				});
	    		_driver.vehiculo = _.find(vehicles, {
					token: driver.vehiculo
				});
				_driver.coordenadas = {
					latitud: driver.latitud,
					longitud: driver.longitud
				}

				var vehicle = _driver.vehiculo;
				vehicle.conductor = _driver;	// LOOP REFERENCE
	    	});

			_.each(realtimeData.points.items, function(point){
				
				point.vehiculo = _.find(vehicles, {
					token: point.vehiculo
				});
				point.conductor = _.find(drivers, {
					token: point.conductor
				});
				point.tipo = _.find(services, {
					token: point.tipo
				});

				if(point.poligono){
					point.poligono = _.find(polygons, {
						token: point.poligono
					});	
				}
				
				//------------------------------------------------------------
				// Programmed Route??
				var route = _.find(programming, {
					token: point.ruta
				});
				//------------------------------------------------------------

				//------------------------------------------------------------
				//Chequeo la condicion en "tiempo real del punto" de acuerdo al estado;
				var pin_icon 	= "";

				switch(point.estado){
					//ESTADO FALLIDOS
					case "PRFAL":
						pin_icon = "service-nok.png";
						break;	
					case "ADFAL":
						pin_icon = "service-nok-additional.png";
						break;
					case "SPFAL":
						pin_icon = "error-service-nok-additional.png";
						break;

					//ESTADOS REALIZADOS
					case "PRREA":
						pin_icon = "service-ok.png";
						break;	
					case "ADREA":
						pin_icon = "service-ok-additional.png";
						break;	
					case "SPREA":
						pin_icon = "error-service-ok-additional.png";
						break;

					//ESTADOS DE RETIRO
					case "PRRET":
						pin_icon = "service-retired.png";
						break;	
					case "ADRET":
						pin_icon = "service-retired-additional.png";
						break;
					case "SPRET":
						pin_icon = "error-service-retired.png";
						break;

					//ESTADO SIN IDENTIFICAR ??
					default:
						pin_icon = "service-unknown.png";
						break;
				}

				//Establece el Icono Final
				point.image = pin_url.format([ pin_icon ]);

				//Update Programming Route if State , with the new "state"
				if(route){
					route.estado = point.estado;
					route.image = point.image;
				}
				//------------------------------------------------------------

			});
	    	//----------------------------------------------------------------

			$scope.$broadcast("OnRealtimeDataReceived", realtimeData);

			realTimeTimer.restart();
		});
		
	};
    var realTimeTimer = $Timer(updateRealtime, $Configuration.get("monitor.realtime.frequency"));
    $scope.$on("$destroy", function(){
    	realTimeTimer.destroy();
    });
    //----------------------------------------------
 

    //----------------------------------------------
    // BOOTSTRAP (INITIALIZATION)
    var bootstrap = function(){
        var toolbars = $scope.data.toolbars.items;

   		//Mark all as Includes!
   		_.each(toolbars, function(layer){
   			if(layer.isLayer){

   				_.each(layer.items, function(item){
					item.$$selected = true;
   				});

   			}

   		});

   		filter();
    }
    //----------------------------------------------

    //----------------------------------------------
    // FILTER STEP
    var filter = function(){
		var layers 	= $scope.data.toolbars.items;
    	var layer 	= function(layer){ return layers[layer]; };
    	var map = $scope.gmap.getGMap();

    	//----------------------------------------------------------------
    	//RESET LAYERS
   		var hideLayer = function(layer){

   			_.each(layer.items, function(item){

				if(item.figure && item.figure.setMap){
					item.figure.setMap(null)
				}

			});

   		}
   		//----------------------------------------------------------------
    	
    	//----------------------------------------------------------------
    	//--[ LAYER ITEMS
    	var drivers 		= layer('drivers').items;
    	var programming	 	= layer('programming').items;
    	var polygons	 	= layer('polygons').items;
    	var points	 		= layer('points').items;
    	//----------------------------------------------------------------
    	
    	//----------------------------------------------------------------
    	//--[ GET ALL POLYGONS PROGRAMMED
    	var programmed_polygons = [];
    	var grouped_polygons = _.groupBy( _.pluck(programming, 'poligono'), function(pol){ 
			return pol.token 
		});
		for(var key in grouped_polygons){
			programmed_polygons.push(key);
		};
		//----------------------------------------------------------------

    	//----------------------------------------------------------------
    	// --[ FILTER: POLIGONOS
		if(layer('polygons').enabled){

			angular.forEach(polygons, function(item){
			

				//CHECK IF EXIST'S IN THE PROGRAMMING
				var programmed = _.contains(programmed_polygons, item.token);

				//IF NOT EXISTS IN PROGRAMMING, AND AT LEAST HAS ONE PROGRAMMING , HIDE!
				if(!programmed && 
					programming.length>0 && 
					item.tipo != "DISPOSICION_FINAL" &&
					item.tipo != "DISPOSICION_TEMPORAL" ){
					
					item.$$selected = false;
				}

				if(!item.$$selected){
					return;
				}

				//ALREADY EXISTS???
				if(item.figure != null){

					//SET MAP AGAIN TO SHOW
					if(item.figure.getMap() == null){
						item.figure.setMap(map);
					}

				}else{

					//DRAW POLYGON AND GET CENTER
					var coords = [];
					var bounds = new google.maps.LatLngBounds();
					angular.forEach(item.coordenadas, function(coord){

						var coord = new google.maps.LatLng(coord.lat, coord.lng);
						coords.push(coord);
						bounds.extend(coord);

					});

					var _figure = GoogleMapDrawingHelper.polygon(coords, map, {
						name: item.nombre,
						type: item.tipo,
						services: item.servicios
					}, true);

					// Click Event
					item.getCenter = function(){
						return bounds.getCenter();
					}
					item.details = function(){
						$mdSidenav('left-side-panel').open();
						$scope.toggleDetails("POLYGON", item);
					};
					item.navigate = function(){
						map.setCenter(item.getCenter());
					};

					google.maps.event.addListener(_figure.object, "click", function (e) { 
						item.details();
					});

					//ADD REERENCE
					item.figure = _figure.object;
				}
			});
			
		} else{
			//Only call if disabled to remove the "blink effect"
			hideLayer(layer('polygons'));
		}
		//----------------------------------------------------------------
		
		//----------------------------------------------------------------
    	// --[ FILTER: PROGRAMMING
		if(layer('programming').enabled){

			var url = pin_url.format(["programming-pending.png"]);
			var grouped_routes =_.groupBy(programming,  function(punto){

				punto.image = url;	//Default Image

	            return punto.poligono.token;
	        });
			
			_.each(grouped_routes, function(routes, index){

				var first_route = _.first(routes);

				//ALREADY EXISTS???
				if(first_route.figure != null){

					//SET MAP AGAIN TO SHOW
					if(first_route.figure.getMap() == null){
						first_route.figure.setMap(map);
					}

				}else{

					var polygon_center = first_route.poligono.getCenter();
					var coord 	= polygon_center;
					var _figure = new MarkerWithLabel({
						position: coord
						,icon: url
						,draggable:false
						,map: map
						,labelContent: routes.length
						,labelClass: "google-marker-programming"
						,labelAnchor: new google.maps.Point(5, 35)
					});
			
					//ADD REFERENCE
					_.each(routes, function(route){

						//Reference
						route.figure = _figure;

					});

				}
			});
		} else{
			//Only call if disabled to remove the "blink effect"
			hideLayer(layer('programming'));
		}
		//----------------------------------------------------------------
		
		//----------------------------------------------------------------
    	// --[ FILTER: CONDUCTORES
		if(layer('drivers').enabled){

			var url = pin_url.format(["vehicle.png"]);
			angular.forEach(drivers, function(item){

				if(!item.$$selected){
					return;
				}
				
				//ALREADY EXISTS???
				if(item.figure != null){

					//SET MAP AGAIN TO SHOW
					if(item.figure.getMap() == null){
						item.figure.setMap(map);
					}

				}else{

					//DRAW DRIVER PIN (null position , on Realtime received , will be updated)
					var _figure = new google.maps.Marker({
						position: null
						,icon: url
						,draggable:false
						,map: map
					});

					// Click Event
					item.details = function(){
						$mdSidenav('left-side-panel').open();
						$scope.toggleDetails("DRIVER", item);
					};
					item.navigate = function(){
						map.setCenter({
							lat: item.coordenadas.latitud,
							lng: item.coordenadas.longitud
						});

						//Animate
						if(item.figure){
							if( item.figure.animating ) { 
								return; 
							}

							setTimeout(function(){
								item.figure.setAnimation(null);
							}, 1440);

							item.figure.setAnimation(google.maps.Animation.BOUNCE);
						}
					};

					google.maps.event.addListener(_figure, "click", function (e) { 
						item.details();
					});

					//ADD REFERENCE
					item.figure = _figure;
				}

			});

		}else{
			//Only call if disabled to remove the "blink effect"
			hideLayer(layer('drivers'));
		}
		//----------------------------------------------------------------
		
		//----------------------------------------------------------------
    	// --[ FILTER: POINTS
		if(layer('points').enabled){

			angular.forEach(points, function(item){

				//ALREADY EXISTS??? (IF NOT , DRAW IN REALTIME STEP!, NOT HERE!!)
				if(item.figure != null){

					//SET MAP AGAIN TO SHOW
					if(item.figure.getMap() == null){
						item.figure.setMap(map);
					}

				}

			});

		}else{
			//Only call if disabled to remove the "blink effect"
			hideLayer(layer('points'));
		}
		//----------------------------------------------------------------
		
		//----------------------------------------------------------------
		//Call Inmediately the Function
		updateRealtime();
		//----------------------------------------------------------------
    };
    //----------------------------------------------

    $scope.$on("OnRealtimeDataReceived", function(ev, realtimeData){

    	var layer 			= function(layer){ return $scope.data.toolbars.items[layer]; };
    	var map 			= $scope.gmap.getGMap();

    	//----------------------------------------------------------------
    	//--[ LAYER ITEMS
    	var vehicles 		= layer('vehicles').items;
    	var drivers 		= layer('drivers').items;
    	var serviceTypes 	= layer('services').items;
    	var points 		 	= layer('points').items;
    	var programming	 	= layer('programming').items;
    	var services	 	= layer('services').items;
    	var polygons	 	= layer('polygons').items;
    	//----------------------------------------------------------------

    	//----------------------------------------------------------------
    	// --[ REALTIME: CONDUCTORES
		if(layer('drivers').enabled){
			angular.forEach(drivers, function(item){

				//Find RealTime data
				var realtimeItem = _.find(realtimeData.drivers.items, {
					conductor: item.token
				});

				//Exists??
				if(!realtimeItem || !item.figure){
					return;
				}

				//Fecha de Ultima Actividad
				item.ultimaActualizacion = realtimeItem.fecha;	

				//Change Position
				item.figure.setPosition(
					new google.maps.LatLng(realtimeItem.latitud, realtimeItem.longitud)
				)
				
			});
		}
		//----------------------------------------------------------------
		
		//----------------------------------------------------------------
    	// --[ REALTIME: PUNTOS REALIZADOS 
		if(layer('points').enabled){

			_.each(realtimeData.points.items, function(point){
				
				var exist = _.find(points, {
					token: point.token
				});

				//------------------------------------------------------------
				if(!exist){

					// PUNTO REALIZADO OK ??
					var _figure = new google.maps.Marker({
						position: new google.maps.LatLng(point.latitud, point.longitud)
						,icon: point.image
						,draggable:false
						,map: map
					});

					// Event's
					point.details = function(){
						$mdSidenav('left-side-panel').open();
						$scope.toggleDetails("POINT", point);
					};

					point.navigate = function(){
						map.setCenter({
							lat: point.latitud,
							lng: point.longitud
						});

						//Animate
						if(point.figure){
							if( point.figure.animating ) { 
								return; 
							}

							setTimeout(function(){
								point.figure.setAnimation(null);
							}, 1440);

							point.figure.setAnimation(google.maps.Animation.BOUNCE);
						}
					};
					google.maps.event.addListener(_figure, "click", function (e) { 
						point.details();
					});

					//Reference
					point.figure = _figure;

					points.push(point);
				}else{

					//UPDATE CHANGE IN THE EXIST POINT
					exist.estado 	= point.estado;
					exist.image 	= point.image;
					exist.nombre 	= point.nombre;
					exist.fecha 	= point.fecha;

					point = exist;
					if(point.figure.getMap() == null){
						point.figure.setMap(map);	//Re-show
					}
				}
				//------------------------------------------------------------

				

				//------------------------------------------------------------
				//Establece el Icono Final
				point.figure.setIcon(point.image);
				//------------------------------------------------------------

			});
			
		}
		//----------------------------------------------------------------
		

		//----------------------------------------------------------------
    	// --[ REALTIME: ACTUALIZACION DE FIGURAS DE 
    	// --[ PROGRAMACIÓN DE ACUERDO A LOS SERVICIOS YA REALZIADOS
		if(layer('programming').enabled){

			var grouped_routes =_.groupBy(programming,  function(punto){
	            return punto.poligono.token;
	        });
			
			_.each(grouped_routes, function(routes, index){

				var first_route = _.first(routes);
				var pendings = _.filter(routes, function(route){

					return  route.estado == "PROGR" ||
							route.estado == "PRRET"

				});

				if(first_route.figure){
					//ACTUALIZA EL ESTADO DE LA PROGRAMACIÓN
					 first_route.figure.set("labelContent", (pendings.length + "") );

					 //SI NO HAY MAS PENDIENTES 
					 if(pendings.length == 0){
					 	var url = "bundles/app/css/images/pines/programming-complete.png";
					 	first_route.figure.setIcon(url);
					 }

				}else{
					//ADICIONAL??
				}

			});
	
		}
		//----------------------------------------------------------------


		//------------------------------------------------
		//--[ GET PROGRAMMING KPI'S
	 	var total_pendings  = 0;
        angular.forEach(programming, function(route){

            switch(route.estado){
            	case "PROGR":
            	case "PRRET":
            		total_pendings += 1;
            		break;
            }

        });

		var percent = (total_pendings * 100 / programming.length ); 
		$scope.data.chart = {
			options: {
               thickness: 10, 
               mode: "gauge", 
               total: 100
            },

			data: [
				{
					label: null, 
					value: Math.round( 100 - (isNaN(percent) ? 100 : percent) ), 
					color: "#2196F3", 
					suffix: "%"
				}
			],

			pendings: total_pendings
		};
		//------------------------------------------------
    });  

    //----------------------------------------------
    // VIEW ACTION'S
    $scope.togleRightMenu = function(item){
		$scope.data.toolbars.selected = item;

		$mdSidenav('right-side-panel').toggle();
    };

    $scope.togleLeftMenu = function(item){
		$mdSidenav('left-side-panel').toggle();
    };

    $scope.toggleLayer = function(layer){
		layer.enabled = !layer.enabled;

		filter();
    };

    $scope.toggleDetails = function(type, data){
    	var label = "";

		switch(type){
			case "POLYGON":
				label = "Información Polígono";
				break;
			case "POINT":
				label = "Información Retiro";
				break;
			case "DRIVER":
				label = "Información Conductor";
				break;
		}

    	$scope.data.details = {
    		type: type,
    		data: data,
    		label: label
    	};
    }

    //UI NAVIGATION
    $scope.UIKeyDown = function(ev, keyCode){
    	var toolbars = $scope.data.toolbars;
    	var panel 	 = $mdSidenav('right-side-panel'); 
    	switch(keyCode){
    		case 66: //B = Finder
    			setTimeout(function(){
    				$scope.finder.show();	
    			}, 100)
    			break;
			case 67: //C = Conductores
				toolbars.selected = toolbars.items["drivers"];
				panel.toggle();
    			break;
			case 80: //P = Programación
				toolbars.selected = toolbars.items["programming"];
				panel.toggle();
    			break;
			case 83: //S = Polígonos
    			break;
			case 82: //R = Retiros
				toolbars.selected = toolbars.items["points"];
				panel.toggle();
    			break;

    	}

    }

    // FINDER COMPONENT
    $scope.finder = {

    	show: function(){
    		Finder.show()
    	},

    	search: function(query){
	    	var results 	= [];
	    	var findTerm 	= query.toLowerCase();
	    	var layer 		= function(layer){ return $scope.data.toolbars.items[layer]; };

	    	//----------------------------------------------------------------
	    	//--[ LAYER ITEMS
	    	var vehicles 		= layer('vehicles').items;
	    	var drivers 		= layer('drivers').items;
	    	var points 		 	= layer('points').items;
	    	var polygons	 	= layer('polygons').items;
	    	var programming	 	= layer('programming').items;
	    	//----------------------------------------------------------------
	    	
	    	//FIND IN POLYGONS
			_.each(polygons, function(polygon){

				var identifier = polygon.nombre.toLowerCase() +
								 "polígonos"

				if(identifier.indexOf(findTerm)>=0){
					results.push({
		    			icon: $filter("restricted")(polygon.imagen),
		    			name: polygon.nombre,
		    			reference: polygon,
		    			type: "Polígono"
		    		});
	    		}
			});

			//FIND IN DRIVERS
			_.each(drivers, function(driver){

				var identifier = driver.nombre.toLowerCase()	+
								 'conductores'

				if(identifier.indexOf(findTerm)>=0){
					results.push({
		    			icon: $filter("restricted")(driver.imagen),
		    			name: driver.nombre,
		    			reference: driver,
		    			type: "Conductor"
		    		});
	    		}
			});

			//FIND IN DRIVERS
			_.each(vehicles, function(vehicle){

				var identifier = vehicle.patente.toLowerCase() +
								 "vehículos"

				if(identifier.indexOf(findTerm)>=0){
					results.push({
		    			icon: $filter("restricted")(vehicle.imagen),
		    			name: vehicle.patente,
		    			reference: vehicle,
		    			type: "Vehículo"
		    		});
	    		}
			});

			//FIND IN POINT, BY SERVICE
			_.each(points, function(point){

				var _poligono = (point.poligono ? point.poligono.nombre : "");
				var identifier = point.tipo.nombre.toLowerCase() +
								 point.nombre.toLowerCase() +
								 _poligono.toLowerCase()  + 
								 "retiros" +
								 "puntos";

				if(identifier.indexOf(findTerm)>=0){
					results.push({
		    			icon: 	$filter("restricted")(point.imagen),
		    			name: 	"{0} ({1} - {2})".format([
			    					point.tipo.nombre,
			    					_poligono,
			    					point.nombre
	    					  	]),
		    			reference: point,
		    			type: 	"Retiro Realizado"
		    		});
	    		}
			});

			//FIND IN PROGRAMMING, (STATE PROG)
			_.each(programming, function(program){
				
				var identifier = program.tipo.nombre.toLowerCase() + 
								 program.poligono.nombre.toLowerCase() + 
								 "programación"

				if(program.estado == "PROGR"){
					if(identifier.indexOf(findTerm)>=0){
						results.push({
			    			icon: 	program.image,
			    			name: 	"{0} ({1})".format([
				    					program.tipo.nombre,
				    					program.poligono.nombre
		    					  	]),
			    			reference: program,
			    			type: 	"Retiro Programado"
			    		});
		    		}
	    		}
			});

	    	return results;
    	},

    	select: function(item){
	    	var ref = item.reference;

	    	switch(item.type.toUpperCase()){
	    		case "POLÍGONO":
	    		
	    			if(ref.$$selected){
		    			ref.navigate();
		    			ref.details();
	    			}else{
	    				$mdToast.show(
							$mdToast.simple()
							.content("El polígono no se encuentra programado")
							.position("bottom left")
							.theme('exception')
							.hideDelay(3000)
						);
						return false;
	    			}
	    			break;
				case "CONDUCTOR":
					//ACTIVO??
					if(ref.coordenadas){

						ref.navigate();
						ref.details();

					}else{

						$mdToast.show(
							$mdToast.simple()
							.content("No se encuentra activo el conductor")
							.position("bottom left")
							.theme('exception')
							.hideDelay(3000)
						);
						return false;

					}
					
	    			break;
				case "VEHÍCULO":
					//ACTIVO??
					if(ref.conductor){

						ref = ref.conductor;
						ref.navigate();
						ref.details();	

					}else{

						$mdToast.show(
							$mdToast.simple()
							.content("No se encuentra activo el vehículo")
							.position("bottom left")
							.theme('exception')
							.hideDelay(3000)
						);
						return false;
					}
	    			break;
    			case "RETIRO REALIZADO":
	    			ref.navigate();
	    			ref.details();
	    			break;
    			case "RETIRO PROGRAMADO":
	    			ref.poligono.navigate();
	    			ref.poligono.details();
	    			break;
	    	}

	    	return true;
	    }
    }
    //----------------------------------------------
    
    
});

