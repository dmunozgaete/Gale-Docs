using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Areas.Resiter.Controllers
{
    /// <summary>
    /// Unidades de Negocio del Usuario
    /// </summary>
   // [Karma.Security.Oauth.Jwt.Authorize]
    public class SgsController : Karma.REST.KarmaController<Models.UnidadDeNegocio>
    {
        /// <summary>
        /// Obtiene los Clientes actuales de Resiter (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Cliente>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Cliente))]
        [HttpGet]
        public  IHttpActionResult Clients()
        {
            return base.Get();
        }

        /// <summary>
        /// Obtiene las sucursales del cliente seleccionado (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Sucursal>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Sucursal))]
        [HttpGet]
        public IHttpActionResult Branchs()
        {
            return base.Get();
        }

        /// <summary>
        /// Obtiene los vehiculos de Resiter (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Vehiculo>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Vehiculo))]
        [HttpGet]
        public IHttpActionResult Vehicles()
        {
            return base.Get();
        }


        /// <summary>
        /// Obtiene los conductores de Resiter (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Conductor>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Conductor))]
        [HttpGet]
        public IHttpActionResult Drivers()
        {
            return base.Get();
        }

        /// <summary>
        /// Obtiene los contratos de Resiter (SGS)
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Contrato>))]
        [Karma.REST.Queryable.Primitive.Mapping.Model(typeof(Models.Contrato))]
        [HttpGet]
        public IHttpActionResult Contracts()
        {
            return base.Get();
        }


        #region NO IMPLEMENTADO 

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.UnidadDeNegocio>))]
        public override IHttpActionResult Get()
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="id"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Put(string id, Newtonsoft.Json.Linq.JToken payload)
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IHttpActionResult Delete(string id)
        {
            throw new NotSupportedException();
        }

        #endregion
    }
}