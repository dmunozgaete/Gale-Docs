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
    public class Services : Karma.REST.Http.HttpActionResult
    {

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Servicios_UnidadDeNegocio"))
            {
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.Servicio> items = rep.GetModel<Models.Servicio>();

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