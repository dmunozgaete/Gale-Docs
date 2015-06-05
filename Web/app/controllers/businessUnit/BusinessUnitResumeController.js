angular.module('app.controllers')

.controller('BusinessUnitResumeController', function (	
	$scope, 
	$state,
	$Api,
	$q,
    GoogleMapDrawingHelper,
    Identity
){

	//----------------------------------------------
    //PROMISES
    var resumePromise  = $q.defer();
    //----------------------------------------------

    //------------------------------------------------
	//MODEL
	$scope.data = {};
	//------------------------------------------------
	
	//----------------------------------------------
    //--[ GET POLYGONS FROM BUSINESSUNIT
    $Api.Read('/BusinessUnit/Resume')
    .success(function(data){
        resumePromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // WAITING FOR PROMISE TO LOAD THE GOOGLE MAPS
    $q.all([
        resumePromise.promise
    ]).then(function(resolves){
    	var resume = resolves[0];

    	$scope.loadCompleted = true;
    	
    	// Extend Data
    	angular.extend($scope.data, {
    		businessUnit: resume
    	});

       $scope.viewport = {
            latitude: resume.latitud,
            longitude: resume.longitud,
            zoom: resume.zoom
        }
        $scope.gmap = GoogleMapDrawingHelper.setup($scope);

        //------------------------------------------------
        //--[ ADD EVENT ON MAP LOADED
        $scope.$on("gmaps.mapLoaded",function(ev, map){
            //Redrawing MAP FIX
            var x = map.getZoom();
            var c = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setZoom(x);
            map.setCenter(c);
        });
        //------------------------------------------------

    });
	//----------------------------------------------
    
});