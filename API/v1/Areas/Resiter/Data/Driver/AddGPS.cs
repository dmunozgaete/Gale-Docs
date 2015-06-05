using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.Driver
{
    /// <summary>
    /// Ingresa un Conductor a la unidad de negocio
    /// </summary>
    public class AddGPS : Karma.REST.Http.HttpCreateActionResult<Models.CoordenadaConductor>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public AddGPS(Models.CoordenadaConductor T) : base(T) { }


        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            //Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_GPS_INS_CoordenadaConductor"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("VEHI_Token",Model.vehiculo);
                svc.Parameters.Add("CORC_Latitud", Model.latitud);
                svc.Parameters.Add("CORC_Longitud", Model.longitud);

                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}