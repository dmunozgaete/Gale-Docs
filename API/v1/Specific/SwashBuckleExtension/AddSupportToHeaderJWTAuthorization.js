$(function () {

    //Find the Security Definitions and add the according header's
    $('#input_apiKey').off("change");   //Clear previous event's
    $('#input_apiKey').change(function () {

        for (var name in window.swaggerApi.securityDefinitions) {
            var definition = window.swaggerApi.securityDefinitions[name];
            var key = $('#input_apiKey')[0].value;

            if (key && key.trim() != "") {
                window.authorizations.add(name, new ApiKeyAuthorization(definition.name, "Bearer " + key, definition.in));
            }
        }

    });

    
    var fixEndpoints = function () {

        if (window.swaggerApi == null && window.swaggerApi.apisArray) {
            setTimeout(function () {
                fixEndpoints();
            }, 50);
        } else {
            //Fix Operations Data
            var regExp = new RegExp('(Get|Post|Put|Delete)$');
            var regExp2 = new RegExp('(\/Get\/|\/Post\/|\/Put\/|\/Delete\/)');

            for (var index in window.swaggerApi.apisArray) {
                
                var api = window.swaggerApi.apisArray[index];
                
                for (var index2 in api.operationsArray) {
                    
                    var operation = api.operationsArray[index2];
                    
                    operation.path = operation.path.replace(regExp2, '/');
                    operation.path = operation.path.replace(regExp, '');
                    
                }
            }

            //Fix Operations UI
            $("li.operation span.path a").each(function () {
                var ank = $(this);

                ank.html(ank.html().replace(regExp2, '/'));
                ank.html(ank.html().replace(regExp, ''));
            });

        }
    }

    fixEndpoints()
});