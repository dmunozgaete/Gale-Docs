using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Areas.Resiter.Data.Dashboard
{
    /// <summary>
    /// Get Dashboard Information
    /// </summary>
    public class GetResume : Karma.REST.Http.HttpActionResult
    {

        DateTime _fecha = DateTime.Now.Date;

        /// <summary>
        /// Resumen de Unidad de Negocio
        /// </summary>
        /// <param name="fecha"></param>
        public GetResume(DateTime fecha)
        {
            _fecha = fecha;
        }

        /// <summary>
        /// Get Items
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            HttpContext.Current.User.PrimarySid();
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_SEL_Estadisticas"))
            {
                svc.Parameters.Add("USUA_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("Fecha", _fecha);

                Karma.Db.EntityRepository rep = this.ExecuteQuery(svc);

                Models.Estadistica total = rep.GetModel<Models.Estadistica>().FirstOrDefault();
                Models.Estadistica programados = rep.GetModel<Models.Estadistica>(1).FirstOrDefault();
                Models.Estadistica adicionales = rep.GetModel<Models.Estadistica>(2).FirstOrDefault();
                Karma.Db.EntityTable<Models.Estadistica_Conductor> conductores = rep.GetModel<Models.Estadistica_Conductor>(3);

                //------------------------------------------------------------------------------------------------------------------------
                //GUARD EXCEPTION
                Karma.Exception.RestException.Guard(() => total == null, "STADISTICS_TOTAL_ERROR", API.Resources.Errors.ResourceManager);
                Karma.Exception.RestException.Guard(() => programados == null, "STADISTICS_PROGRAMMED_ERROR", API.Resources.Errors.ResourceManager);
                Karma.Exception.RestException.Guard(() => adicionales == null, "STADISTICS_ADDITIONAL_ERROR", API.Resources.Errors.ResourceManager);
                //------------------------------------------------------------------------------------------------------------------------


                //----------------------------------------------------------------------------------------------------
                // CUSTOM DRIVERS ARRAY 
                List<Object> drivers = new List<object>();
                conductores.ForEach((item)=>{
                    drivers.Add(new {
                        name = item.nombre,
                        photo = item.imagen,
                        run = item.run,
                        dv = item.dv,
                        sgs = item.sgs,
                        token = item.token,
                        services = new
                        {
                            completed = item.completados,
                            total = item.total,
                            totalprogramados =item.TotalProgramados,
                            totaladicionales = item.TotalAdicionales,
                            programadosrealizados = item.ProgramadosRealizados,
                            programadosfallidos = item.ProgramadosFallidos,
                            adicionalesrealizados = item.AdicionalesRealizados,
                            adicionalesfallidos = item.AdicionalesFallidos

                        }
                    });
                });
                //----------------------------------------------------------------------------------------------------

                //----------------------------------------------------------------------------------------------------
                //Create Response
                var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Object>(
                        new
                        {
                            total = total.total,
                            realized = total.realizados,

                            programmed = new {
                                total = programados.total,
                                realized = programados.realizados,
                                failed = programados.fallidos
                            },

                            additional = new
                            {
                                total = adicionales.total,
                                realized = adicionales.realizados,
                                failed = adicionales.fallidos
                            },

                            drivers = drivers
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