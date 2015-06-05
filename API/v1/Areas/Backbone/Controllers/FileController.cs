using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Net.Http;
using System.Web.Http.Description;
using System.Web;

namespace API.Areas.Backbone.Administration
{

    /// <summary>
    /// File API
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class FileController : Karma.REST.RestController
    {

        /// <summary>
        /// Create a Temporary File  (Must be Change the flag to permanently after)
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult Get(string token)
        {
            return new Data.File.View(token);
        }


        /// <summary>
        /// Create a Temporary File  (Must be Change the flag to permanently after)
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult Post()
        {
            return new Data.File.Upload(this.Request, User.PrimarySid());
        }



    }

}