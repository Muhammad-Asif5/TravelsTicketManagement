using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    public class ProfitStatementController : Controller
    {
        // GET: ProfitStatement
        Entities con = new Entities();
        [Authorize(Roles = "Admin, View Profit Statement")]
        public ActionResult ProfitStatement()
        {
            return View();
        }
        public ActionResult GetTotalProfit(DateTime? Dfrom, DateTime? Dto)
        {
            var info = from Invoice_Details in (from Invoice_Details in con.Invoice_Details
                                                where Invoice_Details.Invoice_Date >= Dfrom
                                                && Invoice_Details.Invoice_Date<=Dto
                                                select new
                                                {
                                                    Invoice_Details.Commission_Amount,
                                                    Invoice_Details.VAT_Amount,
                                                    Invoice_Details.Base_Fare,
                                                    Invoice_Details.Tax,
                                                    Invoice_Details.Other_Cost,
                                                    Invoice_Details.AirLine_Penalty,
                                                    Invoice_Details.Customer_Penalty,
                                                    Dummy = "x"
                                                })
                       group Invoice_Details by new { Invoice_Details.Dummy } into g
                       select new
                       {
                           Commission_Amount = Math.Abs((decimal)g.Sum(p => p.Commission_Amount)),
                           VAT_Amount = Math.Abs((decimal)g.Sum(p => p.VAT_Amount)),
                           Base_Fare = Math.Abs((decimal)g.Sum(p => p.Base_Fare)),
                           Tax = Math.Abs((decimal)g.Sum(p => p.Tax)),
                           Other_Cost = Math.Abs((decimal)g.Sum(p => p.Other_Cost)),
                           AirLine_Penalty = Math.Abs((decimal)g.Sum(p => p.AirLine_Penalty)),
                           Customer_Penalty = Math.Abs((decimal)g.Sum(p => p.Customer_Penalty)),
                       };
            var data = info.ToList();

            var exp = from v in con.Vouchers
                      where v.Exp_Code != "114" && v.Exp_Code != "115" 
                      && v.Exp_Code != "116" && v.Exp_Code != "119" 
                      && v.Exp_Code != "123" && v.Exp_Code != "125" 
                      && v.Exp_Code != "126" && v.Exp_Code != "132"
                      join e in con.DailyExpenses on v.Exp_Code equals e.Exp_Code
                      where v.Received_Paid_Date >= Dfrom
                      && v.Received_Paid_Date <= Dto
                      group new { e, v } by new
                      {
                          e.Account,
                          e.Contact_Name,
                          v.Exp_Code
                      } into g
                      orderby
                        g.Key.Account
                      select new
                      {
                          g.Key.Account,
                          g.Key.Contact_Name,
                          g.Key.Exp_Code,
                          Amount = (decimal?)g.Sum(p => p.v.Amount)
                      };
            var data2 = exp.ToList();
            //////////////////////////////////***Expense Heads***//////////////////////////////////


            if (data.Count > 0)
            {
                return Json(new { data, data2, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false, message = "No Data Found " }, JsonRequestBehavior.AllowGet);
        }
                
        List<Invoice_Details> calculateMonth(int YearName)
        {
            List<Invoice_Details> MonthNames = new List<Invoice_Details>();
            List<Invoice_Details> MonthNames1 = new List<Invoice_Details>();

            var Invoice_DetailsMonthName = (from p in con.Invoice_Details
                                            where p.Invoice_Date.Value.Year == YearName
                                            let month = p.Invoice_Date.Value.Month
                                            group p by month into r
                                            orderby r.Key ascending
                                            select new
                                            {
                                                Invoice_Date = r.Select(c => c.Invoice_Date).FirstOrDefault()

                                            }).ToList();
            if (Invoice_DetailsMonthName.Count>0)
            {
                for (int i = 0; i < Invoice_DetailsMonthName.Count; i++)
                {
                    Invoice_Details obj = new Invoice_Details();
                    obj.Invoice_Date = Invoice_DetailsMonthName[i].Invoice_Date;
                    MonthNames.Add(obj);
                }
                var VouchersMonthName = (from p in con.Vouchers
                                         where p.Received_Paid_Date.Value.Year==YearName
                                             //where p.DrCr == "Dr" && p.Stream_ID == "04"
                                         let month = p.Received_Paid_Date.Value.Month
                                         group p by month into r
                                         orderby r.Key ascending
                                         select new
                                         {
                                             Invoice_Date = r.Select(c => c.Received_Paid_Date).FirstOrDefault()

                                         }).ToList(); // 2

                for (int i = 0; i < VouchersMonthName.Count; i++)
                {
                    Invoice_Details obj = new Invoice_Details();
                    obj.Invoice_Date = VouchersMonthName[i].Invoice_Date;
                    MonthNames.Add(obj);
                }

                var BVouchersMonthName = (from p in con.Vouchers
                                          where p.Received_Paid_Date.Value.Year == YearName
                                          // where p.DrCr == "Dr" && p.Stream_ID == "05"
                                          let month = p.Received_Paid_Date.Value.Month
                                          group p by month into r
                                          orderby r.Key ascending
                                          select new
                                          {
                                              Invoice_Date = r.Select(c => c.Received_Paid_Date).FirstOrDefault()

                                          }).ToList(); // 2

                for (int i = 0; i < BVouchersMonthName.Count; i++)
                {
                    Invoice_Details obj = new Invoice_Details();
                    obj.Invoice_Date = BVouchersMonthName[i].Invoice_Date;
                    MonthNames.Add(obj);
                }
                var DistinctMonthNames = (from p in MonthNames
                                          let month = p.Invoice_Date.Value.Month
                                          group p by month into r
                                          orderby r.Key ascending
                                          select new
                                          {
                                              Invoice_Date = r.Select(c => c.Invoice_Date).FirstOrDefault()

                                          }).ToList();
                for (int i = 0; i < DistinctMonthNames.Count; i++)
                {
                    Invoice_Details obj = new Invoice_Details();
                    obj.Invoice_Date = DistinctMonthNames[i].Invoice_Date;
                    MonthNames1.Add(obj);
                }
            }
            
            return MonthNames1;
        }

    }
}