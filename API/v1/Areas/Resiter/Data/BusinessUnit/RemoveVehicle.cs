using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Vehiculo a la unidad de negocio
    /// </summary>
    public class RemoveVehicle : Karma.REST.Http.HttpDeleteActionResult
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="token">Token</param>
        public RemoveVehicle(String token) : base(token) { }


       /// <summary>
       
       /// </summary>
       /// <param name="token"></param>
       /// <param name="cancellationToken"></param>
       /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(String token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(token), "VEHICULO_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_DEL_Vehiculo_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("VEHI_Token", token);
                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}