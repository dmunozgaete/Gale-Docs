using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// Controlador de Reportes
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class ReportController : Karma.REST.RestController
    {

        /// <summary>
        /// Servicios Realizados de Acuerdo a una fecha
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Services(DateTime? from, DateTime? to, String type)
        {
            DateTime fromDate = DateTime.Now.Date;
            if (from.HasValue == true)
            {
                fromDate = from.Value.Date;
            }

            DateTime toDate = DateTime.Now.Date;
            if (to.HasValue == true)
            {
                toDate = to.Value.Date;
            }
            return new Data.Reports.Services(fromDate, toDate, type);
        }

        /// <summary>
        /// Servicios Realizados de Acuerdo a un rango de fechas
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult ServicesInRange(DateTime? from, DateTime? to, String type)
        {
            DateTime fromDate = DateTime.Now.Date;
            if (from.HasValue == true)
            {
                fromDate = from.Value.Date;
            }

            DateTime toDate = DateTime.Now.Date;
            if (to.HasValue == true)
            {
                toDate = to.Value.Date;
            }
            return new Data.Reports.ServicesInRange(fromDate, toDate, type);
        }

        /// <summary>
        /// Imagenes Realizadas de Acuerdo a un rango de fechas
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult ImagesInRange(DateTime? from, DateTime? to, String type)
        {
            DateTime fromDate = DateTime.Now.Date;
            if (from.HasValue == true)
            {
                fromDate = from.Value.Date;
            }

            DateTime toDate = DateTime.Now.Date;
            if (to.HasValue == true)
            {
                toDate = to.Value.Date;
            }
            return new Data.Reports.ImagesInRange(fromDate, toDate, type);
        }

        [HttpGet]
        public IHttpActionResult DailyMovements(DateTime? from, DateTime? to, String type)
        {
            DateTime fromDate = DateTime.Now.Date;
            if (from.HasValue == true)
            {
                fromDate = from.Value.Date;
            }

            DateTime toDate = DateTime.Now.Date;
            if (to.HasValue == true)
            {
                toDate = to.Value.Date;
            }
            return new Data.Reports.DailyMovements(fromDate, toDate, type);
        }
    }
}