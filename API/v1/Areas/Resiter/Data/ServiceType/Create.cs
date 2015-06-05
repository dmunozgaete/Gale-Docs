using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.ServiceType
{
    /// <summary>
    /// Actualiza un Registro
    /// </summary>
    public class Create : Karma.REST.Http.HttpCreateActionResult<Models.TipoServicio>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public Create(Models.TipoServicio T) : base(T) { }


        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model.nombre), "NOMBRE_REQUERIDO", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model.descripcion) , "DESCRIPCION_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            string temporal_password = Karma.Security.Cryptography.MD5.GenerateHash(System.Web.Security.Membership.GeneratePassword(20, 3));

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_INS_TipoServicio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("TISE_Nombre", Model.nombre);
                svc.Parameters.Add("TISE_Descripcion", Model.descripcion);

                if (Model.imagen != null && Model.imagen != System.Guid.Empty)
                {
                    svc.Parameters.Add("ARCH_Token", Model.imagen);
                }


                this.ExecuteAction(svc);

                /*
                 * COPIHUE DE ORO PARA IMPLEMENTACION DE CORREO RECUPERACION Y CAMBIO DE CONTRASEÑA (BITBUCKET)     
                 */
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created);

            return Task.FromResult(response);
        }
    }
}