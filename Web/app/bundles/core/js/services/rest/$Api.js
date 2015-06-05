angular.module('core.services')

.provider('$Api', function() {

    //---------------------------------------------------
    //Configurable Variable on .config Step
    var _endpoint = null;

    this.setEndpoint = function (endpoint) {
        _endpoint = endpoint;
    };
    //---------------------------------------------------

    //---------------------------------------------------
    this.$get = function ($rootScope, $http, $log, ODataBuilder) {
        var self            =   this;
        
        //------------------------------------------------------------------------------
        // EVENT IMPLEMENTATION
        var $$listeners     =   {};   
        self.$on = function(name, listener){

            var namedListeners = $$listeners[name];
            if (!namedListeners) {
              $$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);

            //de-register Function
            return function() {
              namedListeners[indexOf(namedListeners, listener)] = null;
            };
        };

        var fire = function(name, args){
            var listeners = $$listeners[name];
            if(!listeners){
                return;
            }
            
            angular.forEach(listeners, function(listener){
                listener.apply(listener, args);
            });
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        self.get_endpoint = function(value){
            if(!_endpoint){
                throw Error("ENDPOINT_NOT_CONFIGURED");
            }
            return _endpoint;
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        self.invoke = function(method, url, body, headers) {

            var _headers = {
                'Content-Type': 'application/json'
            };

            //Custom Header's??
            if(headers){
                for(var name in headers){
                    _headers[name] = headers[name]
                }
            }
            
            //---------------------------------------------------
            // CALL LISTENER'S
            fire("beforeSend", [_headers, url, body]);
            //---------------------------------------------------

            var cfg = {
                url: self.get_endpoint() + url,
                method: method,
                headers: _headers
            };
            
            cfg[(method === "GET" ? "params": "data")] = body;

            $log.debug("["+method+" " + url + "] parameters: " , body);


            var http = $http(cfg)
            .success(function (data, status, headers, config) {
                //IF DEBUGGING??
                //console.log(arguments)
            })

            .error(function (data, status, headers, config) {
                //IF DEBUGGING??
                //console.log(arguments)
                
                //Unathorized??
                if(status == 401){
                    $rootScope.$broadcast('Identity.Unauthorized', data);
                }

                $log.error(data, status, headers, config);

            });

            return http;
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        //CRUD: CREATE OPERATION
        self.Create= function(url, body, headers){
            return self.invoke('POST', url, body, headers);
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        //CRUD: GET OPERATION
        self.Read= function(url, configuration, headers){
            
            if(configuration){
                //Has OData Configuration???
                url = ODataBuilder.build(url, configuration);
            }

            return self.invoke('GET', url, {}, headers);
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        //CRUD: UPDATE OPERATION
        self.Update= function(url, id, body, headers){
            url += "/{0}".format([id]); //PUT url/id

            return self.invoke('PUT', url, body, headers);
        }
        //------------------------------------------------------------------------------
        

        //------------------------------------------------------------------------------
        //CRUD: DELETE OPERATION
        self.Delete= function(url, id, headers){

            url += "/{0}".format([id]); //DELETE url/id

            return self.invoke('DELETE', url, {}, headers);
        }
        //------------------------------------------------------------------------------


        return self;
    };
    //---------------------------------------------------
});