angular.module('gale.services.security')

.service('Identity', function ($rootScope, $Api, $LocalStorage, $Configuration) {

	var self 		= this;
	var _token_key 	= "$_identity";
	var _token 		= $LocalStorage.getObject(_token_key);
	var _properties	= {};

	//------------------------------------------------------------------------------
	var _login = function(oauthToken){
		$LocalStorage.setObject(_token_key, oauthToken);
		_token = oauthToken;
		$rootScope.$broadcast('Identity.onAuthenticate', oauthToken);
	}

	var _logout = function(){
		$LocalStorage.remove(_token_key);
		$rootScope.$broadcast('Identity.onLogOut');
	}

	var _addProperty = function(name, value){
		_properties[name] = value;
	};
	//------------------------------------------------------------------------------
	

	self.authenticate = function(credentials){
		var oauth_endpoint = $Configuration.get("authentication_issuer_endpoint");
		if(!oauth_endpoint){
			oauth_endpoint = '/Authentication'; //If not exists, set default
		}

		return $Api.invoke('POST', oauth_endpoint , credentials)
		.success(function(data){
			_login(data);	//Internal Authentication
		});
	};

	self.property = function(name, value){
		
		if(typeof name == "object"){

			for(var key in name){
				_addProperty(key, name[key]);
			}
			return;
		}

		_addProperty(name,value);
	};

	self.token = function(){
		return _token;
	};

	self.getAccessToken = function(){
		return _token.access_token;
	};

	self.logOut = function(){
		_logout();
	};

	self.get = function(){
		//Get Payload
		var payload = _token.access_token.split('.')[1];
		if(atob){
			data = decodeURIComponent(escape(atob(payload)));

		}else{
			//IE FIX
			//TODO: FIX atob is undefined in IE (dont exists)
			throw {
				message: "IMPLEMENT!!!"
			}
		}

		data = JSON.parse( data );

		//Extend Identity
		data.property = function(name){
			return _properties[name];
		};

		data.isInRole = function(roleName){
			return _.contains(data.role, roleName)
		}

		return data;
	};

	self.isAuthenticated = function(){
		return _token !== null;
	};

	//------------------------------------------------------------------------------
	//Call Authentication Method to Adapt all services wich need Authorization
	if(self.isAuthenticated()){
		_login(_token);
	}
	//------------------------------------------------------------------------------

	return self;

});