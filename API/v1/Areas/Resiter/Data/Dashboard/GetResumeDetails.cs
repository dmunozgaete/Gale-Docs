using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Dashboard
{
    /// <summary>
    /// Get Dashboard Information
    /// </summary>
    public class GetResumeDetails : Karma.REST.Http.HttpActionResult
    {

        DateTime _fecha = DateTime.Now.Date;

        /// <summary>
        /// Resumen de Unidad de Negocio
        /// </summary>
        /// <param name="fecha"></param>
        public GetResumeDetails(DateTime fecha)
        {
            _fecha = fecha;
        }

        /// <summary>
        /// Get Items
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            HttpContext.Current.User.PrimarySid();
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_EstadisticasDetalle"))
            {
                svc.Parameters.Add("USUA_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("Fecha", _fecha);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.Estadistica totales = rep.GetModel<Models.Estadistica>().FirstOrDefault();
                Karma.Db.EntityTable<Models.ResumenEstadistica> items = rep.GetModel<Models.ResumenEstadistica>(1);

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            information = totales, 
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