using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class UPInvoiceController : Controller
    {
        // GET: UPInvoice
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View Unpaid Invoice")]
        //[OutputCache(Duration = 120)]
        public ActionResult UPInvoice()
        {
            return View();
        }
        [OutputCache(Duration = 10, VaryByParam = "*")]
        public ActionResult GetUPInvoice(DateTime? Dfrom, DateTime? Dto)
        {
            if (Dfrom != null && Dto != null)
            {
                var data = (from q in con.spGet_All_Invoice_DetailsByDateAndPayStatus(Dfrom, Dto, "0")
                         select q).ToList();

                if (data.Count > 0)
                {
                    return Json(new { data, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var data = (from q in con.spGet_All_Invoice_DetailsByDateAndPayStatus(Dfrom, Dto, "0")
                            where q.Pay_Status=="0"
                            //where q.Invoice_Date >= dt
                            select q).ToList();

                if (data.Count > 0)
                {
                    return Json(new { data, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}