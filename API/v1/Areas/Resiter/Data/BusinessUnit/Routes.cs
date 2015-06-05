using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Account Access
    /// </summary>
    public class Routes : Karma.REST.Http.HttpActionResult
    {
        DateTime _fecha = DateTime.Now.Date;

        /// <summary>
        /// Resumen de Unidad de Negocio
        /// </summary>
        /// <param name="fecha"></param>
        public Routes(DateTime fecha)
        {
            _fecha = fecha;
        }

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Rutas_UnidadDeNegocio"))
            {
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("RUTA_Fecha", _fecha);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.Conductor> items = rep.GetModel<Models.Conductor>();
                Karma.Db.EntityTable<Models.PuntoRuta> routes = rep.GetModel<Models.PuntoRuta>(1);

                //Routes 
                items.ForEach((driver) =>
                {
                    driver.puntos = (from route in routes
                                       where route.conductor == driver.token
                                       select route).ToList();
                });

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            total = items.Count,
                            items = items
                        },
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };

                //Return Task
                return Task.FromResult(response);
                //----------------------------------------------------------------------------------------------------
            }
        }
    }
}