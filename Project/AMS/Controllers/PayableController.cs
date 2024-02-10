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
    public class PayableController : Controller
    {
        // GET: Payable
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View Payable")]
        public ActionResult Payable()
        {
            GetAllAirLines();

            return View();
        }
        
        public ActionResult GetPayable(DateTime? Dfrom, DateTime? Dto)
        {
            if (Dfrom == null && Dto == null)
            {
                DateTime dt = DateTime.Today.AddMonths(-1);
                var CashBook = (from q in con.V_Payable
                            where q.Invoice_Date >= dt
                            select q).ToList();

                if (CashBook.Count > 0)
                {
                    return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var CashBook = (from q in con.spGet_BankOrCash(1, Dfrom, Dto)
                            select q).ToList();

                if (CashBook.Count > 0)
                {
                    return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }



        }
        
        public ActionResult GetPayableByPCodeByDate(string pCode, string pStatus, DateTime? Dfrom, DateTime? Dto)
        {
            if (Dfrom ==null && Dto ==null)
            {
                if (pCode != "" && pStatus == "")
                {
                    var CashBook = (from q in con.V_Payable
                                    where q.Air_ID == pCode
                                    select q).ToList();
                    if (CashBook.Count > 0)
                    {
                        return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
                }
                else if (pCode == "" && pStatus != "")
                {
                    if (pStatus == "all")
                    {
                        var CashBook = (from q in con.V_Payable
                                        select q).ToList();

                        if (CashBook.Count > 0)
                        {
                            return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var CashBook = (from q in con.V_Payable
                                        where q.Pay_Status == pStatus
                                        select q).ToList();
                        if (CashBook.Count > 0)
                        {
                            return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
                else if (pCode != "" && pStatus != "")
                {
                    if (pStatus == "all")
                    {
                        var CashBook = (from q in con.V_Payable
                                        where q.Air_ID == pCode
                                        select q).ToList();

                        if (CashBook.Count > 0)
                        {
                            return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var CashBook = (from q in con.V_Payable
                                        where q.Air_ID == pCode && q.Pay_Status == pStatus
                                        select q).ToList();

                        if (CashBook.Count > 0)
                        {
                            return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var CashBook = (from q in con.V_Payable
                                where q.Air_ID == pCode && q.Pay_Status==pStatus
                                && q.Invoice_Date >= Dfrom && q.Invoice_Date <= Dto
                                select q).ToList();
                if (CashBook.Count > 0)
                {
                    return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        public void GetAllAirLines()
        {
            var AllEmp = (from q in con.AirLines
                          select q).ToList();

            if (AllEmp.Count > 0)
            {
                var data = ViewBag.AllAirLines = AllEmp.Select(x => new SelectListItem
                {
                    Value = x.Air_ID.ToString(),
                    Text = x.Payable_Code.ToString(),
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
            else
            {
                var data = ViewBag.AllAirLines = AllEmp.Select(x => new SelectListItem
                {
                    Value = "",
                    Text = "No Data Found",
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
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