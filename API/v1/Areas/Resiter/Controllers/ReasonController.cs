using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{
    public class ReasonController : Karma.REST.RestController
    {
        /// <summary>
        /// Obtiene los Clientes actuales de Resiter (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Cliente>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Cliente))]
        [HttpGet]
        public  IHttpActionResult Get(Guid tokenTISE)
        {
            return new Data.Reason.GetReasons(tokenTISE);
        }

       

    }
}