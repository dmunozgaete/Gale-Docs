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
    public class Programming : Karma.REST.Http.HttpActionResult
    {
        DateTime _month = DateTime.Now.Date;

       /// <summary>
       /// 
       /// </summary>
       /// <param name="month"></param>
        public Programming(DateTime month)
        {
            _month = month;
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
                svc.Parameters.Add("FECHA", _month);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.ProgramacionServicio> items = rep.GetModel<Models.ProgramacionServicio>();

                List<Object> _items = new List<object>();
                items.ForEach((item) =>
                {
                    _items.Add(new
                    {
                        token= item.token,
                        imagen= item.imagen,
                        nombre = item.nombre,
                        programado = item.DiasProgramados
                    });
                });
                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            items = _items
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