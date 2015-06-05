using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.PolygonType
{
    /// <summary>
    /// Actualiza el Tipo de Servicio
    /// </summary>
    public class Update : Karma.REST.Http.HttpUpdateActionResult<Models.TipoPoligono>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="token">User Token</param>
        /// <param name="model">Target Model</param>
        public Update(string token, Models.TipoPoligono model) : base(token, model) { }


        /// <summary>
        /// Ejecuta el Proceso
        /// </summary>
        /// <param name="token"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<HttpResponseMessage> ExecuteAsync(string token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model.nombre), "NOMBRE_REQUERIDO", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model.descripcion), "DESCRIPCION_REQUERIDO", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model.identificador), "IDENTIFICADOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_TipoPoligono"))
            {
                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("TIPO_Token", token);
                svc.Parameters.Add("TIPO_Nombre", Model.nombre);
                svc.Parameters.Add("TIPO_Descripcion", Model.descripcion);
                svc.Parameters.Add("TIPO_Identificador", Model.identificador);

                if (Model.imagen != null && Model.imagen != System.Guid.Empty)
                {
                    svc.Parameters.Add("ARCH_Token", Model.imagen);
                }

                this.ExecuteAction(svc);
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.PartialContent);

            return Task.FromResult(response);
        }
    }
}