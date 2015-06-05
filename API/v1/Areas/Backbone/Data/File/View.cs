using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Backbone.Data.File
{
    /// <summary>
    /// Authentication API
    /// </summary>
    public class View : Karma.REST.Http.HttpActionResult
    {
        string _token;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="token">Token del Archivo</param>
        public View(String token)
        {
            _token = token;
        }

        /// <summary>
        /// Obtiene la foto del usuario
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MAE_SEL_ArchivoBinario"))
            {
                svc.Parameters.Add("ARCH_Token", _token);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.FileData file = rep.GetModel<Models.FileData>().FirstOrDefault();

                if (file == null)
                {
                    return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.NotFound));
                }

                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new StreamContent(new System.IO.MemoryStream(file.binary.ToArray())),
                };

                //Add Content-Type Header
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.contentType);

                return Task.FromResult(response);
            }
            //------------------------------------------------------------------------------------------------------

        }

    }
}