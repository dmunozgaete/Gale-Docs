angular.module("config", [])
    .constant("GLOBAL_CONFIGURATION", {

        //Application data
        application: {
            version: "2.2.5",
            author: "David Antonio Muñoz Gaete",
            environment: "development",
            language: "es",
            name: "Gale Doc's",
            home: "/demo/gettingStarted/introduction"
        },

        google: {
             analytics: "UA-66082630-2"
        },

        menu: [

            //Gettting Started
            {
                label: "Primeros Pasos",
                name: "gettingStarted",
                open: true,
                items: [
                    {
                        label: "Introducción",
                        name: "introduction"
                    },

                    {
                        label: "Instalación",
                        name: "installation"
                    }
                ]
            },

            //Server References
            {
                label: "API",
                name: "api",
                items: [
                    {
                        label: "Controladores",
                        name: "controllers",
                        items: [
                            { name: "RestController" },
                            { name: "BlueprintController" }
                        ]
                    },

                    {
                        label: "Modelos",
                        name: "models",
                        items: [
                            { name: "definition", label:"Definición" },
                            { name: "example", label:"Ejemplo de Creación" }
                        ]
                    },

                    {
                        label: "Servicios",
                        name: "services",
                        items: [
                            { name: "definition", label:"Definición" }
                        ]
                    },

                    {
                        label: "Respuestas HTTP",
                        name: "services",
                        items: [
                            { name: "HttpBaseActionResult" },
                            { name: "HttpFileActionResult" },
                            { name: "HttpCreationActionResult" },
                            { name: "HttpReadActionResult" },
                            { name: "HttpUpdateActionResult" },
                            { name: "HttpDeleteActionResult" },
                            { name: "HttpQueryableActionResult" }
                        ]
                    },

                    {
                        label: "Seguridad",
                        name: "security",
                        items: [
                            { name: "jwt" , label:"Autorización JWT" }
                        ]
                    } /*,

                    {
                        label: "Ambientes",
                        name: "staging",
                        items: [
                            { name: "Introduction" },
                            { name: "Deployment" },
                            { name: "Production" }
                        ]
                    } */
                ]
            },

            //Help US
            {
                label: "Contribuciones",
                name: "helpus",
                open: true,
                items: [
                    {
                        label: "Colaboradores",
                        name: "about"
                    },
                    {
                        label: "Recursos Externos",
                        name: "resources"
                    }
                ]
            },
        ]
    });
