using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class APSummaryController : Controller
    {
        // GET: APSummary
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View AP Summary")]
        public ActionResult APSummary()
        {
            return View();
        }
        public ActionResult GetAPSummary()
        {
            var data = (from q in con.spGet_AP_Summary()
                        select q).ToList();

            var AP_Summary = Json(data, JsonRequestBehavior.AllowGet);
            AP_Summary.MaxJsonLength = int.MaxValue;

            if (data.Count > 0)
            {
                return Json(new { AP_Summary, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAPSummaryByDate(DateTime? Dfrom, DateTime? Dto)
        {
            var data = (from q in con.spGet_AP_SummaryByDate(Dfrom, Dto)
                        select q).ToList();

            var AP_Summary = Json(data, JsonRequestBehavior.AllowGet);
            AP_Summary.MaxJsonLength = int.MaxValue;

            if (data.Count > 0)
            {
                return Json(new { AP_Summary, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}