using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Reports
{
    public class DailyMovements: Karma.REST.Http.HttpActionResult
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
        public DailyMovements(DateTime desde, DateTime hasta, string type)
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

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_REPORTING_MovimientoDiario"))
            {
                svc.Parameters.Add("uneg", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("desde", _desde);
                svc.Parameters.Add("hasta", _hasta);
                svc.Parameters.Add("tise", _type);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.MovimientosDiarios> items = rep.GetModel<Models.MovimientosDiarios>(0);

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