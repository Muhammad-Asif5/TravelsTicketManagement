using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    public class ExampleController : Controller
    {
        // GET: Example
        Entities con = new Entities();
        public ActionResult ServerSideProcessingAsp()
        {
            return View();
        }
        public ActionResult Condition()
        {
            return View();
        }

    }
}