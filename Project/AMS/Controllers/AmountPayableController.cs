using AMS.DataSets;
using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    [RoutePrefix("AmountPayable")]
    public class AmountPayableController : Controller
    {
        // GET: AmountPayable
        Entities con = new Entities();
       

        #region Amount Payable
        [Route("~/amount-pay")]
        [Authorize(Roles = "Admin, Generate AP-EXP Receipt")]
        public ActionResult AmountPayable()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Generate AP-EXP Receipt")]
        [HttpGet]
        public ActionResult AddOrEdit()
        {
            List<Customer> listCampus = con.Customers.ToList();
            List<Bank> listBank = con.Banks.Where(x => x.Status == true).ToList();

            ViewBag.Customers = new SelectList(listCampus, "Cust_Code", "Cust_Code");
            ViewBag.AllBank = new SelectList(listBank, "Bank_ID", "Bank_Name");

            GetAllAirLines();
            GetAllExpenses();
            return View();
        }
        [Authorize(Roles = "Admin, Generate AP-EXP Receipt, Update Record")]
        [HttpPost]
        public ActionResult AddOrEdit(mvcModelsAmountPayable model)
        {
            if (model.VID == 0)
            {
                //add here
                Voucher obj = new Voucher();
                obj.VID = model.VID;
                obj.Received_Paid_Date = model.Received_Paid_Date;
                obj.Narration = model.Narration;
                obj.Received_Paid = model.Received_Paid;
                obj.Amount = model.Amount;
                obj.Exp_Code = model.Exp_Code;
                obj.Payable_Code = model.Payable_Code;

                obj.User_Name = User.Identity.Name;
                if (model.Bank_ID == 1)
                {
                    obj.Bank_Cash_Receiveable = "1";
                }
                else
                {
                    obj.Bank_Cash_Receiveable = "2";
                }

                obj.Bank_ID = model.Bank_ID;

                obj.AccountID = 2;
                obj.DrCr = "Cr";

                try
                {
                    con.Vouchers.Add(obj);
                    con.SaveChanges();
                    int NextID = Convert.ToInt32(obj.VID);

                    return Json(new { success = true, message = "Added", NextID }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json(new
                    {
                        Delete = "Exception",
                        success = false,
                        message = "Error " + ex.Message
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                //update here
                var check = con.Vouchers.Where(x => x.VID == model.VID).FirstOrDefault();
                
                try
                {
                    check.Received_Paid_Date = model.Received_Paid_Date;
                    check.Narration = model.Narration;
                    check.Received_Paid = model.Received_Paid;
                    check.Amount = model.Amount;
                    check.Exp_Code = model.Exp_Code;
                    check.Payable_Code = model.Payable_Code;
                    check.Bank_ID = model.Bank_ID;

                    con.Entry(check).State = EntityState.Modified;
                    con.SaveChanges();
                    return Json(new
                    {
                        success = true,
                        message = "Updated successfully"
                    }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json(new
                    {
                        Delete = "Exception",
                        success = false,
                        message = "Error " + ex.Message
                    }, JsonRequestBehavior.AllowGet);
                }
            }
        }
        [Authorize(Roles = "Admin, Generate AP-EXP Receipt")]
        [OutputCache(Duration = 60, VaryByParam = "*")]
        public ActionResult GetAllAmountPayableByDate(DateTime? Dfrom, DateTime? Dto)
        {
            if (User.IsInRole("Admin") == true)
            {
                var data = (from q in con.sp_View_Amount_Payable()
                            where q.Date >= Dfrom && q.Date <= Dto
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;

                var data = (from q in con.sp_View_Amount_Payable()
                            where q.User_Name== userName &&  q.Date >= Dfrom && q.Date <= Dto
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
            }
                
        }
        public ActionResult GetAllAmountPayable()
        {
            DateTime dt = DateTime.Today.AddMonths(-1);
            if (User.IsInRole("Admin")==true)
            {
                var data = (from q in con.sp_View_Amount_Payable()
                            where q.Date >= dt
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;
                var data = (from q in con.sp_View_Amount_Payable()
                            where q.User_Name==userName && q.Date >= dt
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);
            }

        }
        [Authorize(Roles = "Admin, Update Record")]
        [OutputCache(Duration = 30, VaryByParam = "*")]
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var check = (from q in con.Vouchers
                         where q.VID == id
                         select q).ToList();
            if (check.Count > 0)
            {
                var RemainingBalance = con.sp_get_Balance(check[0].Bank_ID).FirstOrDefault();

                return Json(new { RemainingBalance, check }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("No Data Found", JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        public ActionResult DeleteDataByID(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.Vouchers
                     where q.VID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    //var newID = con.Vouchers.Select(x => x.VID).Max();
                    //var newID = con.Vouchers.Where(x => x.Bank_Cash_Receiveable == "1").Select(x => x.VID).Max();
                    //int NextID = Convert.ToInt32(newID);
                    //if (NextID == 0)
                    //{
                    //    NextID = 10000;
                    //}
                    //NextID++;
                    ////var getAllBalance = con.Vouchers.Where(x => x.VID == (con.Vouchers.Select(a => a.VID).Max())).Select(x => x.Balance).FirstOrDefault();
                    //var getAllBalance = con.sp_get_Balance(1).FirstOrDefault();

                    return Json(new {Delete = "Delete", success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { success = false, message = "Error", JsonRequestBehavior.AllowGet });
        }
        public void GetAllExpenses()
        {
            var AllEmp = (from q in con.DailyExpenses
                          select q).ToList();

            if (AllEmp.Count > 0)
            {
                var data = ViewBag.AllDailyExp = AllEmp.Select(x => new SelectListItem
                {
                    Value = x.Exp_Code.ToString(),
                    Text = x.Account + " : " + x.Contact_Name,
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
            else
            {
                var data = ViewBag.AllDailyExp = AllEmp.Select(x => new SelectListItem
                {
                    Value = "",
                    Text = "No Data Found",
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
        }
        public void GetAllAirLines()
        {
            var AllEmp = (from q in con.AirLines
                          select q).ToList();

            if (AllEmp.Count > 0)
            {
                var data = ViewBag.AllAirLine = AllEmp.Select(x => new SelectListItem
                {
                    Value = x.Air_ID.ToString(),
                    Text = x.Payable_Code + " : " + x.Payable_Supplier,
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
            else
            {
                var data = ViewBag.AllAirLine = AllEmp.Select(x => new SelectListItem
                {
                    Value = "",
                    Text = "No Data Found",
                    //Selected = (x.STOCK_NO==""),
                    //Disabled=(x.STOCK_NO=="")
                }).Distinct().ToList();
            }
        }
        public ActionResult GetPayAbleCommission(string PCode)
        {
            var r = con.AirLines.Where(x => x.Air_ID == PCode).Select(x => x.Ticket_Commission).FirstOrDefault();

            return Json(r, JsonRequestBehavior.AllowGet);
        }

        #endregion  return View();



        DataTable dt = new DataTable();
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
        public ActionResult PayVoucher(string InvNo)
        {
            if (InvNo == null)
            {
                return RedirectToAction("AmountPayable", "AmountPayable");
            }
            else
            {
                ds = new AllDataSets();
                SqlCommand cmd = new SqlCommand("SELECT Voucher.VID,Voucher.Received_Paid_Date, DailyExpenses.Account, " +
" (CASE WHEN Voucher.Payable_Code IS NULL THEN DailyExpenses.Contact_Name ELSE AirLines.Payable_Supplier END) AS PayableCode, " +
" Voucher.Received_Paid, Voucher.Narration, Voucher.Amount FROM Voucher LEFT OUTER JOIN " +
" DailyExpenses ON Voucher.Exp_Code = DailyExpenses.Exp_Code LEFT OUTER JOIN " +
" AirLines ON Voucher.Payable_Code = AirLines.Air_ID WHERE(Voucher.VID = '" + InvNo + "')", db);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds, "Invoice_Details");
                //da.Fill(ds.Tables["Invoice_Details"]);
                dt = new DataTable();
                dt.TableName = "PayableTable";
                da.Fill(dt);
                if (dt.Rows.Count == 0)
                {

                    return RedirectToAction("AmountPayable", "AmountPayable");
                }
                else
                {
                    ViewBag.VID = dt.Rows[0]["VID"];
                    
                    ViewBag.Received_Paid = dt.Rows[0]["Received_Paid"];
                    ViewBag.Received_Paid_Date = dt.Rows[0]["Received_Paid_Date"];
                    ViewBag.Narration = dt.Rows[0]["Narration"];
                    ViewBag.Amount = dt.Rows[0]["Amount"];
                    if (dt.Rows[0]["Account"].ToString() == "" )
                    {
                        ViewBag.CustCode = dt.Rows[0]["PayableCode"];
                    }
                    else
                    {
                        ViewBag.CustCode = dt.Rows[0]["Account"];
                    }
                    return View();
                }

            }

        }
    }
}