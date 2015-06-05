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
    /// Roles API
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class RoleController : Karma.REST.KarmaController<Models.Profile>
    {

        /// <summary>
        /// Obtiene los roles del sistema
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Profile>))]
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="id"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IHttpActionResult Delete(string id)
        {
            throw new NotSupportedException();
        }
    }
}