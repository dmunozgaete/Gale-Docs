using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Account
{
    /// <summary>
    /// Authentication API
    /// </summary>
    public class Avatar : Karma.REST.Http.HttpActionResult
    {

        /// <summary>
        /// Implementacion de proceso custom para la insercion de datos, utilizando el SP "PA_MAE_UNS_USUARIO" para insertar un usuario.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {

            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_Avatar"))
            {
                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.Binario file = rep.GetModel<Models.Binario>().FirstOrDefault();

                if (file == null)
                {
                    return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.NotFound));
                }

                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new StreamContent(new System.IO.MemoryStream(file.binario.ToArray())),
                };

                //Add Content-Type Header
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.tipoContenido);

                return Task.FromResult(response);

            }

        }

    }
}