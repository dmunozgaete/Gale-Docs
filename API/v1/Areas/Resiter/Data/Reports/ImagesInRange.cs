using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Reports
{
    /// <summary>
    /// Account Access
    /// </summary>
    public class ImagesInRange : Karma.REST.Http.HttpActionResult
    {
        DateTime _desde = DateTime.Now.Date;
        DateTime _hasta = DateTime.Now.Date;
        String _type;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="desde"></param>
        /// <param name="hasta"></param>
        /// <param name="type"></param>
        public ImagesInRange(DateTime desde, DateTime hasta, string type)
        {
            _desde = desde;
            _hasta = hasta;
            _type = type;
        }

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_RPT_ImagenesPorRango"))
            {
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("TISE_Token", _type);
                svc.Parameters.Add("Desde", _desde);
                svc.Parameters.Add("Hasta", _hasta);
                
                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.ServicioRealizado> items = rep.GetModel<Models.ServicioRealizado>();

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            items = items
                        },
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