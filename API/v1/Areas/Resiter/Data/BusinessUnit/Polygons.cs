using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Account Access
    /// </summary>
    public class Polygons : Karma.REST.Http.HttpActionResult
    {

        /// <summary>
        /// Task
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Poligonos_UnidadDeNegocio"))
            {
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.Sucursal sucursal = rep.GetModel<Models.Sucursal>().FirstOrDefault();
                Karma.Db.EntityTable<Models.Poligono> poligonos = rep.GetModel<Models.Poligono>(1);
                Karma.Db.EntityTable<Models.TB_MDS_CoordenadasPoligono> coordenadas = rep.GetModel<Models.TB_MDS_CoordenadasPoligono>(2);
                Karma.Db.EntityTable<Models.TB_MDS_TipoServicio> servicios = rep.GetModel<Models.TB_MDS_TipoServicio>(3);

                poligonos.ForEach((poligono) =>
                {

                    poligono.coordenadas = (from t in coordenadas
                                            where t.POLI_Token == poligono.token
                                            orderby t.CORD_Ordinal ascending
                                            select new Models.Coordenada()
                                            {
                                                lat = t.CORD_Latitud,
                                                lng = t.CORD_Longitud
                                            }).ToList();

                    poligono.servicios = (from t in servicios
                                          where t.POLI_Token == poligono.token
                                          select t.TISE_Token.ToString()).ToList();

                });

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            viewport = sucursal,
                            polygons = poligonos
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