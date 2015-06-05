using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.ServiceType
{
    /// <summary>
    /// Elimina el registro objetivo
    /// </summary>
    public class Delete : Karma.REST.Http.HttpDeleteActionResult
    {
       /// <summary>
       /// Constructor
       /// </summary>
       /// <param name="token"></param>
        public Delete(string token): base(token){}


        /// <summary>
        /// Ejecuta el Proceso
        /// </summary>
        /// <param name="token">Identificador</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<HttpResponseMessage> ExecuteAsync(string token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_DEL_TipoServicio"))
            {
                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("TISE_Token", token);

                this.ExecuteAction(svc);
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.OK);

            return Task.FromResult(response);
        }
    }
}