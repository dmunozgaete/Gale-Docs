using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class MonitorController: Karma.REST.RestController
    {



        /// <summary>
        /// Obtiene los datos en tiempo real de la unidad de negocio
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Realtime(DateTime? date)
        {
            DateTime routeDate = DateTime.Now.Date;
            if (date.HasValue == true)
            {
                routeDate = date.Value.Date;
            }

            return new Data.Monitor.RealTime(routeDate) ;
        }

    }
}