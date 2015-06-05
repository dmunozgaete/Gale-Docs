using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Conductor a la unidad de negocio
    /// </summary>
    public class RemoveDriver : Karma.REST.Http.HttpDeleteActionResult
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public RemoveDriver(String token) : base(token) { }


       /// <summary>
       /// Remove Driver
       /// </summary>
       /// <param name="token"></param>
       /// <param name="cancellationToken"></param>
       /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(String token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(token), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_DEL_Conductor_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("COND_Token", token);
                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}