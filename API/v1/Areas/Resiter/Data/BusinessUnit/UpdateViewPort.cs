using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Poligono a la unidad de negocio
    /// </summary>
    public class UpdateViewPort : Karma.REST.Http.HttpCreateActionResult<Models.Coordenada>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T"></param>
        public UpdateViewPort(Models.Coordenada T)
            : base(T)
        {

        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            // Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution: Actualizamos las coordenadas para centrar el mapa en la unidad de negocio
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_Coordenada_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("SUCU_Latitud", Model.lat);
                svc.Parameters.Add("SUCU_Longitud", Model.lng);
                svc.Parameters.Add("SUCU_Zoom", Model.zoom);


                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);
            }
            //------------------------------------------------------------------------------------------------------

        }
    }
}