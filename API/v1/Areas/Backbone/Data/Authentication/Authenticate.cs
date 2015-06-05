using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Backbone.Data.Authentication
{
    /// <summary>
    /// Authentication API
    /// </summary>
    public class Authenticate : Karma.REST.Http.Generic.HttpActionResult<Models.Authenticate>
    {
        HttpRequestMessage _request;    //Only for Content Negotiation

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="request"></param>
        /// <param name="user"></param>
        public Authenticate(HttpRequestMessage request, Models.Authenticate user)
            : base(user)
        {
            _request = request;
        }

        /// <summary>
        /// Implementacion de proceso custom para la insercion de datos, utilizando el SP "PA_MAE_UNS_USUARIO" para insertar un usuario.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_AutenticarUsuario"))
            {
                svc.Parameters.Add("USUA_NombreUsuario", Model.username);
                svc.Parameters.Add("USUA_Contrasena", Karma.Security.Cryptography.MD5.GenerateHash(Model.password));
                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.User user = rep.GetModel<Models.User>(0).FirstOrDefault();
                Karma.Db.EntityTable<Models.Profile> perfiles = rep.GetModel<Models.Profile>(1);

                //------------------------------------------------------------------------------------------------------------------------
                //GUARD EXCEPTION
                Karma.Exception.RestException.Guard(() => user == null, "USERNAME_OR_PASSWORD_INCORRECT", API.Resources.Errors.ResourceManager);
                //------------------------------------------------------------------------------------------------------------------------

                List<System.Security.Claims.Claim> claims = new List<System.Security.Claims.Claim>();

                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.email));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.PrimarySid, user.token.ToString()));
                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.name));
                claims.Add(new System.Security.Claims.Claim("photo", user.photo.ToString()));
                perfiles.ForEach((perfil) =>
                {
                    claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, perfil.identifier));
                });

                int Timeout = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["Karma:Security:TokenTmeout"]);

                //RETURN TOKEN
                return Task.FromResult(_request.CreateResponse<Karma.Security.Oauth.Jwt.Wrapper>(
                    Karma.Security.Oauth.Jwt.Manager.CreateToken(claims, DateTime.Now.AddMinutes(Timeout))
                ));


            }

        }

    }
}