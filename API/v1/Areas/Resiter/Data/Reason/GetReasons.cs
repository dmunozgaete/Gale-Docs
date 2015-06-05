using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Reason
{
    public class GetReasons : Karma.REST.Http.HttpActionResult
    {
        Guid Token;
        public GetReasons(Guid Token) {
            this.Token = Token;
        }

        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService ds = new Karma.Db.DataService("PA_MDS_SEL_MOTIVO_TIPOSERVICIO"))
            {
                ds.Parameters.Add("TISE_Token", Token);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(ds);

                Karma.Db.EntityTable<Models.Motivo> _items = rep.GetModel<Models.Motivo>();


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
            }
        }
    }
}