using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Backbone.Administration
{
    /// <summary>
    /// Users Api
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class UserController : Karma.REST.KarmaController<Models.User> {

        /// <summary>
        /// Obtiene los usuarios del sistema
        /// </summary>
        /// <returns></returns>
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// Obtiene los roles asociados al usuario
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public  IHttpActionResult Roles(string user)
        {
            return new Data.User.Roles(user);
        }

        /// <summary>
        /// Actualiza un Usuario de Sistema
        /// </summary>
        /// <returns></returns>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => payload["profiles"] == null, "PROFILES_REQUIRED", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------
            
            Models.User user = payload.ToObject<Models.User>();
            List<String> profiles = payload["profiles"].Values<String>().ToList();

            return new Data.User.Update(id, user, profiles);
        }

        /// <summary>
        /// Inserta un registro de Usuario
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => payload["profiles"] == null, "PROFILES_REQUIRED", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            Models.User user = payload.ToObject<Models.User>();
            List<String> profiles = payload["profiles"].Values<String>().ToList();
            string host  = payload.Value<String>("host");

            return new Data.User.Create(user, profiles, host);
        }

        /// <summary>
        /// Delete User
        /// </summary>
        /// <param name="id">User Token</param>
        /// <returns></returns>
        public override IHttpActionResult Delete(string id)
        {
            return new Data.User.Delete(id);
        }
    }
}