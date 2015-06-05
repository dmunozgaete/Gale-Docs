using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;
using System.Text;
using System.IO;
using System.Web.UI;
using API.Areas.Resiter.Controllers;



namespace API.Areas.Backbone.Data.CambiarPassword
{

    /// <summary>
    /// Verificard Email Usuario
    /// </summary>
    public class VerificarEmailUsuario : Karma.REST.Http.HttpActionResult
    {
        string _email   = null;
        string _host    = null;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="email">Email</param>
        /// <param name="host">Host</param>
        public VerificarEmailUsuario(string email, string host)
        {
            _email  = email;
            _host   = host;
        }

        /// <summary>
        /// Ejecutar Accion
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_VerificarUsuario"))
            {
                svc.Parameters.Add("@USUA_Email", _email);

                var rep = this.ExecuteScalar(svc);

                if (!rep.Equals(0)){

                    //----------------------------------------------------------------------
                    List<System.Security.Claims.Claim> claims = new List<System.Security.Claims.Claim>();

                    claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, _email));
                    claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.PrimarySid, _email));

                    //RETURN TOKEN 
                    var token = Karma.Security.Oauth.Jwt.Manager.CreateToken(claims, DateTime.Now.AddMinutes(60 * 2));  //2 Horas
                    //----------------------------------------------------------------------


                    //----------------------------------------------------------------------
                    //string baseUrl = _host.Substring(0, _host.IndexOf("#"));
                    var url = String.Format("{0}#/account/password/recovery/{1}", _host, token.access_token);
                    MailMessage message;
                    SmtpClient smtp;                
                    message = new MailMessage();
                    message.To.Add(_email);
                    message.Subject = "Recuperacion de Contreña";
                    message.From = new MailAddress("soporte@valentys.com");
                    message.Body = "Para inicar el proceso de recuperaci&oacute;n <a href="+ url +">Haga click aqu&iacute;</a>";
                    message.IsBodyHtml = true;

                    // set smtp details
                    smtp = new SmtpClient("outlook.office365.com");
                    smtp.Port = 587;
                    smtp.EnableSsl = true;
                    smtp.Credentials = new NetworkCredential("soporte@valentys.com", "Lyon2015");
                    smtp.Send(message);                    

                    //Send Response
                    HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                    {
                        Content = new ObjectContent<Object>(
                            new
                            {
                                respuesta = rep
                            },
                            System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                        )
                    };
                    return Task.FromResult(response);

                }else{

                    //Send Response
                    HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                    {
                        Content = new ObjectContent<Object>(
                            new
                            {
                                respuesta = rep
                            },
                            System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                        )
                    };
                    return Task.FromResult(response);

                }
                
            }
            //------------------------------------------------------------------------------------------------------
        }

    }
}