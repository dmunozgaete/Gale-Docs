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
    [Karma.Security.Oauth.Jwt.Authorize]
    public class BusinessUnitController : Karma.REST.KarmaController<Models.UnidadDeNegocio>
    {

        /// <summary>
        /// Obtiene el listado de unidades de negocio del sistema
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.UnidadDeNegocio>))]
        public override IHttpActionResult Get()
        {
            return base.Get();
        }

        /// <summary>
        /// No Implementado
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public override IHttpActionResult Post(Newtonsoft.Json.Linq.JToken payload)
        {
            string branch = payload.Value<String>("branch");

            return new Data.BusinessUnit.Create(branch);
        }

        /// <summary>
        /// Obtiene la informacion de la unidad de negocio actual
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ResponseType(typeof(Models.ResumenUnidadNegocio))]
        public IHttpActionResult Resume()
        {
            return new Data.BusinessUnit.Resume();
        }

        #region Endpoint: /Vehicles

        /// <summary>
        /// Obtiene los vehiculos de la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Vehiculo>))]
        [HttpGet]
        public IHttpActionResult Vehicles()
        {
            return new Data.BusinessUnit.Vehicles();
        }

        /// <summary>
        /// Asocia un vehiculo a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Vehicles(Newtonsoft.Json.Linq.JToken payload)
        {
            string token = payload.Value<String>("token");

            return new Data.BusinessUnit.AddVehicle(token);
        }

        /// <summary>
        /// Desasocia un vehiculo a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public IHttpActionResult Vehicles(string id)
        {
            return new Data.BusinessUnit.RemoveVehicle(id);
        }

        #endregion

        #region Endpoint: /Drivers

        /// <summary>
        /// Obtiene los conductores de la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Conductor>))]
        [HttpGet]
        public IHttpActionResult Drivers()
        {
            return new Data.BusinessUnit.Drivers();
        }

        /// <summary>
        /// Asocia un conductor a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Drivers(Newtonsoft.Json.Linq.JToken payload)
        {
            string token = payload.Value<String>("token");

            return new Data.BusinessUnit.AddDriver(token);
        }

        /// <summary>
        /// Desasocia un conductor a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public IHttpActionResult Drivers(string id)
        {
            return new Data.BusinessUnit.RemoveDriver(id);
        }

        #endregion

        #region Endpoint: /Services

        /// <summary>
        /// Obtiene los servicios de la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.TipoServicio>))]
        [HttpGet]
        public IHttpActionResult Services()
        {
            return new Data.BusinessUnit.Services();
        }

        /// <summary>
        /// Asocia un servicio a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Services(Newtonsoft.Json.Linq.JToken payload)
        {
            List<Models.Servicio> services = payload.ToObject <List<Models.Servicio>>();

            return new Data.BusinessUnit.AddServices(services);
        }

        #endregion

        #region Endpoint: /Polygons

        /// <summary>
        /// Obtiene los servicios de la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Poligono>))]
        [HttpGet]
        public IHttpActionResult Polygons()
        {
            return new Data.BusinessUnit.Polygons();
        }

        /// <summary>
        /// Asocia un servicio a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Polygons(Newtonsoft.Json.Linq.JToken payload)
        {
            //Models.Coordenada viewport = payload["viewport"].ToObject<Models.Coordenada>();
            Models.Poligono polygon = payload.ToObject<Models.Poligono>();

            return new Data.BusinessUnit.AddPolygon(polygon);
        }

        /// <summary>
        /// Elimina un Poligono
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public IHttpActionResult Polygons(string id)
        {
            return new Data.BusinessUnit.DeletePolygon(id);
        }

        #endregion

        #region Endpoint: /Routes

        /// <summary>
        /// Obtiene las rutas asignadas para la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<Models.Conductor>))]
        [HttpGet]
        public IHttpActionResult Routes(DateTime? date)
        {
            DateTime routeDate =  DateTime.Now.Date;
            if (date.HasValue == true)
            {
                routeDate = date.Value.Date;
            }
            return new Data.BusinessUnit.Routes(routeDate);
        }

        /// <summary>
        /// Asocia los puntos de ruta al conductor para el dia seleccionado
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Routes([FromUri]DateTime date, [FromBody]Newtonsoft.Json.Linq.JToken payload)
        {
            Models.Conductor driver = payload["driver"].ToObject<Models.Conductor>();
            List<Models.PuntoRuta> points = payload["points"].ToObject<List<Models.PuntoRuta>>();


            return new Data.BusinessUnit.UpdateRoutes(date.Date, driver, points);
        }

        #endregion

        #region Endpoint: /Users

        /// <summary>
        /// Obtiene los usuario de la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [ResponseType(typeof(List<API.Areas.Backbone.Models.User>))]
        [HttpGet]
        public IHttpActionResult Users()
        {
            return new Data.BusinessUnit.Users();
        }

        /// <summary>
        /// Asocia un usuario a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Users(Newtonsoft.Json.Linq.JToken payload)
        {
            string token = payload.Value<String>("token");

            return new Data.BusinessUnit.AddUser(token);
        }

        /// <summary>
        /// Desasocia un usuario a la unidad de negocio
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public IHttpActionResult Users(string id)
        {
            return new Data.BusinessUnit.RemoveUser(id);
        }

        #endregion

        #region NO IMPLEMENTADO

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