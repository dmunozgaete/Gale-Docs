using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.Programming
{
    /// <summary>
    /// 
    /// </summary>
    public class UpdateProgramming : Karma.REST.Http.HttpCreateActionResult<String>
    {
        DateTime _month;
        List<Models.DiaProgramado> _program;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="T"></param>
        /// <param name="month"></param>
        /// <param name="program"></param>
        public UpdateProgramming(String T, DateTime month, List<Models.DiaProgramado> program)
            : base(T)
        {
            _month = month;
            _program = program;
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
            //Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            foreach (var polygon in _program)
            {

                List<String> days = new List<string>();
                foreach (var day in polygon.dias)
                {
                    days.Add(day.ToString().PadLeft(2,'0'));
                }

                //------------------------------------------------------------------------------------------------------
                // DB Execution
                using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_MDS_UPD_ProgramacionMensual"))
                {

                    svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                    svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                    svc.Parameters.Add("TISE_Token", this.Model);
                    svc.Parameters.Add("POLI_Token", polygon.poligono);
                    svc.Parameters.Add("Fecha", _month);
                    svc.Parameters.Add("Dias", String.Join(",", days));

                    this.ExecuteAction(svc);
                }
                //------------------------------------------------------------------------------------------------------

            }

            HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;
            return Task.FromResult(response);

        }
    }
}