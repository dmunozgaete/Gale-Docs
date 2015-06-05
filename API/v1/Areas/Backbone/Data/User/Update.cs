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
    public class Update : Karma.REST.Http.HttpUpdateActionResult<Models.User>
    {
        List<string> _profiles = null;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="token">User Token</param>
        /// <param name="user">Target Model</param>
        /// <param name="profiles">Profiles</param>
        public Update(string token , Models.User user, List<String> profiles) : base(token, user) {
            _profiles = profiles;
        }

       /// <summary>
       ///  Update User
       /// </summary>
       /// <param name="token"></param>
       /// <param name="cancellationToken"></param>
       /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(string token, System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => Model.language == String.Empty, "LANGUAGE_EMPTY", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => Model.name == String.Empty, "NAME_EMPTY", API.Resources.Errors.ResourceManager);
            Karma.Exception.RestException.Guard(() => Model.email == String.Empty, "EMAIL_EMPTY", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_UPD_Usuario"))
            {
                svc.Parameters.Add("USUA_Token", token);
                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("LANG_Nombre", Model.language);
                svc.Parameters.Add("ENTI_Nombre", Model.name);
                svc.Parameters.Add("ENTI_Email", Model.email);

                if (Model.photo != null && Model.photo != System.Guid.Empty)
                {
                    svc.Parameters.Add("ARCH_Token", Model.photo);
                }

               svc.Parameters.Add("PRF_Tokens", String.Join(",", _profiles));

                this.ExecuteAction(svc);
            }
            //------------------------------------------------------------------------------------------------------

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.PartialContent);

            return Task.FromResult(response);
        }
    }
}