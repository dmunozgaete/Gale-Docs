angular.module('app.filters')	

.filter('icon', function ($Configuration,$interpolate,$log) {
	var basePath = $Configuration.get('MATERIAL_ICON_SVG_FOLDER');

	return function (category, icon) {
	
		var exp = $interpolate(basePath);
        var content = exp({
			category: category,
			icon: icon
        });

		return content;
	};
});