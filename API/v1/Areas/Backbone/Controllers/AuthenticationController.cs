using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Areas.Backbone.Administration
{

    /// <summary>
    /// Security Controller to grant JWT to Valid User's
    /// </summary>
    public class AuthenticationController : Karma.REST.RestController
    {

        /// <summary>
        /// Autentica a un usuario de acuerdo a las credenciales
        /// </summary>
        /// <param name="user">Datos del usuario para autenticar</param>
        /// <returns></returns>
        public IHttpActionResult Post([FromBody]Models.Authenticate user)
        {

            //------------------------------------------------------------------------------------------------------------------------
            //GUARD EXCEPTION
            Karma.Exception.RestException.Guard(() => user == null, "EMPTY_BODY", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => user.username == null, "EMPTY_USERNAME", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => user.password == null, "EMPTY_PASSWORD", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------------------------

            return new Data.Authentication.Authenticate(this.Request, user);

        }

    }
}