using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Actualiza un Registro
    /// </summary>
    public class Create : Karma.REST.Http.HttpCreateActionResult<String>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public Create(String T) : base(T) { }


        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "SUCURSAL_REQUERIDA", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_INS_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("SUCU_Token", Model);
                var repo = this.ExecuteQuery(svc);

                Models.UnidadDeNegocio item = repo.GetModel<Models.UnidadDeNegocio>().FirstOrDefault();

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created)
                {
                    Content = new ObjectContent<Object>(
                        item,
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}