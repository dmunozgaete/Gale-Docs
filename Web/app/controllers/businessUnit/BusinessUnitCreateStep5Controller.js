angular.module('app.controllers')

.controller('BusinessUnitCreateStep5Controller', function (	
	$scope, 
	$state,
	$stateParams,
	$window,
	$log,
	$Api,
	$Localization,
	$Configuration,
	GoogleMapDrawingHelper,
	$mdDialog,
	$timeout,
	$q,
	$mdSidenav,
	Finder,
	$filter,
	$rootScope
){

	//------------------------------------------------------------------
	// (Override the businessUnit header)
	var businessUnit 		= $stateParams.businessUnit;
	var header 				= $Configuration.get("customHeaders")["businessUnit"];
	var customHeaders 		= {};
	customHeaders[header] 	= businessUnit;
	//------------------------------------------------------------------
	
	//------------------------------------------------
	// MODEL
    $scope.data = {
    	polygons: null,
    	types: [],
    	services: []
    }
	//------------------------------------------------
	
	//------------------------------------------------
	//PROMISES
	var polygonTypePromise 	= $q.defer();
    var servicePromise 		= $q.defer();
	var polygonsPromise 	= $q.defer();
	//------------------------------------------------

	//----------------------------------------------
	//GET POLYGON TYPES
	$Api.Read('/PolygonType')
	.success(function(data){
		polygonTypePromise.resolve(data.items);
	});
	
	//GET SERVICE TYPES
	$Api.Read('/BusinessUnit/Services', {}, customHeaders)
	.success(function(data){
		servicePromise.resolve(data.items);
	});
	
	//GET CREATED POLYGONS
	$Api.Read('/BusinessUnit/Polygons', {}, customHeaders)
	.success(function(data){

		var viewport_promise = $q.defer();
		viewport_promise.promise.then(function(viewport){

			data.viewport = viewport;
			polygonsPromise.resolve(data);

		});
		
		if(!data.viewport.latitud || !data.viewport.longitud){
			
			$mdDialog.show({
				controller: 'ViewSetupModal',
				escapeToClose: false,
				templateUrl: 'views/businessUnit/step-5/view-setup.html',
				clickOutsideToClose: false
			}).then(function(viewport){

				viewport_promise.resolve(viewport);

			});

		}else{

			viewport_promise.resolve({
				latitude: data.viewport.latitud,
				longitude: data.viewport.longitud,
				zoom: data.viewport.zoom
			});
		}

	});	
	//----------------------------------------------


	//------------------------------------------------
	//WAITING FOR PROMISE TO LOAD THE GOOGLE MAPS
	$q.all([
		polygonTypePromise.promise, 
		servicePromise.promise, 
		polygonsPromise.promise
	]).then(function(resolves){

		var types 	 = resolves[0];
		var services = resolves[1];
		var polygons = resolves[2].polygons;
		var viewport = resolves[2].viewport;

		// EXTEND SCOPE
		angular.extend($scope.data, {
			types: types,
			services: services,
			viewport: viewport,
			polygons: polygons
		});

		$scope.gmap  = GoogleMapDrawingHelper.setup($scope);	//Normalize and some fix's

		//------------------------------------------------
		//--[ ADD EVENT ON MAP LOADED
		$scope.$on("gmaps.mapLoaded",function(ev, map){

			//For each polygon , create an GMap Polygon
			angular.forEach(polygons, function(polygon){
				
				var coords = [];
				var bounds = new google.maps.LatLngBounds();

				// Get Coordinates
				angular.forEach(polygon.coordenadas, function(coord){
					var coord = new google.maps.LatLng(coord.lat, coord.lng);
					coords.push(coord);
					bounds.extend(coord);
				});

				// Get Services
				var servicios = [];
				angular.forEach(polygon.servicios, function(service){
					servicios.push(_.find(services, {
						token : service
					}));
				});
				polygon.servicios = servicios;
				

				// Get Type
				polygon.tipo = _.find(types, {
					identificador : polygon.tipo
				});
				

				// Add to Configured Polygons
				var _figure = GoogleMapDrawingHelper.polygon(coords, map, {
					name: polygon.nombre,
					type: polygon.tipo.identificador,
					services: polygon.servicios,
					reference : polygon
				});

				// Click Event
				polygon.getCenter = function(){

					// Always re-generate if polygon has moved
					var bounds = new google.maps.LatLngBounds();
					angular.forEach(_figure.getCoordinates(), function(coord){
						var coord = new google.maps.LatLng(coord.lat, coord.lng);
						bounds.extend(coord);
					});

					return bounds.getCenter();
				}
				polygon.details = function(){
					polygon.navigate();

					_figure.setEditable(true);
					$scope.details("POLYGON", polygon);
				};
				polygon.navigate = function(){
					map.setCenter(polygon.getCenter());
				};

				polygon.figure = _figure;
			});

			var polygon_click = function(event,polygon){
				var reference = polygon.information.reference;

				// YA EXISTIA UN POLIGONO EN EDICIÓN??
				var details = $scope.data.details;
				if(details && details.type == "POLYGON"){
					var editedPolygon = details.data;

					//VERIFICO QUE NO SEA EL MISMO POLIGONO AL CUAL SE LE HIZO CLICK
					if(editedPolygon == reference){
						return;	//NO HACEMOS NADA
					}

					// VERIFICO QUE EL POLIGONO QUE ESTABA SIENDO EDITADO , SE 
					// ENCUENTRA "MODIFICADO" (DIRTY)
					if(details.dirty){
						
						// Delete Confirm
				        $mdDialog.show(
				            $mdDialog.confirm()
				            .ariaLabel('')
				            .targetEvent(event)
				            .title("Polígono en Edición")
				            .content([
				            	"Ya se encuentra editando un polígono",
				            	"\t\n",
				            	"¿Está seguro de perder los cambios?"
			            	].join(""))
				            .ok("Perder Cambios")
				            .cancel($Localization.get('DELETE_CONFIRM_CANCEL_LABEL'))
				        ).then(function() {

							//CANCEL
							editedPolygon.figure.setEditable(false);
							editedPolygon.restore();

							reference.details();

						});

					}else{
						//CANCEL
						editedPolygon.figure.setEditable(false);

						reference.details();
					}
				}else{

					reference.details();

				}

			}

			$scope.$on('gmaps.polygon.click', polygon_click);
			
			$scope.$on('gmaps.polygon.created', function(event, rawPolygon) {
					
				//Default
				var polygon = {
					nombre: "",
					tipo: null,
					servicios: [],
					coordenadas: rawPolygon.getCoordinates()
				};

				// Click Event
				polygon.getCenter = function(){

					// Always re-generate if polygon has moved
					var bounds = new google.maps.LatLngBounds();
					angular.forEach(rawPolygon.getCoordinates(), function(coord){
						var coord = new google.maps.LatLng(coord.lat, coord.lng);
						bounds.extend(coord);
					});

					return bounds.getCenter();
				}

				polygon.details = function(){
					polygon.navigate();
					rawPolygon.setEditable(true);
					$scope.details("POLYGON", polygon);
				};

				polygon.navigate = function(){
					map.setCenter(polygon.getCenter());
				};

				polygon.figure = rawPolygon;
				rawPolygon.information.reference = polygon;
				
				polygon.details();

				
			});

			angular.forEach([
				'gmaps.polygon.dragend', 
				'gmaps.polygon.editing'
			], function(value) {
				$scope.$on(value, function(event) {
					var data = $scope.data;

					if(data.details && data.details.type == "POLYGON"){
						data.details.dirty = true;
						try{ $scope.$apply(); }catch(ex){}
					}
				});
			});

			//Redrawing MAP FIX
			var x = map.getZoom();
			var c = map.getCenter();
			google.maps.event.trigger(map, 'resize');
			map.setZoom(x);
			map.setCenter(c);

		});	
		//------------------------------------------------
			
	})
	//------------------------------------------------
	
	$rootScope.$on("$mdSideNavChange", function(ev, component, isOpen){
		
		//Remove Edited Polygons if clicked 
		var data = $scope.data;
		if(isOpen == false && data.details && data.details.type == "POLYGON"){
			
			var _polygon = data.details.data.figure;
			_polygon.setEditable(false);

			data.details =null;
		}

	});	
	
    //------------------------------------------------
    //--[ VIEW ACTION'S
    $scope.toggleMenu = function(){
    	$mdSidenav('left-side-panel').toggle();
    };

    $scope.details = function(type, ref){
    	var data 	= $scope.data;
    	var label 	= "";

    	switch(type){
    		case "POLYGON":
    			label = "Información Polígono";
    			break;
			case "LIST":
    			label = "Polígonos";
    			break;
    	}

    	data.details = {
    		type: type,
    		data: ref,
    		label: label
    	};

    	$mdSidenav('left-side-panel').open();
    };

	$scope.back = function(){
		$window.history.back();
	}

	//------------------------------------------------
	//UI NAVIGATION
    $scope.UIKeyDown = function(ev, keyCode){

    	if(!$mdSidenav('left-side-panel').isOpen()){

    		var toolbars = $scope.data.toolbars;
	    	switch(keyCode){
	    		case 66: //B = Finder
	    			setTimeout(function(){
	    				$scope.finder.show();	
	    			}, 100);
	    			break;
    			case 80: //P = POLIGONOS
	    			$scope.details('LIST', $scope.data.polygons);
	    			break;
	    	}

    	}

    }

	//------------------------------------------------
	// FINDER COMPONENT
    $scope.finder = {

    	show: function(){
    		Finder.show()
    	},

    	search: function(query){
	    	var results 	= [];
	    	var findTerm 	= query.toLowerCase();
	    	var polygons 	= $scope.data.polygons;
	    
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

	    	return results;
    	},

    	select: function(item){
    		if(!item){
    			return;
    		}

	    	var ref = item.reference;
	    	
	    	switch(item.type.toUpperCase()){
	    		case "POLÍGONO":
	    	
	    			ref.details();
	    			break;
	    	}

	    	return true;
	    }
    }

});

