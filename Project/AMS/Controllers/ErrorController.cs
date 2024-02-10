using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult http404()
        {
            return View();
        }
        public ActionResult http405()
        {
            return View();
        }
        public ActionResult general()
        {
            return View();
        }

    }
}