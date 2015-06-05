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
    public class Create : Karma.REST.Http.HttpCreateActionResult<Models.User>
    {
        List<string> _profiles = null;
        string _host = null;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="user">Target Model</param>
        /// <param name="profiles">Profiles</param>
        public Create(Models.User user, List<String> profiles, string host)
            : base(user)
        {
            _profiles = profiles;
            _host = host;
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
            Karma.Exception.RestException.Guard(() => Model.language == String.Empty, "LANGUAGE_EMPTY", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => Model.name == String.Empty, "NAME_EMPTY", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => Model.email == String.Empty, "EMAIL_EMPTY", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            string temporal_password = Karma.Security.Cryptography.MD5.GenerateHash(System.Web.Security.Membership.GeneratePassword(20, 3));

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_INS_Usuario"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("LANG_Nombre", Model.language);
                svc.Parameters.Add("ENTI_Nombre", Model.name);
                svc.Parameters.Add("ENTI_Email", Model.email);
                svc.Parameters.Add("USUA_Contrasena", temporal_password);

                if (Model.photo != null && Model.photo != System.Guid.Empty)
                {
                    svc.Parameters.Add("ARCH_Token", Model.photo);
                }

                svc.Parameters.Add("PRF_Tokens", String.Join(",", _profiles));



                //----------------------------------------------------------------------
                List<System.Security.Claims.Claim> claims = new List<System.Security.Claims.Claim>();

                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, Model.email));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.PrimarySid, Model.email));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, Model.name));

                //RETURN TOKEN 
                var token = Karma.Security.Oauth.Jwt.Manager.CreateToken(claims, DateTime.Now.AddMinutes(60 * 2));  //2 Horas
                //----------------------------------------------------------------------


                //----------------------------------------------------------------------
                string baseUrl = _host.Substring(0, _host.IndexOf("#"));

                dynamic email = new Postal.Email("Activate");
                email.To = Model.email;
                email.Nombre = Model.name;
                email.Url = String.Format("{0}#/account/password/create/{1}", baseUrl, token.access_token);
                email.Send();
                //----------------------------------------------------------------------

                this.ExecuteAction(svc);
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created);

            return Task.FromResult(response);
        }
    }
}