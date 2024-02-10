using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class ReceiveableController : Controller
    {
        // GET: Receiveable
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View Receiveable")]
        public ActionResult Receiveable()
        {
            GetAllCustomer();

            return View();
        }
        public void GetAllCustomer()
        {
            var AllEmp = (from q in con.Customers
                          select q).ToList();

            if (AllEmp.Count > 0)
            {
                var data = ViewBag.AllCustomers = AllEmp.Select(x => new SelectListItem
                {
                    Value = x.Cust_ID.ToString(),
                    Text = x.Cust_Code,
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
            else
            {
                var data = ViewBag.AllCustomers = AllEmp.Select(x => new SelectListItem
                {
                    Value = "",
                    Text = "No Data Found",
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
        }

        public ActionResult GetAllReceiveable(int? CustCode, string status)
        {

            if (CustCode != null && status == "")
            {
                var r = (from q in con.V_Receiveable
                         where q.Cust_ID == CustCode
                         select q).ToList();
                if (r.Count > 0)
                {
                    return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                }
            }

            else if (CustCode == null && status != "")
            {
                if (status=="all")
                {
                    var r = (from q in con.V_Receiveable
                             select q).ToList();
                    if (r.Count > 0)
                    {
                        return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var r = (from q in con.V_Receiveable
                             where q.ReceivePay_Status == status
                             select q).ToList();
                    if (r.Count > 0)
                    {
                        return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
                
            }

            else if(CustCode != null && status != "")
            {
                if (status=="all")
                {
                    var r = (from q in con.V_Receiveable
                             where q.Cust_ID == CustCode
                             select q).ToList();
                    if (r.Count > 0)
                    {
                        return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var r = (from q in con.V_Receiveable
                             where q.Cust_ID == CustCode && q.ReceivePay_Status == status
                             select q).ToList();
                    if (r.Count > 0)
                    {
                        return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            else
                return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetAllReceiveableByDate(DateTime? Dfrom, DateTime? Dto, int CustCode, string status)
        {
            if (status=="all")
            {
                var r = (from q in con.V_Receiveable
                         where q.Cust_ID == CustCode &&
                         q.Invoice_Date >= Dfrom && q.Invoice_Date <= Dto
                         //&& q.ReceivePay_Status == "1"
                         select q).ToList();
                if (r.Count > 0)
                {
                    return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                var r = (from q in con.V_Receiveable
                         where q.Cust_ID == CustCode && q.ReceivePay_Status == status &&
                         q.Invoice_Date >= Dfrom && q.Invoice_Date <= Dto
                         select q).ToList();
                if (r.Count > 0)
                {
                    return Json(new { r, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        protected override JsonResult Json(object data, string contentType,
            Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }
    }
}