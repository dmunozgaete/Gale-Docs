using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Programming
{
    /// <summary>
    /// Account Access
    /// </summary>
    public class ProgrammingDetails : Karma.REST.Http.HttpActionResult
    {
        DateTime _month = DateTime.Now.Date;
        String _type = null;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="month"></param>
        /// <param name="type"></param>
        public ProgrammingDetails(DateTime month, string type)
        {
            _month = month;
            _type = type;
        }

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_ProgramacionMensual"))
            {
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("TISE_Token", _type);
                svc.Parameters.Add("FECHA", _month);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.ProgramacionServicio service = rep.GetModel<Models.ProgramacionServicio>().FirstOrDefault();
                Karma.Db.EntityTable<Models.PoligonoServicio> polygons = rep.GetModel<Models.PoligonoServicio>(1);
                Karma.Db.EntityTable<Models.Programacion> programming = rep.GetModel<Models.Programacion>(2);

                List<Object> _polygons = new List<object>();
                polygons.ForEach((item) =>
                {
                    _polygons.Add(new
                    {
                        nombre = item.nombre,
                        token = item.token,
                        dias = (from t in programming
                               where t.poligono == item.codigo
                               select t.fecha.Day).ToList()
                    });
                });

                var _service = new
                {
                    token = service.token,
                    imagen = service.imagen,
                    nombre = service.nombre,
                    polygons = _polygons
                };


                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                       _service,
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };

                //Return Task
                return Task.FromResult(response);
                //----------------------------------------------------------------------------------------------------
            }
        }
    }
}