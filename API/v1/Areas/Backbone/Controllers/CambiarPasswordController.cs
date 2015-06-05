using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Areas.Backbone.Controllers
{
    public class CambiarPasswordController : Karma.REST.RestController
    {

        /// <summary>
        /// Verifica si el usuario tiene email
        /// </summary>
        /// <param name="email">Email del usuario</param>
        /// <param name="host">Host del usuario</param>
        /// <returns></returns>
        ///
        [HttpGet]
        public IHttpActionResult Get(string email, string host)
        {

            return new Data.CambiarPassword.VerificarEmailUsuario(email, host);

        }

    }
}