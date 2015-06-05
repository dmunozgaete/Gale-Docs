angular.module('app.controllers')

.controller('DashboardController', function ($log, $state, $scope, $Api, $interval, $timeout){

   $scope.data = {
      date: new Date()
   }

   var createChart = function(data, color){
      return [
         {
            label: null, 
            value: Math.round( isNaN(data) ? 0 : data ), 
            color: (color||"#FF5722"), 
            suffix: "%"
         }
      ]
   }

   var refresh = function(){
      //----------------------------------------------
      $Api.invoke('GET', '/Dashboard/?date={0}'.format([
        $scope.data.date.toISOString()
      ]))
      .success(function(data){
         $log.log($scope.data);
         $scope.charts = {
            options: {
               thickness: 5, 
               mode: "gauge", 
               total: 100
            },
            <!-- -->
            general: createChart(
                        ((data.programmed.realized + data.programmed.failed + data.additional.realized + data.additional.failed) * 100) / ((data.programmed.total) + (data.additional.total)) ,
                        "#FFFFFF"
                     ),
            <!-- -->
            programmed: {
               realized: createChart(
                           (data.programmed.realized * 100) / data.programmed.total
                        ),
               failed:  createChart(
                           (data.programmed.failed * 100) / data.programmed.total
                        )
            },
            <!-- -->
            realized: {
               realized: createChart(
                           (data.additional.realized * 100) / data.additional.total
                        ),
               failed:  createChart(
                           (data.additional.failed * 100) / data.additional.total
                        )
            }
            <!-- -->
         };
         //SET CHART DATA FOREACH DRIVER
         angular.forEach(data.drivers, function(driver){

            driver.chart = {
               data: createChart(
                  (driver.services.totalprogramados+driver.services.totaladicionales) == 0?1:(driver.services.programadosrealizados+driver.services.programadosfallidos+driver.services.totaladicionales)*100/(driver.services.totalprogramados+driver.services.totaladicionales),
                  "#2196F3"
               ),
               options: $scope.charts.options
            };
         });

         angular.extend($scope.data, data);
      });
      //----------------------------------------------
   };
   var timer = $interval(refresh, 15000); // 15 second's
   var delay = $timeout(refresh, 500);    // Delay for fix n3-Charts resize (http://stackoverflow.com/questions/26881811/n3-chart-width-not-set-according-to-parent-width)

   //----------------------------------------------------------
   $scope.details = function(){
      $state.go('app.dashboard-details', {
         date: $scope.data.date.toISOString()
      });
   }	
   //----------------------------------------------------------
   
   //----------------------------------------------------------
   //DESTROY STEP
   $scope.$on("$destroy", function(){
      $interval.cancel(timer);
      $timeout.cancel(delay);
   });
   //----------------------------------------------------------

        $scope.test = function(ev){
            $mdDialog.show ({
                templateUrl: 'porcentaje.tmpl.html',
                targetEvent: ev,
            })
        };

});