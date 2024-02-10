using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class ARSummaryController : Controller
    {
        // GET: ARSummary
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View AR Summary")]
        public ActionResult ARSummary()
        {
            return View();
        }
        public ActionResult GetARSummary()
        {
            var data = (from q in con.spGet_AR_Summary()
                        select q).ToList();

            var AR_Summary = Json(data, JsonRequestBehavior.AllowGet);
            AR_Summary.MaxJsonLength = int.MaxValue;

            if (data.Count > 0)
            {
                return Json(new { AR_Summary, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetARSummaryByDate(DateTime? Dfrom, DateTime? Dto)
        {
            var data = (from q in con.spGet_AR_SummaryByDate(Dfrom, Dto)
                        select q).ToList();

            var AR_Summary = Json(data, JsonRequestBehavior.AllowGet);
            AR_Summary.MaxJsonLength = int.MaxValue;

            if (data.Count > 0)
            {
                return Json(new { AR_Summary, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}