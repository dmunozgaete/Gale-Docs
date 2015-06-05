using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Services.Protocols;
using Microsoft.Reporting.WebForms.Internal.Soap.ReportingServices2005.Execution;

namespace API.Areas.Resiter.Data.Printer
{
    /// <summary>
    /// 
    /// </summary>
    public class Route : Karma.REST.Http.HttpActionResult
    {
        String _driver = null;
        DateTime _date;
        String _businessUnit = null;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="driver"></param>
        /// <param name="date"></param>
        public Route(String driver, DateTime date, string businessUnit)
        {
            _driver = driver;
            _date = date;
            _businessUnit = businessUnit;
        }

        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            string reportName = "Routes";
            string reportFormat = "PDF";

            #region REPORT CONFIGURATION
            ReportExecutionService rs = new ReportExecutionService();
            rs.Credentials = new System.Net.NetworkCredential(
               System.Configuration.ConfigurationManager.AppSettings["ReportServices:Credential:User"],     //User
               System.Configuration.ConfigurationManager.AppSettings["ReportServices:Credential:Password"], //Password
               System.Configuration.ConfigurationManager.AppSettings["ReportServices:Credential:Domain"]    //User
           );

            rs.Url = System.Configuration.ConfigurationManager.AppSettings["ReportServices:Server:Url"];    //Server

            // Render arguments
            byte[] result = null;
            
            string reportPath = String.Format("/{0}/{1}",
                                    System.Configuration.ConfigurationManager.AppSettings["ReportServices:Server:Project"],
                                    System.Configuration.ConfigurationManager.AppSettings[String.Format("ReportServices:Project:{0}", reportName)]
                                );

            string devInfo = @"<DeviceInfo><Toolbar>False</Toolbar></DeviceInfo>";
            #endregion

            // Prepare report parameter.
            ParameterValue[] parameters = new ParameterValue[3];
            parameters[0] = new ParameterValue();
            parameters[0].Name = "TOKENENTIDAD";
            parameters[0].Value = _driver;

            parameters[1] = new ParameterValue();
            parameters[1].Name = "TOKENDOCUMENTO";
            parameters[1].Value = _businessUnit;

            parameters[2] = new ParameterValue();
            parameters[2].Name = "PARAMETROFECHA";
            parameters[2].Value = _date.ToString("MM/dd/yyyy");


            #region GET REPORT SERVICES
            string encoding;
            string mimeType;
            string extension;
            Warning[] warnings = null;
            string[] streamIDs = null;

            ExecutionInfo execInfo = new ExecutionInfo();
            ExecutionHeader execHeader = new ExecutionHeader();

            rs.ExecutionHeaderValue = execHeader;

            execInfo = rs.LoadReport(reportPath, null);

            rs.SetExecutionParameters(parameters, "en-us");
            String SessionId = rs.ExecutionHeaderValue.ExecutionID;


            result = rs.Render(reportFormat, devInfo, out extension, out encoding, out mimeType, out warnings, out streamIDs);

            //Create Response
            var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new StreamContent(new System.IO.MemoryStream(result))
            };

            //Add Content-Type Header
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(encoding);

            return Task.FromResult(response);
            #endregion
        }
    }
}