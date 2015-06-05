//PACKAGING FUNCTION
angular.$manifiest = function(bundle, namespaces){

    //Create the namespace via angular style
    angular.forEach(namespaces, function(name){ 
        angular.module(name, []); 
    });

    //CREATE ANGULAR MODULE
    return angular.module(bundle, namespaces);
};