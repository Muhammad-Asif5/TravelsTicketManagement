using AMS.DataSets;
using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class CashBookController : Controller
    {
        // GET: CashBook
        Entities con = new Entities();
        DataTable dtt = new DataTable();
        AllDataSets ds;
        private static string GetConStr
        {
            get
            {
                string strConnection = System.Configuration.ConfigurationManager.ConnectionStrings["AMS.Properties.Settings.Setting"].ConnectionString;
                return strConnection;
            }
        }
        SqlConnection db = new SqlConnection(GetConStr);

        [Authorize(Roles = "Admin, View Cash Book")]
        public ActionResult CashBook()
        {
            decimal someNumber = (decimal)con.sp_get_Balance(1).FirstOrDefault();
            ViewBag.RemainingBalance = someNumber.ToString("N2");
            return View();
        }
        public ActionResult GetCashBook(DateTime? Dfrom, DateTime? Dto)
        {
            if (Dfrom == null && Dto == null)
            {
                DateTime dt = DateTime.Today.AddMonths(-1);
                var data = (from q in con.spGet_BankOrCash(1, Dfrom, Dto)
                            where q.Date >= dt
                            select q).ToList();

                var CashBook = Json(data, JsonRequestBehavior.AllowGet);
                CashBook.MaxJsonLength = int.MaxValue;

                if (data.Count > 0)
                {
                    return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found ", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var data = (from q in con.spGet_BankOrCash(1, Dfrom, Dto)
                         select q).ToList();

                var CashBook = Json(data, JsonRequestBehavior.AllowGet);
                CashBook.MaxJsonLength = int.MaxValue;

                if (data.Count > 0)
                {
                    return Json(new { CashBook, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }



        }
    }
}