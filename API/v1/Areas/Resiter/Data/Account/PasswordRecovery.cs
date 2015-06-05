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
    public class PasswordRecovery: Karma.REST.Http.HttpCreateActionResult<String>
    {
        string _host;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="T"></param>
        public PasswordRecovery(String token, string host)
            : base(token)
        {
            _host = host;
        }


        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_InformacionUsuario"))
            {
                svc.Parameters.Add("USUA_Token", Model);

                var rep = this.ExecuteQuery(svc);

                var usuario = rep.GetModel<API.Areas.Backbone.Models.User>().FirstOrDefault();


                //----------------------------------------------------------------------
                List<System.Security.Claims.Claim> claims = new List<System.Security.Claims.Claim>();

                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, usuario.email));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.PrimarySid, usuario.email));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, usuario.name));

                //RETURN TOKEN 
                var token = Karma.Security.Oauth.Jwt.Manager.CreateToken(claims, DateTime.Now.AddMinutes(60 * 2));  //2 Horas
                //----------------------------------------------------------------------


                //----------------------------------------------------------------------
                string baseUrl = _host.Substring(0, _host.IndexOf("#"));

                dynamic email = new Postal.Email("Recovery");
                email.To = usuario.email;
                email.Nombre = usuario.name;
                email.Url = String.Format("{0}#/account/password/recovery/{1}", baseUrl, token.access_token);
                email.Send();
                //----------------------------------------------------------------------

                //----------------------------------------------------------------------------------------------------
                //Create Response
                return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.OK));
                //----------------------------------------------------------------------------------------------------

            }

        }
    }
}