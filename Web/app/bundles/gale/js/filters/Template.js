angular.module('gale.filters')	

.filter('template', function ($log,$interpolate) {
	return function (template, parameters) {

            var exp = $interpolate(template);
            var content = exp({
            	data: parameters
            });
           
           return content;
	};
});