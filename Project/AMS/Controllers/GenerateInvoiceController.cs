using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Text;

namespace AMS.Controllers
{
    [Authorize]
    [RoutePrefix("GenerateInvoice")]
    public class GenerateInvoiceController : Controller
    {
        // GET: GenerateInvoice

        Entities con = new Entities();

        #region GenerateInvoice
        [Route("~/all-invoices")]
        [Authorize(Roles = "Admin, Admin Invoice Generate")]
        public ActionResult GenerateInvoice()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Admin Invoice Generate, Update Record")]
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

        [Authorize(Roles = "Admin, Admin Invoice Generate, Update Record")]
        [HttpPost]
        public ActionResult AddOrEdit(Invoice_Details model)
        {
            if (User.Identity.IsAuthenticated==true)
            {
                if (model.Invoice_Number == 0)
                {
                    // Add here
                    bool ticketNumber = CheckExistingTicketNumber(model.Ticket_Number);
                    if (ticketNumber == true)
                    {
                        //Exist Ticket Number
                        return Json(new { success = true, message = "Ticket with no = " + model.Ticket_Number + " is already exist" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        // Add here
                        Invoice_Details obj = model;

                        obj.Paid = 0;
                        obj.Paid2 = 0;
                        obj.Pay_Status = "0";
                        obj.ReceivePay_Status = "0";
                        obj.AirLine_Penalty = 0;
                        obj.Customer_Penalty = 0;
                        obj.User_Name = User.Identity.Name;
                        try
                        {
                            con.Invoice_Details.Add(obj);
                            con.SaveChanges();
                            int NextID = Convert.ToInt32(obj.Invoice_Number);
                            obj = null;
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
                }
                else
                {
                    //update here
                    var check = con.Invoice_Details.Where(x => x.Invoice_Number == model.Invoice_Number).FirstOrDefault();

                    try
                    {
                        check.Cust_Code = model.Cust_Code;
                        check.Invoice_Date = model.Invoice_Date;
                        check.Ticket_Number = model.Ticket_Number;
                        check.Description = model.Description;
                        check.Routing = model.Routing;
                        check.Departure_Date = model.Departure_Date;
                        check.Arrival_Date = model.Arrival_Date;
                        check.Paid = model.Paid;
                        check.Base_Fare = model.Base_Fare;
                        check.Total_Value = model.Total_Value;
                        check.Tax = model.Tax;
                        check.Other_Cost = model.Other_Cost;
                        check.Stream_ID = model.Stream_ID;
                        check.Payable_Code = model.Payable_Code;
                        check.Paid2 = model.Paid2;
                        check.Other_Ref = model.Other_Ref;
                        check.Invoice_Amount = model.Invoice_Amount;
                        check.Commission_Amount = model.Commission_Amount;
                        check.Ticket_Commission = model.Ticket_Commission;
                        check.VAT = model.VAT;
                        check.VAT_Amount = model.VAT_Amount;
                        check.Net_Payable = model.Net_Payable;
                        check.Ticket_Status = model.Ticket_Status;
                        check.TicketClass_ID = model.TicketClass_ID;

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
            else
            {
                return RedirectToAction("Login","Account");
            }
        }
        
        //[OutputCache(Duration = 10)]
        public ActionResult GetAllInvoice()
        {
            DateTime dt = DateTime.Today.AddMonths(-1);
            if (User.IsInRole("Admin")==true)
            {
                var r = (from q in con.Invoice_Details
                         where q.Invoice_Date >= dt
                         select q).ToList();

                if (r.Count > 0)
                {
                    return Json(new { success = true, r }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;
                var r = (from q in con.Invoice_Details
                         where q.User_Name==userName && q.Invoice_Date >= dt
                         select q).ToList();

                if (r.Count > 0)
                {
                    return Json(new { success = true, r }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
            
        }
        [OutputCache(Duration = 60, VaryByParam = "*")]
        public ActionResult GetAllInvoiceByDate(DateTime? Dfrom, DateTime? Dto)
        {
            if (User.IsInRole("Admin") == true)
            {
                var r = (from q in con.Invoice_Details
                         where q.Invoice_Date >= Dfrom
                         && q.Invoice_Date <= Dto
                         select q).ToList();
                if (r.Count > 0)
                {
                    return Json(new { success = true, r }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var userName = User.Identity.Name;
                var r = (from q in con.Invoice_Details
                         where q.User_Name== userName && q.Invoice_Date >= Dfrom
                         && q.Invoice_Date <= Dto
                         select q).ToList();
                if (r.Count > 0)
                {
                    return Json(new { success = true, r }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
        }
        [Authorize(Roles = "Admin, Update Record")]
        [OutputCache(Duration = 10, VaryByParam = "*")]
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var check = (from q in con.Invoice_Details
                         where q.Invoice_Number == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(check, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("No Data Found", JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        [OutputCache(Duration = 10, VaryByParam = "*")]
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
                    //var newID = con.Invoice_Details.Select(x => x.Invoice_Number).Max();
                    //int NextID = Convert.ToInt32(newID);
                    //if (NextID == 0)
                    //{
                    //    NextID = 1200000;
                    //}
                    //NextID++;

                    return Json(new { Delete = "Delete", success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { Delete = "NotFound", success = true, message = "Invoice With ID = "+ id +" Not Found to Delete or Already Deleted", JsonRequestBehavior.AllowGet });
        }
        public bool CheckExistingTicketNumber(string tkt)
        {
            bool message = false;
            var info = (from i in con.Invoice_Details
                        where i.Ticket_Number == tkt
                        select i.Ticket_Number).FirstOrDefault();
            if (info == null)
            {
                return message;
            }
            else
            {
                message = true;
                return message;
            }
        }
        public ActionResult GetPayAbleCommission(string PCode)
        {
            // var r = con.AirLines.Where(x => x.Air_ID == PCode).Select(x => x.Ticket_Commission).FirstOrDefault();
            var info = (from q in con.AirLines
                        where q.Air_ID == PCode
                        select q).FirstOrDefault();

            return Json(info, JsonRequestBehavior.AllowGet);
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
        #endregion  return View();

        #region Confirm Receiveable
        [Route("~/receive-amount")]
        [Authorize(Roles = "Admin, Admin Confirm Invoice")]
        public ActionResult ConfirmReceiveable()
        {
            GetAllCustomer();
            return View();
        }
        [Authorize(Roles = "Admin, Admin Confirm Invoice")]
        public ActionResult SaveConfirmReceiveable(int[] InvNo, decimal[] Paid)
        {
            con.Configuration.ProxyCreationEnabled = false;
            if (InvNo.Length > 0)
            {
                for (int i = 0; i < InvNo.Length; i++)
                {
                    int invNO = InvNo[i];
                    decimal paid = Paid[i];

                    var check = (from q in con.Invoice_Details
                                 where q.Invoice_Number == invNO && q.ReceivePay_Status == "0"
                                 select q).FirstOrDefault();

                    if (check != null)
                    {
                        check.Paid = paid;
                        if (check.Invoice_Amount == paid)
                        {
                            check.ReceivePay_Status = "1";
                        }
                        else
                            check.ReceivePay_Status = "0";

                        con.Entry(check).State = EntityState.Modified;
                        con.SaveChanges();
                        //return Json(new{ success = true, message = "Confirmed Received" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, message = "Invoice has already been Received" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { success = true, message = "Confirmed Received" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = false, message = "Invoice has already been Received" }, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin, Admin Confirm Invoice")]
        public ActionResult GetAllConfirmReceiveable()
        {
            con.Configuration.ProxyCreationEnabled = false;

            //var RAmount = (from q in con.Invoice_Details
            //               where q.ReceivePay_Status == "0"
            //               group q by new {q.Invoice_Number } into egroup
            //               select new
            //               {
            //                   Key = egroup.Key,
            //                   Invoice_Number = egroup.Select(g => g.Invoice_Number),
            //                   Paid = egroup.Select(g => g.Paid),
            //                   Invoice_Amount = egroup.Select(g => g.Invoice_Amount),
            //                   Balance = egroup.Sum(g => g.Invoice_Amount-g.Paid),
            //                   Ticket_Number = egroup.Select(g => g.Ticket_Number),
            //                   Description = egroup.Select(g => g.Description),
            //                   ReceivePay_Status = egroup.Select(g => g.ReceivePay_Status)
            //               }).ToList();
            //var RAmount = (from q in con.Invoice_Details
            //               where q.ReceivePay_Status == "0"
            //               select new
            //               {
            //                   q.Invoice_Number,
            //                   q.Paid,
            //                   q.Invoice_Amount,                               
            //                   q.Ticket_Number,
            //                   q.Description,
            //                   q.ReceivePay_Status
            //               }).ToList();
            var RAmount = (from q in con.V_Receiveable
                           where q.ReceivePay_Status == "0"
                           select q).ToList();

            if (RAmount.Count > 0)
            {
                return Json(new { success = true, RAmount }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        //[OutputCache(Duration = 10, VaryByParam = "*")]
        public ActionResult GetAllConfirmInvoiceByDate(DateTime? Dfrom, DateTime? Dto, int? CustCode)
        {
            if (CustCode == null)
            {
                //var RAmount = (from q in con.Invoice_Details
                //               where q.ReceivePay_Status == "0" && q.Invoice_Date >= Dfrom
                //               && q.Invoice_Date <= Dto
                //               select q).ToList();
                var RAmount = (from q in con.V_Receiveable
                               where q.ReceivePay_Status == "0" && q.Invoice_Date >= Dfrom
                               && q.Invoice_Date <= Dto
                               select q).ToList();

                if (RAmount.Count > 0)
                {
                    return Json(new { success = true, RAmount }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //var RAmount = (from q in con.Invoice_Details
                //               where q.ReceivePay_Status == "0" && q.Cust_Code == CustCode && q.Invoice_Date >= Dfrom
                //               && q.Invoice_Date <= Dto
                //               select q).ToList();
                var RAmount = (from q in con.V_Receiveable
                               where q.ReceivePay_Status == "0" && q.Cust_ID == CustCode && q.Invoice_Date >= Dfrom
                               && q.Invoice_Date <= Dto
                               select q).ToList();

                if (RAmount.Count > 0)
                {
                    return Json(new { success = true, RAmount }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
        }
        
        #endregion

        #region Confirm Payable
        [Route("~/pay-amount")]
        [Authorize(Roles = "Admin, Admin Confirm Pay")]
        [OutputCache(Duration = 10)]
        public ActionResult ConfirmPayable()
        {
            GetAllAirLines();
            return View();
        }
        [Authorize(Roles = "Admin, Admin Confirm Pay")]
        public ActionResult SaveConfirmPayable(int[] InvNo, decimal[] Paid2)
        {
            con.Configuration.ProxyCreationEnabled = false;
            if (InvNo.Length > 0)
            {
                for (int i = 0; i < InvNo.Length; i++)
                {
                    int invNO = InvNo[i];
                    decimal paid2 = Paid2[i];

                    var check = (from q in con.Invoice_Details
                                 where q.Invoice_Number == invNO && q.Pay_Status == "0"
                                 select q).FirstOrDefault();

                    if (check != null)
                    {
                        check.Paid2 = paid2;
                        if (check.Net_Payable == paid2)
                        {
                            check.Pay_Status = "1";
                        }
                        else
                            check.Pay_Status = "0";

                        con.Entry(check).State = EntityState.Modified;
                        con.SaveChanges();
                        //return Json(new{ success = true, message = "Confirmed Received" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, message = "Invoice has already been Received" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { success = true, message = "Confirmed Received" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = false, message = "Invoice has already been Received" }, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin, Admin Confirm Pay")]
        // [OutputCache(Duration = 30)]
        public ActionResult GetAllConfirmPayable()
        {
            con.Configuration.ProxyCreationEnabled = false;

            //var PAmount = (from q in con.Invoice_Details
            //               join p in con.AirLines
            //               on q.Payable_Code equals p.Air_ID
            //               where q.Pay_Status == "0"
            //               select new { 
            //               q.Invoice_Number,
            //               q.Paid2,
            //               q.Net_Payable,
            //               q.Ticket_Number,
            //               q.Description,
            //               q.Pay_Status,
            //               p.Payable_Code
            //               }).ToList();
            var PAmount = (from q in con.V_Payable
                           where q.Pay_Status == "0"
                           select new
                           {
                               q.Invoice_Number,
                               q.Paid2,
                               q.Net_Payable,
                               q.Ticket_Number,
                               q.Description,
                               q.Pay_Status,
                               q.Payable_Code,
                               q.Balance
                           }).ToList();

            if (PAmount.Count > 0)
            {
                return Json(new { success = true, PAmount }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(Duration = 10, VaryByParam = "*")]
        public ActionResult GetAllConfirmPayableByDate(DateTime? Dfrom, DateTime? Dto, string AirID)
        {
            if (AirID == "")
            {
                //var PAmount = (from q in con.Invoice_Details
                //               join p in con.AirLines
                //               on q.Payable_Code equals p.Air_ID
                //               where q.Pay_Status == "0" && q.Invoice_Date >= Dfrom
                //               && q.Invoice_Date <= Dto
                //               select new
                //               {
                //                   q.Invoice_Number,
                //                   q.Paid2,
                //                   q.Net_Payable,
                //                   q.Ticket_Number,
                //                   q.Description,
                //                   q.Pay_Status,
                //                   p.Payable_Code
                //               }).ToList();
                var PAmount = (from q in con.V_Payable
                               where q.Pay_Status == "0" && q.Invoice_Date >= Dfrom
                               && q.Invoice_Date <= Dto
                               select new
                               {
                                   q.Invoice_Number,
                                   q.Paid2,
                                   q.Net_Payable,
                                   q.Ticket_Number,
                                   q.Description,
                                   q.Pay_Status,
                                   q.Payable_Code,
                                   q.Balance
                               }).ToList();

                if (PAmount.Count > 0)
                {
                    return Json(new { success = true, PAmount }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var PAmount = (from q in con.V_Payable
                               where q.Pay_Status == "0" && q.Air_ID == AirID && q.Invoice_Date >= Dfrom
                               && q.Invoice_Date <= Dto
                               select new
                               {
                                   q.Invoice_Number,
                                   q.Paid2,
                                   q.Net_Payable,
                                   q.Ticket_Number,
                                   q.Description,
                                   q.Pay_Status,
                                   q.Payable_Code,
                                   q.Balance
                               }).ToList();

                if (PAmount.Count > 0)
                {
                    return Json(new { success = true, PAmount }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false, message = "No Data found" }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        [Authorize(Roles = "Admin, View Invoice Details")]
        //[OutputCache(Duration = 10, VaryByParam = "none")]
        public ActionResult InvoiceDetailsReport()
        {
            return View();
        }

        [OutputCache(Duration = 120, VaryByParam = "*")]
        public ActionResult GetInvoiceDetailsReport(DateTime? Dfrom, DateTime? Dto, string Pay_Status)
        {
            DateTime dt = DateTime.Today.AddMonths(-1);

            if (Dfrom != null && Dto != null && Pay_Status != null)
            {
                var data = (from q in con.spGet_All_Invoice_DetailsByDateAndPayStatus(Dfrom, Dto, Pay_Status)
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
                var data = (from q in con.spGet_All_Invoice_Details()
                            where q.Invoice_Date >= dt
                            select q).ToList();

                //var InvoiceDetails = Json(data, JsonRequestBehavior.AllowGet);
                //InvoiceDetails.MaxJsonLength = int.MaxValue;

                if (data.Count > 0)
                {
                    return Json(new { data, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { message = "No data found", success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        //[ChildActionOnly]
        //[OutputCache(Duration = 10)]
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



        public ActionResult GetInvoice(int InvNo)
        {
            var data = (from q in con.Invoice_Details
                        join c in con.Customers on q.Cust_Code equals c.Cust_ID
                     where q.Invoice_Number == InvNo
                     select new { 
                     c.Company_Name,
                     c.Contact_Name,
                     c.Cust_Code,
                     c.Phone,
                     c.Address,
                     c.City,
                     q.Invoice_Number,
                     q.Invoice_Date,
                     q.Invoice_Amount,
                     q.Net_Payable,
                     q.Other_Ref,
                     q.Ticket_Number,
                     q.Description
                     }).ToList();

            return Json(new { data, success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}
