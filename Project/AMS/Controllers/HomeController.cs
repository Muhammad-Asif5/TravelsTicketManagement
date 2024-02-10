using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    [RoutePrefix("Home")]
    public class HomeController : Controller
    {
        [Route("~/dashboard")]
        public ActionResult Index()
        {
            return View();
        }
    }
}