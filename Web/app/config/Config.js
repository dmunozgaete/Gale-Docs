angular.module("config", [])
    .constant("GLOBAL_CONFIGURATION", {

        //Application data
        application: {
            version: "2.0.1",
            author: "David Antonio Muñoz Gaete",
            environment: "development",
            language: "es",
            name: "Gale Doc's",
            home: "/demo/home/introduction"
        },

        //CLEAN STEP WHEN A NEW VERSION IS UPDATE!
        on_build_new_version: function(new_version, old_version) {},

        //SideNav Menu
        menu_items: [{
            "label": "Servicios",
            "name": "services",
            "open": false,
            "items": [
                "$Configuration",
                "$Localization",
                "$Api",
                "$LocalStorage",
                "$Timer",
                "KQLBuilder",
                "Identity"
            ]
        }, {
            "label": "Componentes",
            "name": "components",
            "open": false,
            "items": [
                "gale-finder",
                "gale-loading",
                "gale-page",
                "gale-table"
            ]
        }, {
            "label": "Filtros",
            "name": "filters",
            "open": false,
            "items": [
                "capitalize",
                "localize",
                "template"
            ]
        }, {
            "label": "Directivas",
            "name": "directives",
            "open": false,
            "items": [
                "ngRange",
                "ngRut",
                "ngEmail",
                "selectTextOnClick",
                "toNumbeOnBlur"
            ]
        }]
    });
