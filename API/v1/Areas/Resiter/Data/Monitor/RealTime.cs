using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Monitor
{
    /// <summary>
    /// 
    /// </summary>
    public class RealTime : Karma.REST.Http.HttpActionResult
    {

        DateTime _fecha = DateTime.Now.Date;

        /// <summary>
        /// Resumen de Unidad de Negocio
        /// </summary>
        /// <param name="fecha"></param>
        public RealTime(DateTime fecha)
        {
            _fecha = fecha;
        }

        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("[PA_MDS_SEL_DatosTiempoReal]"))
            {
                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("SERC_Fecha", _fecha);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.CoordenadaConductor> drivers = rep.GetModel<Models.CoordenadaConductor>();
                Karma.Db.EntityTable<Models.TB_GPS_ServicioConductor> points = rep.GetModel<Models.TB_GPS_ServicioConductor>(1);

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            drivers = new
                            {
                                total = drivers.Count,
                                items = drivers
                            },

                            points = new
                            {
                                total = points.Count,
                                items = points
                            }
                        },
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };

                //Return Task
                return Task.FromResult(response);

            }
        }
    }
}