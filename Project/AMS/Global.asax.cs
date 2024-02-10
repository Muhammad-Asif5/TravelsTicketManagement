using AMS.Controllers;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace AMS
{
    
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError();
            HttpException httpex = ex as HttpException;
            RouteData data = new RouteData();
            data.Values.Add("controller", "Error");
            if (httpex == null)
            {
                //data.Values.Add("action", "general");
            }
            else
            {
                switch (httpex.GetHttpCode())
                {
                    case 404:
                        data.Values.Add("action", "http404");
                        break;
                    case 405:
                        data.Values.Add("action", "http405");
                        break;
                    //default:
                    //    data.Values.Add("action", "general");
                    //    break;
                }
            }
            Server.ClearError();
            Response.TrySkipIisCustomErrors = true;
            IController error = new ErrorController();
            error.Execute(new RequestContext(new HttpContextWrapper(Context), data));
        }
    }
}
