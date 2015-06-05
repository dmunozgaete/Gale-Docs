using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Services.Description;
using API.Specific.SwashBuckleExtension;
using Swashbuckle.Application;

namespace API
{

    /// <summary>
    /// WEB API Global Configuration
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// Security Schema Definition name, For Swagger UI
        /// </summary>
        internal const string _securityDefinitionNameSchema = "jwt";

        /// <summary>
        /// Register Config Variables
        /// </summary>
        /// <param name="config"></param>
        public static void Register(HttpConfiguration config)
        {
            //--------------------------------------------------------------------------------------------------------------------------------------------
            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute("KarmaAPIRoute", "v1/{controller}/{action}/{id}", new
            {
                action = RouteParameter.Optional,
                id = RouteParameter.Optional
            });

            config.Services.Replace(typeof(System.Web.Http.Controllers.IHttpActionSelector), new Karma.REST.Http.Routing.KarmaApiControllerActionSelector());
            //--------------------------------------------------------------------------------------------------------------------------------------------

            #region SWAGGER AUTO-GENERATED API
            //--------------------------------------------------------------------------------------------------------------------------------------------
            //SWAGGER PROTOCOL AUTO-GENERATED DOC's
            //https://github.com/domaindrivendev/Swashbuckle

            string XMLComment = System.String.Format(@"{0}\bin\API.XML", System.AppDomain.CurrentDomain.BaseDirectory);
            
            config.EnableSwagger((c) =>
            {
              
                //Action Conflict Resolver
                c.ResolveConflictingActions((apiDescriptions) =>
                {
                    return apiDescriptions.First();
                });

                //JWT Configuration
                c.ApiKey(_securityDefinitionNameSchema)
                    .Description("Bearer JWT Authorization")
                    .Name("Authorization")
                    .In("header");

                //Add JWT Api Key Scheme
                c.OperationFilter<AddAuthorizateSecurityDefinitions>();

                //Include XML
                c.IncludeXmlComments(XMLComment);

                //Basic Configuration
                c.SingleApiVersion("v1", "API Doc's")
                .Contact(cc => cc
                    .Name("David Muñoz Gaete")
                    .Url("http://www.valentys.com")
                    .Email("dmunozgaete@gmail.com"));

            })
            .EnableSwaggerUi((c) =>
            {
                //Inject to correct authentication Bearer JWT Token into every Request
                c.InjectJavaScript(typeof(WebApiConfig).Assembly, "API.Specific.SwashBuckleExtension.AddSupportToHeaderJWTAuthorization.js");

            });
            //--------------------------------------------------------------------------------------------------------------------------------------------
            #endregion

            #region CHROME FIX
            //--------------------------------------------------------------------------------------------------------------------------------------------
            // CHROME FIX
            config.Formatters.Add(new API.Specific.BrowserJsonFormatter());
            //--------------------------------------------------------------------------------------------------------------------------------------------
            #endregion
        }
    }
}
