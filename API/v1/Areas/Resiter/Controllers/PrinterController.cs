using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class PrinterController : Karma.REST.RestController
    {

        /// <summary>
        /// Descarga la hoja de ruta de un conductor en PDF
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Routes(string driver, string businessUnit, DateTime? date)
        {
            DateTime routeDate = DateTime.Now.Date;
            if (date.HasValue == true)
            {
                routeDate = date.Value.Date;
            }

            return new Data.Printer.Route(driver, routeDate, businessUnit);
        }

        /// <summary>
        ///Excel de Servicios
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Services(string type, string businessUnit, DateTime? from, DateTime? to)
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

            return new Data.Printer.Services(type , fromDate, toDate, businessUnit);
        }

        /// <summary>
        ///Excel de Servicios
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult ServicesInRange(string type, string businessUnit, DateTime? from, DateTime? to)
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

            return new Data.Printer.ServicesInRange(type, fromDate, toDate, businessUnit);
        }


        [HttpGet]
        public IHttpActionResult DailyMovements(string type, string businessUnit,DateTime? from, DateTime? to)
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
            return new Data.Printer.DailyMovements(type, fromDate, toDate, businessUnit);
        }


    }
}