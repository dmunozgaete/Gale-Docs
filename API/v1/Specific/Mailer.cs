using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace API.Specific
{
    public class FakeController : Controller
    {
    }

    /// <summary>
    /// 
    /// </summary>
    public static class Mailer
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="templatePath"></param>
        /// <param name="model"></param>
        public static void Send(string templatePath, dynamic model)
        {
            string html = RenderPartialViewToString("~/Areas/Messages/Account/Activate.cshtml", model);
            System.Web.Helpers.WebMail.SmtpServer = System.Configuration.ConfigurationManager.AppSettings["MailServer:server"];
            System.Web.Helpers.WebMail.UserName = System.Configuration.ConfigurationManager.AppSettings["MailServer:username"];
            System.Web.Helpers.WebMail.Password = System.Configuration.ConfigurationManager.AppSettings["MailServer:password"];
            System.Web.Helpers.WebMail.SmtpPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["MailServer:port"]);
            System.Web.Helpers.WebMail.EnableSsl = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["MailServer:enableSSL"]);
            System.Web.Helpers.WebMail.Send("dmunozgaete@gmail.com", "SADASD", html, from: System.Web.Helpers.WebMail.UserName, isBodyHtml: true);

        }

        /// <summary>
        /// Render a View and retrieve the HTML
        /// </summary>
        /// <param name="controller">Controller</param>
        /// <param name="viewName">Name of the view</param>
        /// <param name="model">Model for sending to the view</param>
        /// <returns></returns>
        private static string RenderPartialViewToString(string filePath, object model)
        {

            var st = new System.IO.StringWriter();
            var context = new HttpContextWrapper(HttpContext.Current);
            var routeData = new RouteData();
            var controllerContext = new ControllerContext(new RequestContext(context, routeData), new FakeController());
            var razor = new RazorView(controllerContext, filePath, null, false, null);
            razor.Render(new ViewContext(controllerContext, razor, new ViewDataDictionary(model), new TempDataDictionary(), st), st);
            return st.ToString();



            /*

            ViewDataDictionary ViewData = new ViewDataDictionary(model);
            TempDataDictionary TempData = new TempDataDictionary();

            var context = new HttpContextWrapper(HttpContext.Current);
            var routeData = new RouteData();
            var controllerContext = new ControllerContext(new RequestContext(context, routeData), new FakeController());

            using (var sw = new System.IO.StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(controllerContext, viewName);
                var viewContext = new ViewContext(controllerContext, viewResult.View, ViewData, TempData, sw);

                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(controllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();

            }*/
        }
    }
}