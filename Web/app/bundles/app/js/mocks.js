angular.module('mocks', ['App', 'ngMockE2E'])

//DELAY WHEN API CALL 
.config(function($provide, ENVIRONMENT_CONFIGURATION) {
    $provide.decorator('$httpBackend', function($delegate, $log) {
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var _this = this;
                var _arguments = arguments;
                var _delay = 0;

                if(url.indexOf(ENVIRONMENT_CONFIGURATION.endpoint)>=0){
                    _delay = 700;
                }

                setTimeout(function() {
                    callback.apply(_this, _arguments);
                }, _delay);

            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
})

.run(function($httpBackend, ENVIRONMENT_CONFIGURATION, $log) {
  
    var endpoint  = ENVIRONMENT_CONFIGURATION.endpoint;
    var Api = null;
    var build = function(Api){
        var exp = new RegExp(endpoint + Api ); 
        return exp;
    };
    
    //-------------------------------------------------------------
    //MODULE: SECURITY
    Api = "/Authentication";
    $httpBackend.whenPOST(build(Api)).respond(function(method, url, data) {
        var result = {
            "expires_in": 1426991771,
            "token_type": "Bearer",
            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRtdW5vekB2YWxlbnR5cy5jb20iLCJwcmltYXJ5c2lkIjoiZG11bm96IiwidW5pcXVlX25hbWUiOiJEYXZpZCBBbnRvbmlvIE11bm96IEdhZXRlIiwicm9sZSI6WyJSb2xlIDEiLCJSb2xlIDEiXSwiaXNzIjoiT0F1dGhTZXJ2ZXIiLCJhdWQiOiJPQXV0aENsaWVudCIsImV4cCI6MTQyNjk5MTc3MSwibmJmIjoxNDI2OTkxMTcxfQ.R-2rh50BmXAEivnj7HzngUySG_ZLyNtIjxm5rTr5hg0"
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
        

    //-------------------------------------------------------------
    //MODULE: HOME
    Api = "/Dashboard";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            total: 75,
            realized: 50,

            programmed: {
                total: 40,
                failed: 15,
                realized: 25
            },

            additional: {
                total: 10,
                failed: 2,
                realized: 8
            },

            drivers: [
                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    name: "David Muñoz",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    updatedAt: "2015-03-20T04:00:37.335Z",
                    services: {
                        total: 22,
                        completed: 20
                    }
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    updatedAt: "2014-03-20T04:00:37.335Z",
                    services: {
                        total: 18,
                        completed: 15
                    }
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    updatedAt: "2015-03-20T04:00:37.335Z",
                    services: {
                        total: 15,
                        completed: 10
                    }
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    updatedAt: "2015-03-20T04:00:37.335Z",
                    services: {
                        total: 10,
                        completed: 5
                    }
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
        

    //-------------------------------------------------------------
    //MODULE: HOME
    Api = "/DetailsDashboard";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            programmed: {
                success: 2,
                failure: 1,
                pending: 2,
            },

            additional: {
                success: 0,
                failure: 2
            },

            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b025",
                    name: "David Muñoz",
                    polygon: "AMECO_35",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: true,
                    state: 'SUCCESS'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    polygon: "ARMADO_PALA_ES_PALA_SV092",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: true,
                    state: 'SUCCESS'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    polygon: "BESALCO_CERRO_ALTO",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: false,
                    state: 'FAILURE'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b025",
                    name: "David Muñoz",
                    polygon: "CAMPAMENTO_VSL_ZONA_4_TACHOS_3",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: false,
                    state: 'FAILURE'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    polygon: "BODEGA_OX",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: true,
                    state: 'FAILURE'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    polygon: "CAMPAMENTO_VSL_ZONA_10_TACHOS_1",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: true,
                    state: 'PENDING'
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    polygon: "TALLER_EQUIPOS_AUXILIARES",
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    realizedAt: "2015-03-20T04:00:37.335Z",
                    programmed: true,
                    state: 'PENDING'
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    

    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/User";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    name: "David Muñoz",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    email: "dmunoz@valentys.com",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    email: "dvelasquez@valentys.com",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    email: "lnunez@resiter.cl",
                    createdAt: "2015-03-19T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/BusinessUnit";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/clientes/cencosud.png",
                    client: "Cencosud",
                    name: "Orcones",
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    contract: "CTR-1035-1D",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/arauco.jpeg",
                    client: "Arauco",
                    name: "MEL",
                    token: "8090f5d5-82ee-482a-9af1-6f64036f790d",
                    contract: "CTR-4435-1R",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/valentys.png",
                    client: "Valentys",
                    name: "Nueva de Lyon",
                    token: "5d2971de-33bc-447f-a484-75de2d693e9e",
                    contract: "CTR-1235-1R",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/gerdau.png",
                    client: "Gerdau AZA",
                    name: "Colina",
                    token: "70f2ed05-92cb-4e49-bed4-d9ba0b93a64a",
                    contract: "CTR-2435-1S",
                    createdAt: "2015-03-19T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/gerdau.png",
                    client: "Gerdau AZA",
                    name: "Renca",
                    token: "0dffe0e8-b85f-4574-b501-11610ef005bd",
                    contract: "CTR-1265-1T",
                    createdAt: "2015-03-19T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/Client";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/clientes/cencosud.png",
                    name: "Cencosud",
                    token: "047f8981-8fcf-4175-acb5-38fccdd55a0c",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/arauco.jpeg",
                    name: "Arauco",
                    token: "6c6904cd-0b9b-4f68-8051-d2ef11f77b18",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/valentys.png",
                    name: "Valentys",
                    token: "d73010a8-6035-4efc-b402-b6193ed233db",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/clientes/gerdau.png",
                    name: "Gerdau AZA",
                    token: "3fa86870-5073-47ce-8ced-a45551187fb8",
                    contract: "CTR-2435-1S",
                    createdAt: "2015-03-19T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/Branch";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    name: "Orcones",
                    token: "047f8981-8fcf-4175-acb5-38fccdd55a0c",
                    createdAt: "2015-03-20T04:00:37.335Z",
                    configured: true
                },

                {
                    name: "Sucursal 2",
                    token: "6c6904cd-0b9b-4f68-8051-d2ef11f77b18",
                    createdAt: "2014-03-20T04:00:37.335Z",
                    configured: true
                },

                {
                    name: "Sucursal 3",
                    token: "d73010a8-6035-4efc-b402-b6193ed233db",
                    createdAt: "2013-03-20T04:00:37.335Z",
                    configured: true
                },

                {
                    name: "Sucursal 4",
                    token: "3fa86870-5073-47ce-8ced-a45551187fb8",
                    createdAt: "2015-03-19T04:00:37.335Z",
                    configured: false
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/ServiceType"
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/servicios/hook.png",
                    name: "Hook",
                    token: "d73010a8-6035-4efc-b402-b6193ed233db",
                    description: "Doler wecer wedfa..",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/servicios/domestico.png",
                    name: "Recolección",
                    token: "d73010a8-6035-4efc-b402-b6193ed2312db",
                    description: "apsis quiredw  alt..",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/servicios/peligroso.png",
                    name: "Peligroso",
                    token: "a43010a8-6035-4efc-b402-b6193ed2312db",
                    description: "lorem ipsum dolerem..",
                    createdAt: "2012-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/servicios/domestico.png",
                    name: "Doméstico",
                    token: "d7301da8-6035-4efc-b402-b6193ed2312db",
                    description: "Domes eert wdfrw..",
                    createdAt: "2010-03-19T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
        
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/Driver";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    name: "David Muñoz",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    email: "dmunoz@valentys.com",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    email: "dvelasquez@valentys.com",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    email: "lnunez@resiter.cl",
                    createdAt: "2015-03-19T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    name: "David Muñoz",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    email: "dmunoz@valentys.com",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    email: "dvelasquez@valentys.com",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    email: "lnunez@resiter.cl",
                    createdAt: "2015-03-19T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    name: "David Muñoz",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    email: "dmunoz@valentys.com",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    name: "Ligia Alcayaga",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    name: "Danilo Velasquez",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    email: "dvelasquez@valentys.com",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    name: "Luis Nuñez",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    email: "lnunez@resiter.cl",
                    createdAt: "2015-03-19T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/Vehicles";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    patent: "BR-XV-74",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    patent: "RR-XD-71",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/danilovelasquez.jpg",
                    patent: "TT-ED-44",
                    token: "d38fa741-6c0c-4d74-80bf-f1e27b172e90",
                    email: "dvelasquez@valentys.com",
                    createdAt: "2013-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/luisnunez.jpg",
                    patent: "JU-IR-34",
                    token: "b5eab441-8244-4f83-a1e6-1e435396cc50",
                    email: "lnunez@resiter.cl",
                    createdAt: "2015-03-19T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/davidmunoz.jpg",
                    patent: "RS-KA-44",
                    token: "32dc32e8-60bb-40bf-8f19-22a017f3b023",
                    email: "dmunoz@valentys.com",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/thumbs/ligiaalcayaga.jpg",
                    patent: "OW-RV-88",
                    token: "7aa8bccd-f0a2-446e-b206-404b4a60df13",
                    email: "ligia.alcayaga@gmail.com",
                    createdAt: "2014-03-20T04:00:37.335Z"
                }

            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------


    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/ConfiguredServiceTypes";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    photo: "bundles/app/css/images/deleteThis/servicios/peligroso.png",
                    name: "Hook",
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    contract: "CTR-1035-1D",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/servicios/domestico.png",
                    name: "Peligroso",
                    token: "8090f5d5-82ee-482a-9af1-6f64036f790d",
                    contract: "CTR-4435-1R",
                    createdAt: "2014-03-20T04:00:37.335Z"
                },

                {
                    photo: "bundles/app/css/images/deleteThis/servicios/hook.png",
                    name: "Domestico",
                    token: "5d2971de-33bc-447f-a484-75de2d693e9e",
                    contract: "CTR-1235-1R",
                    createdAt: "2013-03-20T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    

    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/PolygonType";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    color: "#F44336",
                    name: "Disp. Final",
                    identifier: 'DISPOSICION_FINAL',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    color: "#FFEB3B",
                    name: "Disp. Temporal",
                    identifier: 'DISPOSICION_TEMPORAL',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    color: "#4CAF50",
                    name: "Servicio",
                    identifier: 'SERVICIO',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    color: "#8BC34A",
                    name: "Adicional",
                    identifier: 'ADICIONAL',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/PendingsTasks";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    document: 'Unidad de Negocio',
                    state: 'Pendiente de Elaboración',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    document: 'Unidad de Negocio',
                    state: 'Pendiente de Asignación',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-01920T04:00:37.335Z"
                },

                {
                    document: 'Unidad de Negocio',
                    state: 'Pendiente de Configuración',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-14T04:00:37.335Z"
                },

                {
                    document: 'Corrección de Servicio',
                    state: 'Pendiente de Corrección',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-12T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------
    
    //-------------------------------------------------------------
    //MODULE: ADMINSITRATION
    Api = "/Notifications";
    $httpBackend.whenGET(build(Api)).respond(function(method, url, data) {
        var result = {
            timestamp: new Date().toISOString(),
            items: [
                {
                    message: 'mensaje de Notification 1',
                    type: 'NOTIFICATION',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-20T04:00:37.335Z"
                },

                {
                    message: 'mensaje de Notification 2',
                    type: 'NOTIFICATION',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-01920T04:00:37.335Z"
                },

                {
                    message: 'mensaje de Notification 3',
                    type: 'ALERT',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-14T04:00:37.335Z"
                },

                {
                    message: 'mensaje de Notification 4',
                    type: 'ALERT',
                    token: "03999aaa-4a69-43cd-a9b7-c20e0cb4e12a",
                    createdAt: "2015-03-12T04:00:37.335Z"
                }
            ]
        };

        return [
            200, 
            result, 
            {}
        ];
    });
    //-------------------------------------------------------------

    //REQUIRED EXCEPTION FOR OTHER EXCEPTIONS
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();

});