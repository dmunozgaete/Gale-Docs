using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Vehiculo a la unidad de negocio
    /// </summary>
    public class UpdateRoutes : Karma.REST.Http.HttpCreateActionResult<List<Models.PuntoRuta>>
    {
        Models.Conductor _driver = null;
        DateTime _date;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public UpdateRoutes(DateTime date, Models.Conductor driver, List<Models.PuntoRuta> T)
            : base(T)
        {
            _driver = driver; ;
            _date = date;
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
            //Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "VEHICULO_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            if (_driver.imagen != null && _driver.imagen != System.Guid.Empty)
            {
                //------------------------------------------------------------------------------------------------------
                // DB Execution
                using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_Update_AvatarConductor"))
                {

                    svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                    svc.Parameters.Add("COND_Token", _driver.token);
                    svc.Parameters.Add("ARCH_Token", _driver.imagen);
                    this.ExecuteAction(svc);

                }
                //------------------------------------------------------------------------------------------------------
            }

            foreach (var point in Model)
            {
                switch (point.estado)
                {
                    case "_CREATED":
                        //------------------------------------------------------------------------------------------------------
                        // DB Execution
                        using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_INS_PuntoRuta_UnidadDeNegocio"))
                        {
                            svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                            svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                            svc.Parameters.Add("COND_Token", point.conductor);
                            svc.Parameters.Add("POLI_Token", point.poligono);
                            svc.Parameters.Add("TISE_Token", point.tipo);
                            svc.Parameters.Add("VEHI_Token", point.vehiculo);
                            //svc.Parameters.Add("RUTA_Token", point.token);
                            svc.Parameters.Add("RUTA_Fecha", _date);

                            this.ExecuteAction(svc);
                        }
                        //------------------------------------------------------------------------------------------------------
                        break;
                    case "_REMOVED":
                        //------------------------------------------------------------------------------------------------------
                        // DB Execution
                        using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_DEL_PuntoRuta_UnidadDeNegocio"))
                        {
                            svc.Parameters.Add("RUTA_Token", point.token);

                            this.ExecuteAction(svc);
                        }
                        //------------------------------------------------------------------------------------------------------
                        break;
                }
            }

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.PartialContent); ;
            return Task.FromResult(response);
        }
    }
}