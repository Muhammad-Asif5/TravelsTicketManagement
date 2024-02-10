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
    [RoutePrefix("AmountReceiveable")]
    public class AmountReceiveableController : Controller
    {
        // GET: AmountReceiveable
        Entities con = new Entities();

        #region Amount Receiveable
        [Route("~/amount-receive")]
        [Authorize(Roles = "Admin, Generate AR Receipt")]
        //[OutputCache(Duration = 120, VaryByParam = "*")]
        public ActionResult AmountReceiveable()
        {
            return View();
        }
        [OutputCache(Duration = 120, VaryByParam = "*")]
        public ActionResult GetBalance(int BankID)
        {
            var RemainingBalance = con.sp_get_Balance(BankID).FirstOrDefault();
            return Json(new { RemainingBalance }, JsonRequestBehavior.AllowGet);            
        }
        [HttpGet]
        public ActionResult AddOrEdit()
        {
            List<Customer> listCampus = con.Customers.ToList();
            List<Bank> listBank = con.Banks.Where(x => x.Status == true).ToList();
            ViewBag.Customers = new SelectList(listCampus, "Cust_ID", "Cust_Code");
            ViewBag.AllBank = new SelectList(listBank, "Bank_ID", "Bank_Name");
            return View();
        }
        [Authorize(Roles = "Admin, Generate AR Receipt, Update Record")]
        [HttpPost]
        public ActionResult AddOrEdit(mvcModelsAmountReceiveable model)
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

                obj.Cust_Code = model.Cust_Code;

                obj.AccountID = 1;
                obj.DrCr = "Dr";
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
                var check = con.Vouchers.Where(x => x.VID == model.VID).FirstOrDefault();
                //update here
                try
                {
                    check.Received_Paid_Date = model.Received_Paid_Date;
                    check.Narration = model.Narration;
                    check.Received_Paid = model.Received_Paid;
                    check.Cust_Code = model.Cust_Code;
                    check.Amount = model.Amount;
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
        [Authorize(Roles = "Admin, Generate AR Receipt")]
        [OutputCache(Duration = 60, VaryByParam = "*")]
        public ActionResult GetAllAmountReceiveableByDate(DateTime? Dfrom, DateTime? Dto)
        {
            if (User.IsInRole("Admin") == true)
            {
                var data = (from q in con.sp_View_Amount_Receiveable()
                            where q.Date >= Dfrom && q.Date <= Dto
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;
                var data = (from q in con.sp_View_Amount_Receiveable()
                            where q.User_Name == userName && q.Date >= Dfrom && q.Date <= Dto
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }
            
        }
        public ActionResult GetAllAmountReceiveable()
        {
            DateTime dt = DateTime.Today.AddMonths(-1);
            if (User.IsInRole("Admin")==true)
            {
                var rr = con.sp_View_Amount_Receiveable();
                var asif = rr.ToList();
                var data = (from q in con.sp_View_Amount_Receiveable()
                            where q.Date >= dt
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;

                var data = (from q in con.sp_View_Amount_Receiveable()
                            where q.User_Name== userName && q.Date >= dt
                            select q).ToList();

                var jsonResult = Json(data, JsonRequestBehavior.AllowGet);

                if (data.Count > 0)
                {
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return Json(new { jsonResult, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
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

                    return Json(new { Delete = "Delete", success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { success = false, message = "Error", JsonRequestBehavior.AllowGet });
        }

        #endregion  return View();


        #region receipt
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

        
        public ActionResult ReceiptVoucher(string InvNo)
        {
            if (InvNo == null)
            {
                return RedirectToAction("AmountReceiveable", "AmountReceiveable");
            }
            else
            {
                ds = new AllDataSets();
                SqlCommand cmd = new SqlCommand("SELECT Voucher.VID, Voucher.Received_Paid_Date, Customers.Cust_Code, " +
                " Customers.Company_Name, Customers.Contact_Name, Customers.Address, Voucher.Amount, Voucher.Narration, " +
                " Voucher.Received_Paid FROM Voucher INNER JOIN Customers ON Voucher.Cust_Code = Customers.Cust_ID " +
                " WHERE(Voucher.VID = '" + InvNo + "')", db);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds, "Invoice_Details");
                //da.Fill(ds.Tables["Invoice_Details"]);
                dt = new DataTable();
                dt.TableName = "ReceiptTable";
                da.Fill(dt);
                if (dt.Rows.Count == 0)
                {

                    return RedirectToAction("AmountReceiveable", "AmountReceiveable");
                }
                else
                {
                    ViewBag.VID = dt.Rows[0]["VID"];
                    ViewBag.Received_Paid_Date = dt.Rows[0]["Received_Paid_Date"];
                    ViewBag.Cust_Code = dt.Rows[0]["Cust_Code"];
                    ViewBag.Company_Name = dt.Rows[0]["Company_Name"];
                    ViewBag.Contact_Name = dt.Rows[0]["Contact_Name"];
                    ViewBag.Address = dt.Rows[0]["Address"];
                    ViewBag.Amount = dt.Rows[0]["Amount"];
                    ViewBag.Narration = dt.Rows[0]["Narration"];
                    ViewBag.Received_Paid = dt.Rows[0]["Received_Paid"];

                    return View();
                }

            }

        }

        #endregion
    }
}