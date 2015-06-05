using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// Drivers API
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class DriverController : Karma.REST.RestController
    {

        /// <summary>
        /// Obtiene las coordenadas de GPS
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.CoordenadaConductor>))]
        [HttpGet]
        public IHttpActionResult Gps()
        {
            return new Data.Driver.GPS();
        }
        
        /// <summary>
        /// Ingresa un registro de ruta online
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Gps(Newtonsoft.Json.Linq.JToken payload)
        {
            Models.CoordenadaConductor coord = payload.ToObject<Models.CoordenadaConductor>();
            return new Data.Driver.AddGPS(coord);
        }

        /// <summary>
        /// Crea un retiro en el sistema
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Service(Newtonsoft.Json.Linq.JToken payload)
        {
            Models.CoordenadaConductor coord = payload.ToObject<Models.CoordenadaConductor>();
            Models.ServicioConductor serv = payload.ToObject<Models.ServicioConductor>();

            return new Data.Driver.AddService(coord , serv);
        }
    }
}