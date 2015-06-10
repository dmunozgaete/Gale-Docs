angular.module('core.services.configuration')

.service('$Configuration', function ($rootScope, $LocalStorage, GLOBAL_CONFIGURATION, ENVIRONMENT_CONFIGURATION) {
    var _values             = {};

    //LOAD THE INITIAL CONFIGURATION
    for(var env_name in ENVIRONMENT_CONFIGURATION){
        set(env_name, ENVIRONMENT_CONFIGURATION[env_name]);
    }

    for(var cfg_name in GLOBAL_CONFIGURATION){
        set(cfg_name, GLOBAL_CONFIGURATION[cfg_name]);
    }
    
    function get(name, defaultValue){
        var v = _values[name]; 
        if(typeof v === undefined){
            if(defaultValue){
                return defaultValue;
            }
            throw Error(name + " don't exists in configuration");
        }
        return _values[name];
    }

    function exists(name){
        return _values[name] != null;
    }

    function set(name, value){
        _values[name] = value;
    }

    return {
        get: get,
        exists: exists
    };
});