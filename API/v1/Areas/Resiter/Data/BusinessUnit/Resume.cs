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
    public class Resume : Karma.REST.Http.HttpActionResult
    {
        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_ResumenUnidadNegocio"))
            {
                svc.Parameters.Add("USUA_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.ResumenUnidadNegocio data = rep.GetModel<Models.ResumenUnidadNegocio>().FirstOrDefault();

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        data,
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