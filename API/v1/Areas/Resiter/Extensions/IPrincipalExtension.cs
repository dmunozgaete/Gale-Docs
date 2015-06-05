using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Areas.Resiter.Data
{
    /// <summary>
    /// Add Extension's for Resiter
    /// </summary>
    public static class IPrincipalExtension
    {

        /// <summary>
        /// Extrae la unidad de negocio en la cual el usuario se encuentra , (Se extrae desde el Header de la solicitud 'X-Resiter-BusinessUnit')
        /// </summary>
        /// <param name="IPrincipal"></param>
        /// <returns></returns>
        public static string BusinessUnit(this System.Security.Principal.IPrincipal IPrincipal)
        {
            string businessUnit =  null;
            if (HttpContext.Current.Request.Headers.AllKeys.Contains("X-Resiter-BusinessUnit") ||
                HttpContext.Current.Request.Headers.AllKeys.Contains("x-resiter-businessunit")) //Phonegap lowercase the header........
            {
                businessUnit = HttpContext.Current.Request.Headers.GetValues("X-Resiter-BusinessUnit").FirstOrDefault();
            }

            //------------------------------------------------------------------------------------------------------------------------
            //GUARD EXCEPTION
            Karma.Exception.RestException.Guard(() => businessUnit == null, "BUSINESSUNIT_NOT_FOUND_IN_REQUEST_HEADER", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------------------------
            
            return businessUnit;
        }
    }
}