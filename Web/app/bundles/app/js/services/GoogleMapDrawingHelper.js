angular.module('app.services')	

.factory('GoogleMapDrawingHelper', function (uiGmapGoogleMapApi, $log, $timeout, $document) {
	var self = this;
	var $scope = null;	//Controller Scope
	var googleApi = null;	//api Maps
	var _viewport = {};
	var currentZIndex = 1000;

	var _options = {
		Polygon: {
			fillColor: "#A5D6A7",
			strokeColor: "#4CAF50",
			strokeWeight: 4,
			editable: false,
			draggable: false
		}
	}
	var wrapPolygon = function(GPolygon, map){
		if(GPolygon.wrapped){
			return;
		}
		

		var polygon = {
			information: {
				type: "NONE",
				name: "",
				services: []
			},
			map: map,
			object: GPolygon,

			//gmaps-samples-v3.googlecode.com/svn/trunk/drawing/drawing-tools.html
			changeType: function(type){
				var style = {};

				switch(type){
					case "SERVICIO":
						style = {
							fillcolor: '#FFFFFF',
							strokeColor: '#2196F3'
						};
						break;
					case "DISPOSICION_TEMPORAL":
						style = {
							fillcolor: '#FFFDE7',
							strokeColor: '#FFEB3B'
						};
						break;
					case "DISPOSICION_FINAL":
						style = {
							fillcolor: '#FFCDD2',
							strokeColor: '#F44336'
						};
						break;
					case "ADICIONAL":
						style = {
							fillcolor: '#C5E1A5',
							strokeColor: '#8BC34A'
						};
						break;
					case "NONE":
						style = {
							fillcolor: '#A5D6A7',
							strokeColor: '#4CAF50'
						};
						break;
				}
				
				for(var rule in style){
					GPolygon.set(rule, style[rule]);
				}

				polygon.information.type = type;

				return polygon;
			},

			setType: function(value){
				return polygon.changeType(value);
			},

			getType: function(){
				return polygon.information.type;
			},

			remove: function(){
				GPolygon.setMap(null);
			},

			getEditable: function(){
				return GPolygon.getEditable();
			},

			mark: function(){

				//Set Top z-index
				currentZIndex++;
				GPolygon.setOptions({ zIndex: currentZIndex });
				
				//CHANGE COLOR TO EDIT COLOR
				GPolygon.set("fillcolor", "#E91E63");
				GPolygon.set("strokeColor", "#E91E63");
			},

			unMark: function(){
				polygon.setType(polygon.getType());
			},

			setEditable: function(value){

				if(value){
					polygon.mark();
					
				}else{
					polygon.unMark();
				}
				
				GPolygon.setDraggable(value);
				GPolygon.setEditable(value);
			},

			getDraggable: function(){
				return GPolygon.getDraggable();
			},

			setDraggable: function(value){
				return GPolygon.setDraggable(value);
			},

			getCoordinates: function(){
				//------------------------------------------------
				//Get Coords
				var coords = [];
				angular.forEach(GPolygon.getPath().getArray(), function(coord){
					coords.push({
						lat: coord.lat(),
						lng: coord.lng()
					});
				});
				//------------------------------------------------
				
				return coords;
			},

			setCoordinates: function(coords){
				var map = polygon.map;
				GPolygon.setMap(null); //makes polygon "invisible"/ removes
                GPolygon.setPaths(coords);
                GPolygon.setMap(map);

                //RESET EVENT'S
				google.maps.event.addListener(GPolygon.getPath(), 'set_at', function() {
					$scope.$broadcast("gmaps.polygon.editing", polygon);
				});

				google.maps.event.addListener(GPolygon.getPath(), 'insert_at', function() {
					$scope.$broadcast("gmaps.polygon.editing", polygon);
				});

			}


		};


		//WRAP EACH GMAP POLYGON INTO A CUSTOM STRUCTURE
		google.maps.event.addListener(GPolygon, 'click', function (ev) {
			$scope.$broadcast("gmaps.polygon.click", polygon);
		});

		google.maps.event.addListener(GPolygon, 'dblclick', function (ev) {
			$scope.$broadcast("gmaps.polygon.dblclick", polygon);
		});

		google.maps.event.addListener(GPolygon, 'drag', function (ev) {
			$scope.$broadcast("gmaps.polygon.drag", polygon);
		});

		google.maps.event.addListener(GPolygon, 'dragstart', function (ev) {
			$scope.$broadcast("gmaps.polygon.dragstart", polygon);
		});

		google.maps.event.addListener(GPolygon, 'dragend', function (ev) {
			$scope.$broadcast("gmaps.polygon.dragend", polygon);
		});

		google.maps.event.addListener(GPolygon, 'rightclick', function (ev) {
			$scope.$broadcast("gmaps.polygon.rightclick", polygon);
		});

		google.maps.event.addListener(GPolygon, 'mousedown', function (ev) {
			$scope.$broadcast("gmaps.polygon.mousedown", polygon);
		});

		google.maps.event.addListener(GPolygon, 'mousemove', function (ev) {
			$scope.$broadcast("gmaps.polygon.mousemove", polygon);
		});

		google.maps.event.addListener(GPolygon, 'mouseout', function (ev) {
			$scope.$broadcast("gmaps.polygon.mouseout", polygon);
		});

		google.maps.event.addListener(GPolygon, 'mouseover', function (ev) {
			$scope.$broadcast("gmaps.polygon.mouseover", polygon);
		});

		google.maps.event.addListener(GPolygon, 'mouseup', function (ev) {
			$scope.$broadcast("gmaps.polygon.mouseup", polygon);
		});

		google.maps.event.addListener(GPolygon.getPath(), 'set_at', function() {
			$scope.$broadcast("gmaps.polygon.editing", polygon);
		});

		google.maps.event.addListener(GPolygon.getPath(), 'insert_at', function() {
			$scope.$broadcast("gmaps.polygon.editing", polygon);
		});



		$scope.$broadcast("gmaps.polygon.created", polygon);

		_polygons.push(polygon);	//ADD TO COLLECTION

		GPolygon.wrapped = true;
		return polygon;
	}

	self.hasDrawingManager = function(){
		return ($scope.gmap.getDrawingManager ? true: false);
	}

	self.getDrawingManager = function(){
		return $scope.gmap.getDrawingManager();
	}

    self.setup = function(scope, viewport){
    	$scope = scope;

    	if(viewport){
    		_viewport = viewport;
    	}
    	//------------------------------------------------
    	//ENVIRONMENT SETUP
    	var onKeyDown = function(e) {
    		if(self.hasDrawingManager()){
				var drawingManager = self.getDrawingManager();

				//CHARCODE: 'S'
				if(e.which == 83){
					//Toggle Drawing Mode to HAND or POLYGON
					var drawingMode = drawingManager.getDrawingMode();
					drawingManager.setDrawingMode(drawingMode ? null : google.maps.drawing.OverlayType.POLYGON);
				}
			}
		}

    	$scope.$on("$destroy", function(){
			$document.unbind('keydown', onKeyDown);
		});

		$document.bind('keydown', onKeyDown);
    	//------------------------------------------------

    	//------------------------------------------------
    	$scope.$on("gmaps.drawingLoaded", function(ev,drawingManager){

    		//https://developers.google.com/maps/documentation/javascript/reference#DrawingManagerOptions
			drawingManager.setOptions({
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_RIGHT,

					drawingModes: [
						google.maps.drawing.OverlayType.POLYGON
					],
				},

				//https://developers.google.com/maps/documentation/javascript/reference#PolygonOptions
				polygonOptions: _options.Polygon
			});
		});
		//------------------------------------------------


    	//------------------------------------------------
		$scope.$on("gmaps.polygon.created", function(ev, polygon){
			if(self.hasDrawingManager()){
				var drawingManager = self.getDrawingManager();

				//Set Drawing Mode to HAND
				drawingManager.setDrawingMode(null);
			}
		});
		//------------------------------------------------



		//------------------------------------------------
		// uiGmapGoogleMapApi is a promise.
	    // The "then" callback function provides the google.maps object.
	    uiGmapGoogleMapApi.then(function(maps) {

    		//------------------------------------------------
			//GOOGLE MAP INITIAL CONFIGURATION
			$scope.gmap = {
					
				viewport: _viewport,

				options: {
					overviewMapControl: false,
					mapTypeControl: false, 
					streetViewControl: false,
					mapTypeId: google.maps.MapTypeId.SATELLITE,
					zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_BOTTOM
					},
					panControlOptions : {
						position: google.maps.ControlPosition.RIGHT_BOTTOM
					}
				},
			
				drawingManager: {
					options: {
						static: true
					}
				}
			}
			//------------------------------------------------
			
	    	//NOT HAVE A NICE WAY TO DO THIS!!!! :()
	    	var checkDrawingManager = function(){
	    		if($scope.gmap.getDrawingManager == null){
					$timeout(function() {
						checkDrawingManager();
					}, 250);
					return;
				}


				//NORMALIZE EVENT'S
				var drawingManager = self.getDrawingManager();
				google.maps.event.addListener(drawingManager, 'polygoncomplete', function (GPolygon) {

					wrapPolygon(GPolygon, $scope.gmap.getGMap());

				});

				$scope.$broadcast("gmaps.drawingLoaded", drawingManager);
	    	}

	    	checkDrawingManager();

	    	var checkGmap = function(){

	    		if($scope.gmap.getGMap == null){
					$timeout(function() {
						checkGmap();
					}, 250);
					return;
				}

				var map =  $scope.gmap.getGMap();
				$scope.$broadcast("gmaps.mapLoaded",map);

				//Redrawing MAP FIX
				//var x = map.getZoom();
				//var c = map.getCenter();
				google.maps.event.trigger(map, 'resize');
				//map.setZoom(x);
				//map.setCenter(c);
	    	}

	    	checkGmap();

	    	googleApi = maps;
	    });
	    //------------------------------------------------
	    

		return $scope.gmap;
    }

    self.polygon = function(coords, map, information){


    	var options = angular.copy(_options.Polygon);
    	options.paths = coords;

    	var GPolygon = new google.maps.Polygon(options);

		GPolygon.setMap(map);

		var wrapped = wrapPolygon(GPolygon, map);
		if(information){
			wrapped.information = information;

			if(information.type){
				wrapped.changeType(information.type);
			}
		}

    	return wrapped;
    }

    var _polygons = [];
    self.getPolygons = function(){
    	return _polygons;
    }	


    self.getViewCoordinates = function(){
    	var map = $scope.gmap.getGMap();
    	var coords =  map.getCenter();
    	
    	return {
    		lat: coords.lat(),
    		lng: coords.lng(),
    		zoom: map.getZoom()
    	}
    }

    return self;

});