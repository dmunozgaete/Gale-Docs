using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// Dashboard Controller
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class DashboardController : Karma.REST.RestController
    {
        /// <summary>
        /// Devuelve los elementos del dashboard
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult Get(DateTime? date)
        {
            DateTime routeDate = DateTime.Now.Date;
            if (date.HasValue == true)
            {
                routeDate = date.Value.Date;
            }

            return new Data.Dashboard.GetResume(routeDate);
        }

        /// <summary>
        /// Detalle del dashboard
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Details(DateTime? date)
        {
            DateTime routeDate = DateTime.Now.Date;
            if (date.HasValue == true)
            {
                routeDate = date.Value.Date;
            }

            return new Data.Dashboard.GetResumeDetails(routeDate);
        }

    }
}
