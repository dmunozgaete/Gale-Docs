using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Account
{
    /// <summary>
    /// Extrae las unidades de Negocio Disponibles del Usuario
    /// </summary>
    public class BusinessUnits: Karma.REST.Http.HttpActionResult
    {
        /// <summary>
        /// Get Items
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Escritorio"))
            {
                svc.Parameters.Add("USUA_Token", HttpContext.Current.User.PrimarySid());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.UnidadDeNegocio> businessUnits = rep.GetModel<Models.UnidadDeNegocio>();                

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(businessUnits,
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