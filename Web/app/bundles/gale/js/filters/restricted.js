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


	angular.module('gale.filters')

	.filter('restricted', function ($Api, Identity) {
		return function (token) {
			var endpoint = $Api.get_endpoint() + '/File/';
			return resourceUrl(endpoint, token, Identity);
		};
	});

})();
