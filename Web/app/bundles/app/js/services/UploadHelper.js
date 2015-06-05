angular.module('app.services')	

.factory('UploadHelper', function ($log, $upload,Identity, $Api) {
	var self = this;
	var $scope = null;	//Controller Scope

    self.upload = function(files){
    	var service = {};
    	var _listeners      =   {
            "beforeStart"	: [],
            "beforeSend" 	: [],
            "progress" 		: [],
            "complete" 		: [],
            "error" 		: []
        };

        //---------------------------------------------------
        var fire = function(eventName, args){
        	
            angular.forEach(_listeners[eventName],function(handler) {
              handler.apply(service, args);
            });
            
        }
        //---------------------------------------------------
      	
      	//---------------------------------------------
        service.$on = function(eventName, callback){
            if(!_listeners[eventName]){
                throw Error("EVENT_NOT_FOUND");
            }

            _listeners[eventName].push(callback);

            return service;
        };
        //---------------------------------------------
        
        //-----------------------------------------
    	if (files && files.length) {

    		_.defer(function(){

	    		fire("beforeStart", [files]);

	            //http://underscorejs.org/#throttle
	            var throttled = _.throttle(function(value){
	            	fire("progress", [value]);
	            }, 300);


	            for (var i = 0; i < files.length; i++) {
	                var file = files[i];

	                var headers = {};

	                fire("beforeSend", [headers]);

	                if(Identity.isAuthenticated()){
	                    var jwt = Identity.token();
	                    headers['Authorization'] = jwt.token_type + " " + jwt.access_token;
	                }

	                $upload.upload({
	                    url: ($Api.get_endpoint() + '/File/'),
	                    file: file,
	                    headers: headers
	                })
	                .progress(function (evt) {
	                    
	                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                    throttled(progressPercentage);

	                })
	                .success(function (data, status, headers, config) {
	                	
	                	fire("complete", [data, status, headers, config]);

	                })
	                .error(function (data, status, headers, config) {
	                	
	                	fire("error", [data, status, headers, config]);

	                });
	            }
	            
	        })
        }
        //-----------------------------------------
        
        return service;
    }

   
    return self;

});