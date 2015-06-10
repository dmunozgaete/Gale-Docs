(function(){

	var resourceUrl = function(endpoint, token , Identity){
		var url = null;
		if(token){
			//IF HAS TOKEN, GET RESTRICTED IMAGE
			 url +=  endpoint  + "?token=" + token;

			if(Identity.isAuthenticated()){
				url += "&access_token=" + Identity.token().access_token;
			}
		}

		return url;
	};


	angular.module('app.filters')	

	.filter('image', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/File/';
			var resx = resourceUrl(endpoint, token , Identity);
			if(!resx){
				//OTHERWISE SHOW A LOGO IMAGE
				resx = "bundles/app/css/images/logo-white.png";
			}
			return resx;
		};
	})

	.filter('avatar', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/Account/Avatar/';
			return resourceUrl(endpoint, token, Identity);
		};
	})

	.filter('resource', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/File/';
			return resourceUrl(endpoint, token, Identity);
		};
	});

})()
