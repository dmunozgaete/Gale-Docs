using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{

    /// <summary>
    /// Unidades de Negocio del usuario
    /// </summary>
    [Karma.Security.Oauth.Jwt.Authorize]
    public class ServiceTypeController : Karma.REST.KarmaController<Models.TipoServicio>
    {

        /// <summary>
        /// Obtiene el Listado de Tipos de Servicios Disponibles 
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.TipoServicio>))]
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// Inserta un nuevo registro de Tipo de Servicio
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            var model = payload.ToObject<Models.TipoServicio>();

            return new Data.ServiceType.Create(model);
        }

        /// <summary>
        /// Actualiza un Registro de Tipo de Servicio
        /// </summary>
        /// <param name="id"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            var model = payload.ToObject<Models.TipoServicio>();

            return new Data.ServiceType.Update(id, model);
        }

        /// <summary>
        /// Elimina un Registro de Tipo de Servicio
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IHttpActionResult Delete(string id)
        {
            return new Data.ServiceType.Delete(id);
        }

    }
}