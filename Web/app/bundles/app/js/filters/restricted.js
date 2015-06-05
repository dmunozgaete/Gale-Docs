(function(){

	var resourceUrl = function(endpoint, token , Identity){
		var url = "";
		if(token){
			//IF HAS TOKEN, GET RESTRICTED IMAGE
			 url +=  endpoint  + "?token=" + token;

			if(Identity.isAuthenticated()){
				url += "&access_token=" + Identity.token().access_token;
			}
		}else{
			//OTHERWISE SHOW A LOGO IMAGE
			url = "bundles/app/css/images/logo-white.png";
		}

		return url;
	};


	angular.module('app.filters')	

	.filter('restricted', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/File/';
			return resourceUrl(endpoint, token , Identity);
		};
	})

	.filter('avatar', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/Account/Avatar/';
			return resourceUrl(endpoint, token, Identity);
		};
	});


})()
