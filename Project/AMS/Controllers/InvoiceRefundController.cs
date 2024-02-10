using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize(Roles = "Admin, Admin Refund")]
    [RoutePrefix("InvoiceRefund")]
    public class InvoiceRefundController : Controller
    {
        // GET: InvoiceRefund
        Entities con = new Entities();

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

        #region Refund
        [Route("~/invoice-refund")]
        public ActionResult Refund()
        {
            var r = (from q in con.Invoice_Details
                     where q.Ticket_Status != "03"
                     select q).ToList();

            return View(r);
        }
        public ActionResult GetAllRefundInvoice()
        {
            DateTime dt = DateTime.Today.AddMonths(-1);

            var r = (from q in con.Invoice_Details
                     where q.Invoice_Date>dt && q.Ticket_Status=="03"
                     select  q).ToList();

            var jsonResult = Json(r, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;


        }

        [HttpGet]
        public ActionResult AddOrEdit()
        {
            List<Customer> listCampus = con.Customers.ToList();
            ViewBag.Customers = new SelectList(listCampus, "Cust_ID", "Cust_Code");

            //List<AirLine> listAirLines = con.AirLines.ToList();
            //ViewBag.AirLines = new SelectList(listAirLines, "Payable_Code", "Payable_Code");
            GetAllAirLines();

            List<Income_Stream> listIncome_Stream = con.Income_Stream.Where(x => x.Stream_Status == "1").ToList();
            ViewBag.listIncome_Stream = new SelectList(listIncome_Stream, "Stream_ID", "Stream_Name");

            List<Agent> listAgent = con.Agents.Where(x => x.Agent_Status == "1").ToList();
            ViewBag.AllAgent = new SelectList(listAgent, "Agent_ID", "Agent_Name");
            return View();
        }
        [HttpPost]
        public ActionResult AddOrEdit(Invoice_Details model)
        {
            if (model.Invoice_Number == 0)
            {
                //add here

                Invoice_Details obj = model;
                obj.Base_Fare = model.Base_Fare;
                obj.Cust_Code = model.Cust_Code;
                obj.Tax = model.Tax;
                obj.Other_Cost = model.Other_Cost;
                obj.Invoice_Amount = model.Invoice_Amount;
                obj.Net_Payable = model.Net_Payable;
                obj.Paid = 0;
                obj.Paid2 = 0;
                obj.Commission_Amount = model.Commission_Amount;
                obj.VAT = model.VAT;
                obj.VAT_Amount = model.VAT_Amount;
                obj.AirLine_Penalty = model.AirLine_Penalty;
                obj.Customer_Penalty = model.Customer_Penalty;
                obj.Ticket_Status = "03";
                obj.Stream_ID = "03";
                obj.Pay_Status = "0";
                obj.ReceivePay_Status = "0";
                obj.Invoice_Number = 0;
                try
                {
                    con.Invoice_Details.Add(obj);
                    con.SaveChanges();
                    int NextID = Convert.ToInt32(obj.Invoice_Number);

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
                var check = con.Invoice_Details.Where(x => x.Invoice_Number == model.Invoice_Number).FirstOrDefault();
               
                try
                {
                    check.Invoice_Date = model.Invoice_Date;
                    check.Ticket_Number = model.Ticket_Number;
                    check.Description = model.Description;
                    check.Routing = model.Routing;
                    check.Departure_Date = model.Departure_Date;
                    check.Arrival_Date = model.Arrival_Date;
                    check.Paid = model.Invoice_Amount;
                    check.Base_Fare = model.Base_Fare;
                    check.Tax = model.Tax;
                    check.Other_Cost = model.Other_Cost;
                    check.Stream_ID = model.Stream_ID;
                    check.Payable_Code = model.Payable_Code;
                    check.Paid2 = model.Net_Payable;
                    check.Other_Ref = model.Other_Ref;
                    check.Invoice_Amount = model.Invoice_Amount;
                    check.Commission_Amount = model.Commission_Amount;
                    check.Ticket_Commission = model.Ticket_Commission;
                    check.VAT = model.VAT;
                    check.VAT_Amount = model.VAT_Amount;
                    check.Net_Payable = model.Net_Payable;
                    check.Customer_Penalty = model.Customer_Penalty;
                    check.AirLine_Penalty = model.AirLine_Penalty;
                    check.Pay_Status = "0";
                    check.ReceivePay_Status = "0";

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
        
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var check = (from q in con.Invoice_Details
                         where q.Invoice_Number == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(new { success = true, check }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { message = "No Data Found", success = false }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult DeleteDataByID(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.Invoice_Details
                     where q.Invoice_Number == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var newID = con.Invoice_Details.Select(x => x.Invoice_Number).Max();
                    int NextID = Convert.ToInt32(newID);
                    if (NextID == 0)
                    {
                        NextID = 1200000;
                    }
                    NextID++;

                    return Json(new { Delete = "Delete", NextID, success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { success = false, message = "Error", JsonRequestBehavior.AllowGet });
        }
        #endregion  return View();
        public ActionResult GetPayAbleCommission(string PCode)
        {
            // var r = con.AirLines.Where(x => x.Air_ID == PCode).Select(x => x.Ticket_Commission).FirstOrDefault();
            var info = (from q in con.AirLines
                        where q.Air_ID == PCode
                        select q).FirstOrDefault();

            return Json(info, JsonRequestBehavior.AllowGet);
        }
    }
}