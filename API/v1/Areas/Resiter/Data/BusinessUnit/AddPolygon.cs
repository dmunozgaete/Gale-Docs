using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Poligono a la unidad de negocio
    /// </summary>
    public class AddPolygon : Karma.REST.Http.HttpCreateActionResult<Models.Poligono>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T"></param>
        public AddPolygon(Models.Poligono T)
            : base(T)
        {

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
            // Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------


            //------------------------------------------------------------------------------------------------------
            // DB Execution: Inserta o Actualiza una Configuración para un servicio
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_Poligono_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                svc.Parameters.Add("POLI_Nombre", Model.nombre);
                svc.Parameters.Add("TIPO_Identificador", Model.tipo);

                //Servicios Configurados
                if (Model.servicios.Count > 0)
                {
                    svc.Parameters.Add("SERV_Tokens", String.Join(",", Model.servicios));
                }


                //Coordenadas Configurados (CREACION DE POLIGONOS)
                if (Model.coordenadas.Count > 0)
                {
                    List<string> coords = new List<string>();
                    System.Text.StringBuilder builder = new System.Text.StringBuilder();

                    builder.Append("POLYGON((");

                    var enUS_culture = new System.Globalization.CultureInfo("en-US");

                    Model.coordenadas.ForEach((item) =>
                    {
                        //POLYGON((Longitude1 Latitude1, Longitude2 Latitude2, Longitude3 Latitude3, ))
                        coords.Add(String.Format(
                            "{0} {1}",
                            item.lng.ToString(enUS_culture),
                            item.lat.ToString(enUS_culture)
                        ));
                    });


                    //Se vuelve a Agregar la Primera Coordenada (Para "Cerrar" El poligono ,para SQL Server, solo si es que no esta cerrado aún)
                    if (Model.coordenadas.First().lat != Model.coordenadas.Last().lat && Model.coordenadas.First().lat != Model.coordenadas.Last().lat)
                    {
                        coords.Add(String.Format(
                            "{0} {1}",
                            Model.coordenadas.First().lng.ToString(enUS_culture),
                            Model.coordenadas.First().lat.ToString(enUS_culture)
                        ));
                    }


                    builder.Append(String.Join(",", coords));
                    builder.Append("))");

                    svc.Parameters.Add("POLI_POLIGONO", String.Join(",", builder.ToString()));
                }

                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }

        }
    }
}