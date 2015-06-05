using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{

    /// <summary>
    /// Unidades de Negocio del usuario
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class AccountController : Karma.REST.RestController
    {

        /// <summary>
        ///  Obtiene la información Personal del Usuario
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult Get()
        {
            return new Data.Account.BusinessUnits();
        }

        /// <summary>
        ///  Obtiene el listado de unidades de negocio al cual pertenece el usuario
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ResponseType(typeof(List<Models.UnidadDeNegocio>))]
        public IHttpActionResult BusinessUnits()
        {
            return new Data.Account.BusinessUnits();
        }

        /// <summary>
        ///  Obtiene los accesos del sistema
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Access()
        {
            return new Data.Account.Access();
        }


        /// <summary>
        ///  Obtiene la imagen de Avatar del usuario actual
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Avatar()
        {
            return new Data.Account.Avatar();
        }


        /// <summary>
        ///  Genera una clave para el usuario
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PasswordCreate(Newtonsoft.Json.Linq.JToken payload)
        {
            string password = payload.Value<String>("password");
            return new Data.Account.PasswordCreate(password);
        }

        /// <summary>
        ///  Genera una clave para el usuario
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PasswordRecovery(Newtonsoft.Json.Linq.JToken payload)
        {
            string password = payload.Value<String>("password");
            return new Data.Account.PasswordCreate(password);
        }

        /// <summary>
        ///  Genera una clave para el usuario
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult PasswordRecovery(string token, string host)
        {
            //----------------------------------------------------------------------
            return new Data.Account.PasswordRecovery(token, host);
            //----------------------------------------------------------------------
        }
    }
}