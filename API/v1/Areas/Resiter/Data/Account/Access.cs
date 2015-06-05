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
    public class Access : Karma.REST.Http.HttpActionResult
    {

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Escritorio"))
            {
                svc.Parameters.Add("USUA_Token", HttpContext.Current.User.PrimarySid());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Karma.Db.EntityTable<Models.UnidadDeNegocio> businessUnits = rep.GetModel<Models.UnidadDeNegocio>();
                Karma.Db.EntityTable<Models.Menu> menu = rep.GetModel<Models.Menu>(1);

                //-------------------------------------------------------
                var _categories = menu.GroupBy((item) =>
                {
                    return item.categoria;
                });
                //-------------------------------------------------------

                //-------------------------------------------------------
                List<Object> _menu = new List<Object>();
                foreach (var category in _categories)
                {
                    var items = new List<Object>();
                    foreach (var item in category)
                    {
                        items.Add(new
                        {
                            label = item.nombre,
                            url = item.url,
                            icon = new
                            {
                                name = item.icono,
                                category = item.categoriaIcono
                            }
                        });
                    }

                    _menu.Add(new
                    {
                        name = category.Key,
                        open = true,
                        items = items
                    });
                }
                //-------------------------------------------------------


                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            businessUnits = businessUnits,
                            menu = _menu
                        },
                        System.Web.Http.GlobalConfiguration.Configuration.Formatters.JsonFormatter
                    )
                };

                //Return Task
                return Task.FromResult(response);
                //----------------------------------------------------------------------------------------------------

            }

        }
    }
}