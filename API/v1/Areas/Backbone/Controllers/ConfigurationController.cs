using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Backbone.Administration
{
    /*
    /// <summary>
    /// Configuración de la aplicación 
    /// </summary>
   // [Karma.Security.Oauth.Jwt.Authorize]
    public class ConfigurationController : Karma.REST.KarmaController<Models.Configuracion>
    {

        /// <summary>
        /// Extrae la configuración del sistema
        /// </summary>
        /// <returns>Colección de Entidades de Configuración</returns>
        [ResponseType(typeof(List<Models.Configuracion>))]
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// Inserta un registro de configuración en el origen de datos
        /// </summary>
        /// <param name="payload">Objeto JSON con los valores del modelo</param>
        /// <response code="201">Registro Creado</response>
        /// <response code="500">Error no Identificado</response>
        public override IHttpActionResult Post([FromBody]Newtonsoft.Json.Linq.JToken payload)
        {
            return base.Post(payload);
        }

        /// <summary>
        /// Actualiza un registro de configuración en el origen de datos
        /// </summary>
        /// <param name="id">Identificador del registro a actualizar (Token)</param>
        /// <param name="payload">Objeto JSON con los valores del modelo</param>
        /// <response code="206">Registro Actualizado</response>
        /// <response code="500">Internal Server Error</response>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            return base.Put(id, payload);
        }

        /// <summary>
        /// Elimina un registro de confguración en el origen de datos
        /// </summary>
        /// <param name="id">Identificador del registro a eliminar (Token)</param>
        /// <response code="200">Deleted</response>
        /// <response code="500">Internal Server Error</response>
        public override IHttpActionResult Delete(string id)
        {
            return base.Delete(id);
        }
    }
     * */
}