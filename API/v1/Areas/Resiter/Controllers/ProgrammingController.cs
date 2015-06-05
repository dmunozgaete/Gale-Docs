using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// Programación Mensual
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class ProgrammingController : Karma.REST.RestController
    {

        /// <summary>
        /// Programación Mensual
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Get(DateTime? month)
        {
            DateTime selectedDate = DateTime.Now.Date;
            if (month.HasValue == true)
            {
                selectedDate = month.Value.Date;
            }

            return new Data.Programming.Programming(selectedDate);
        }

        /// <summary>
        /// Obtiene el detalle de la programación para un tipo de servicio 
        /// </summary>
        /// <param name="month"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Details(DateTime? month, string type)
        {
            DateTime selectedDate = DateTime.Now.Date;
            if (month.HasValue == true)
            {
                selectedDate = month.Value.Date;
            }

            return new Data.Programming.ProgrammingDetails(selectedDate, type);
        }

        /// <summary>
        /// Obtiene la programación del día en la programacón mensual
        /// </summary>
        /// <param name="day"></param>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Day(DateTime day)
        {
            return new Data.Programming.DayProgram(day);
        }

        /// <summary>
        /// Programación Mensual
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            DateTime selectedDate = payload["month"].ToObject<DateTime>();
            List<Models.DiaProgramado> program = payload["program"].ToObject<List<Models.DiaProgramado>>();
            String type = payload["type"].ToObject<String>();

            return new Data.Programming.UpdateProgramming(type, selectedDate, program );
        }


    }

}