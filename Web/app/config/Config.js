angular.module("gale.services.configuration")
    .constant("GLOBAL_CONFIGURATION", {
        //Application data
        application: {
            version: "2.0.1",
            author: "David Antonio Muñoz Gaete",
            environment: "qas",
            language: "es",
            name: "Gale Docs"
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
                "ODataBuilder",
                "Identity"
            ]
        }, {
            "label": "Componentes",
            "name": "components",
            "open": false,
            "items": [
                "gale-content",
                "gale-finder",
                "gale-loading",
                "gale-pad",
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
                "range",
                "rut",
                "select-text-on-click",
                "to-number-on-blur"
            ]
        }]
    });
