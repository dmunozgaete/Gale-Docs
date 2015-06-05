using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{

    /// <summary>
    /// Tipo de Poligono
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class PolygonTypeController : Karma.REST.KarmaController<Models.TipoPoligono>
    {

        /// <summary>
        /// Obtiene el Listado de Tipos de Poligono Disponibles 
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.TipoPoligono>))]
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// Inserta un nuevo registro de Tipo de Poligono
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            var model = payload.ToObject<Models.TipoPoligono>();

            return new Data.PolygonType.Create(model);
        }

        /// <summary>
        /// Actualiza un Registro de Tipo de Poligono
        /// </summary>
        /// <param name="id"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            var model = payload.ToObject<Models.TipoPoligono>();

            return new Data.PolygonType.Update(id, model);
        }

        /// <summary>
        /// Elimina un Registro de Tipo de Poligono
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IHttpActionResult Delete(string id)
        {
            return new Data.PolygonType.Delete(id);
        }

    }
}