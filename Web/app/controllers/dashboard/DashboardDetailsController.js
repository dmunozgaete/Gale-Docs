angular.module('app.controllers')

.controller('DashboardDetailsController', function (
   $log, 
   $state, 
   $scope, 
   $Api, 
   $window,
   $stateParams,
   $timeout
){

   //----------------------------------------------
   $Api.invoke('GET', '/Dashboard/Details?date={0}'.format([
     $stateParams.date
   ]))
   .success(function(data){
      var timeout = $timeout(function(){
      
         $scope.charts = {
            options: {
               thickness: 200
            },

            <!-- -->
            general: [
               {
                  label: 'Realizados', 
                  value: data.information.realizados,
                  color: '#4CAF50'
               },

               {
                  label: 'Fallidos', 
                  value: data.information.fallidos,
                  color: '#F44336'
               },

               {
                  label: 'Pendientes', 
                  value: (data.information.total),
                  color: '#FFC107'
               }
            ]
            <!-- -->
         };

         $timeout.cancel(timeout);
      },500);


      $scope.data = data;
   });
   //----------------------------------------------
 
   $scope.back = function(){
      $window.history.back();
   }

});