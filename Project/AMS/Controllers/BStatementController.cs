using AMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class BStatementController : Controller
    {
        // GET: BStatement
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View Bank Statement")]
        public ActionResult BStatement()
        {
            GetAllBank();
            return View();
        }
        public ActionResult GetBStatement(DateTime? Dfrom, DateTime? Dto, int BankID)
        {
            DateTime dt = DateTime.Today.AddMonths(-1);
            if (Dfrom == null && Dto == null)
            {
                var data = (from q in con.spGet_BankOrCash(BankID, Dfrom, Dto)
                            where q.Date >= dt // || q.Invoice_Date == null
                            select q).ToList();
                var Bank_Statement = Json(data, JsonRequestBehavior.AllowGet);
                Bank_Statement.MaxJsonLength = int.MaxValue;

                if (data.Count>0)
                {
                    return Json(new { Bank_Statement, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new{ message = "No data found", success=false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                decimal someNumber = (decimal)con.sp_get_Balance(BankID).FirstOrDefault();
                var RemainingBalance = someNumber.ToString("N2");

                var data = (from q in con.spGet_BankOrCash(BankID, Dfrom, Dto)
                         select q).ToList();
                var Bank_Statement = Json(data, JsonRequestBehavior.AllowGet);
                Bank_Statement.MaxJsonLength = int.MaxValue;
                if (data.Count > 0)
                {
                    return Json(new { RemainingBalance, Bank_Statement, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { RemainingBalance, message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }



        }

        public void GetAllBank()
        {
            var AllBank = (from q in con.Banks
                           where q.Bank_ID!=1
                          select q).ToList();

            if (AllBank.Count > 0)
            {
                var data = ViewBag.AllBank = AllBank.Select(x => new SelectListItem
                {
                    Value = x.Bank_ID.ToString(),
                    Text = x.Bank_Name.ToString(),
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
            else
            {
                var data = ViewBag.AllBank = AllBank.Select(x => new SelectListItem
                {
                    Value = "",
                    Text = "No Data Found",
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
        }
    }
}