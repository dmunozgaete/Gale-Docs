using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.BusinessUnit
{
    /// <summary>
    /// Ingresa un Conductor a la unidad de negocio
    /// </summary>
    public class AddServices : Karma.REST.Http.HttpCreateActionResult<List<Models.Servicio>>
    {

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public AddServices(List<Models.Servicio> T) : base(T) { }


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

            List<int> services = new List<int>();
            foreach (var service in Model)
            {
                //------------------------------------------------------------------------------------------------------
                // DB Execution: Inserta o Actualiza una Configuración para un servicio
                using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_Servicio_UnidadDeNegocio"))
                {

                    svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                    svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());

                    svc.Parameters.Add("CNTR_Token", service.contrato);
                    svc.Parameters.Add("COMP_FotoNOK", service.fotoNOK);
                    svc.Parameters.Add("COMP_FotoOk", service.fotoOk);
                    svc.Parameters.Add("COMP_HojaRuta", service.hojaRuta);
                    svc.Parameters.Add("COMP_LecturaQR", service.lecturaQR);
                    svc.Parameters.Add("COMP_Disposicion", service.disposicion);

                    svc.Parameters.Add("TISE_Token", service.token);

                    int id = (int)this.ExecuteScalar(svc);

                    services.Add(id);    //Id del servcio creado
                }
                //------------------------------------------------------------------------------------------------------
            }


            //------------------------------------------------------------------------------------------------------
            // DB Execution: Remueve todos los servicios que no fueron actualizados o creados
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_DEL_Servicio_UnidadDeNegocio"))
            {

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("SERV_Tokens", String.Join("," , services));

                this.ExecuteAction(svc);

                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------

        }
    }
}