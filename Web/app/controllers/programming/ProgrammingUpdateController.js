angular.module('app.controllers')

.controller('ProgrammingUpdateController', function (
    $scope, 
    $state, 
    $Api, 
    $stateParams,
    $q,
    $window,
    $log,
    Identity
) {
    var datosPerfil = Identity.get();


    //----------------------------------------------
    //--[ PROMISES
    var programmingPromise  = $q.defer();
    //----------------------------------------------

    //----------------------------------------------
    //--[ MODEL
    $scope.data = {
        date: new Date($stateParams.month),
        activeDay: null,
        isClient : false
    };
    debugger;
    if(datosPerfil.role === "CLIEN"){
        
        $scope.data.isClient = true;

    }
    //----------------------------------------------

    //----------------------------------------------
    //--[ GET PROGRAMMING
    $Api.invoke('GET','/Programming/Details',{
        month: $stateParams.month,
        type:  $stateParams.service
    })
    .success(function(data){
        programmingPromise.resolve(data);
    });
    //----------------------------------------------
    
    //----------------------------------------------
    // WAITING FOR PROMISE TO LOAD THE GOOGLE MAPS
    $q.all([
        programmingPromise.promise
    ]).then(function(resolves){
        var data = $scope.data;
        var service = resolves[0];

        var currentMonth = data.date; 
        var year = currentMonth.getFullYear();
        var month = currentMonth.getMonth();
        var lastDayNumber = new Date(year, month + 1, 0).getDate();
        var calendar = [];

        for(var day= 1; day <= lastDayNumber; day ++){
            calendar.push({
                ordinal: day
            });
        }

        angular.forEach(service.polygons, function(polygon){

            var days = [];
            for(var day= 1; day <= lastDayNumber; day ++){
                days.push({
                    ordinal: day,
                    programmed: _.contains(polygon.dias, day)
                })
            }

            polygon.calendar = days;
       });

         angular.extend(data, {
            service : service,
            calendar: calendar,
            filteredPolygons: _.filter(service.polygons, function(s){return s})
        });

    });
    //----------------------------------------------
    
   //$scope.loadCompleted = true;    //Stop Progress Linear Loading!

    //------------------------------------------
    //VIEW ACTION'S
    $scope.filter = function(query){
        var data = $scope.data;
        var query = query.toLowerCase();

        data.filteredPolygons = _.filter(data.service.polygons, function(s){
            return s.nombre.toLowerCase().indexOf(query) >= 0;
        });
    }

    $scope.back = function(){
        $state.go("app.administration-programming", {
            month: $scope.data.date.toISOString()
        });
    }

    $scope.save = function(){
        var data = $scope.data;
        var programming = [];

        angular.forEach(data.service.polygons, function(polygon){
            
            var program = {
                poligono: polygon.token,
                dias: []
            }

            angular.forEach(polygon.calendar, function(day){

                if(day.programmed){
                    program.dias.push(day.ordinal);
                }

           });

            programming.push(program);
       });

        //Send PROGRAM
        $Api.Create('/Programming/', 
        {
            month: data.date.toISOString(),
            program: programming,
            type: data.service.token
        })
        .success(function(data){
            $scope.back();
        });

    }
    //------------------------------------------

});