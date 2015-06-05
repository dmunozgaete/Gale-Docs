using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Backbone.Data.User
{
    /// <summary>
    /// Delete User in DB
    /// </summary>
    public class Delete : Karma.REST.Http.HttpDeleteActionResult
    {
       /// <summary>
       /// Constructor
       /// </summary>
       /// <param name="token">token</param>
        public Delete(string token) : base(token) { }

        /// <summary>
        /// Delete User
        /// </summary>
        /// <param name="token"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(string token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => token == String.Empty, "TOKEN_REQUIRED", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_DEL_Usuario"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("USUA_Token", token);

                this.ExecuteAction(svc);
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.OK);

            return Task.FromResult(response);
        }
    }
}