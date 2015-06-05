using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Backbone.Data.User
{
    /// <summary>
    /// Update User in DB
    /// </summary>
    public class Roles : Karma.REST.Http.HttpActionResult
    {
        string _user = null;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="user">Target Model</param>
        public Roles(string user)
        {
            _user = user;
        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => _user == null, "USER_EMPTY", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------


            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_PerfilesUsuario"))
            {
                svc.Parameters.Add("USUA_Token", _user);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                var items = rep.GetModel<Models.UserProfile>();

                //Send Response
                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            items = items
                        },
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };
                return Task.FromResult(response);
            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}