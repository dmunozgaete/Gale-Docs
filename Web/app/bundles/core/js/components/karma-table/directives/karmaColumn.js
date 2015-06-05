angular.module('core.components.karma')

.directive('karmaColumn', function() {
    return {
        restrict: 'E',
        require: '^karmaTable',
        scope: {
    		title         : '@',    // Column Title
            property      : '@',    // Property to Bind
            width         : '@',    // Column Width (in %)
            align         : '@'     // Text Align
        },
        transclude: true,   

        controller: function($scope, $element, $attrs) {
           
        },

        link: function (scope, element, attrs, karmaTable, $transclude) {
            element.attr("flex", (scope.width ? scope.width :""));
            element.addClass("karma-column");
            
            $transclude( scope, function( fragments ) {
                //--------------------------------------------------------
                //Try to get header element (CUSTOM)
                var header = _.find(fragments,function(elm){
                    return elm.nodeName.toLowerCase() == "karma-header"
                });

                if(!header){
                    header = angular.element("<div>" + (scope.title||"") + "</div>")
                }else{
                    header = angular.element(header);

                    //IF HAS NG-TEMPLATE (FIX BUG TRANSCLUDE)
                    var script = header.find("script");
                    if(script.length >0 ){
                        header = script;
                    }else{
                        var template = item.find("template");
                        if(template.length >0 ){
                            header = template;
                        }
                    }
                }
                
                //PROPERTY: WIDTH
                var cls = null;
                switch (scope.align){
                    case "left":
                        cls = "alignLeft";
                        break;
                    case "right":
                        cls = "alignRight";
                        break;
                    case "center":
                        cls = "alignCenter";
                        break;
                }
                if(cls){
                    header.addClass(cls);
                }

                //Append the header 
                element.append( header );    
                //--------------------------------------------------------
                
                //--------------------------------------------------------
                //Try to get item element (CUSTOM)
                var item = _.find(fragments,function(elm){
                    return elm.nodeName.toLowerCase() == "karma-item"
                });

                if(!item){
                    var html = "";
                    if(scope.property){
                        html = "{{item." + scope.property + "}}";
                    }
                    item = angular.element("<div>" + html + "</div>");
                }else{
                    item = angular.element(item);

                    //IF HAS NG-TEMPLATE (FIX BUG TRANSCLUDE)
                    var script = item.find("script");
                    if(script.length >0 ){
                        item = script;
                    }else{
                        var template = item.find("template");
                        if(template.length >0 ){
                            item = template;
                        }
                    }
                    
                }

                //Append the item 
                karmaTable.$$formatters.push({
                    property: scope.property,
                    width: scope.width,
                    align: scope.align,
                    template: item.html()
                });
                //--------------------------------------------------------
            });
        }
    };
});