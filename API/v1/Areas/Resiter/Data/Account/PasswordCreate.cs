using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Account
{
    /// <summary>
    /// Account Access
    /// </summary>
    public class PasswordCreate : Karma.REST.Http.HttpCreateActionResult<String>
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="T"></param>
        public PasswordCreate(String T)
            : base(T)
        {

        }


        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_ContrasenaUsuario"))
            {
                svc.Parameters.Add("USUA_Email", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("USUA_Contrasena", Karma.Security.Cryptography.MD5.GenerateHash(Model));

                this.ExecuteAction(svc);

                //----------------------------------------------------------------------------------------------------
                //Create Response
                return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.Created));
                //----------------------------------------------------------------------------------------------------

            }

        }
    }
}