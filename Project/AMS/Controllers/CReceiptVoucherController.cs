using AMS.DataSets;
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
    public class CReceiptVoucherController : Controller
    {
        // GET: CReceiptVoucher
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
        SqlConnection con = new SqlConnection(GetConStr);
        public ActionResult CReceiptVoucher(string InvNo)
        {
            if (InvNo==null)
            {
                return RedirectToAction("GenerateInvoice", "GenerateInvoice");
            }
            else
            {                
                SqlCommand cmd = new SqlCommand("SELECT Invoice_Details.Invoice_Number, Invoice_Details.ReceivePay_Status, Invoice_Details.Pay_Status, Invoice_Details.Invoice_Date, Invoice_Details.Ticket_Number, Invoice_Details.Description, " +
                         " Invoice_Details.Routing, Invoice_Details.Departure_Date, Invoice_Details.Arrival_Date, Invoice_Details.Ticket_Status, Invoice_Details.Paid, Invoice_Details.Base_Fare, Invoice_Details.Tax, " +
                         " Invoice_Details.Other_Cost, Invoice_Details.Stream_ID, Invoice_Details.Paid2, Invoice_Details.Other_Ref, Invoice_Details.Payable_Code, Invoice_Details.Agent_ID, Invoice_Details.Ticket_Commission, "+
                         " Invoice_Details.Commission_Amount, Invoice_Details.TicketClass_ID, Customers.Cust_Code, Customers.Lookup, Customers.Address, Customers.City, Customers.State, Customers.ZIP_Code, Customers.Cust_ID, " +
                         " Customers.Phone, Customers.Email, Customers.Fax, Customers.Contact_Name, Customers.Company_Name, Invoice_Details.Customer_Penalty, Invoice_Details.AirLine_Penalty, " + 
                         " Invoice_Details.Invoice_Amount, Invoice_Details.Net_Payable " +
                         " FROM            Invoice_Details INNER JOIN "+ 
                         " Customers ON Invoice_Details.Cust_Code = Customers.Cust_ID "+ 
                         " WHERE(Invoice_Details.Invoice_Number = "+ InvNo + ")",con);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds, "Invoice_Details");
                //da.Fill(ds.Tables["Invoice_Details"]);
                dt = new DataTable();
                dt.TableName = "Invoice_Details";
                da.Fill(dt);
                if (dt.Rows.Count ==0)
                {

                    return RedirectToAction("GenerateInvoice", "GenerateInvoice");
                }
                else
                {
                    

                    ViewBag.Invoice_Number = dt.Rows[0]["Invoice_Number"];
                    ViewBag.ReceivePay_Status = dt.Rows[0]["ReceivePay_Status"];
                    ViewBag.Pay_Status = dt.Rows[0]["Pay_Status"];
                    ViewBag.Invoice_Date = dt.Rows[0]["Invoice_Date"];
                    ViewBag.Ticket_Number = dt.Rows[0]["Ticket_Number"];
                    ViewBag.Description = dt.Rows[0]["Description"];
                    ViewBag.Routing = dt.Rows[0]["Routing"];
                    ViewBag.Departure_Date = dt.Rows[0]["Departure_Date"];
                    ViewBag.Arrival_Date = dt.Rows[0]["Arrival_Date"];
                    ViewBag.Ticket_Status = dt.Rows[0]["Ticket_Status"];
                    ViewBag.Paid = dt.Rows[0]["Paid"];
                    ViewBag.Base_Fare = dt.Rows[0]["Base_Fare"];
                    ViewBag.Tax = dt.Rows[0]["Tax"];
                    ViewBag.Other_Cost = dt.Rows[0]["Other_Cost"];
                    ViewBag.Net_Payable = dt.Rows[0]["Net_Payable"];
                    ViewBag.Invoice_Amount = dt.Rows[0]["Invoice_Amount"];
                    ViewBag.Stream_ID = dt.Rows[0]["Stream_ID"];
                    ViewBag.Paid2 = dt.Rows[0]["Paid2"];
                    ViewBag.Other_Ref = dt.Rows[0]["Other_Ref"];
                    ViewBag.Payable_Code = dt.Rows[0]["Payable_Code"];
                    ViewBag.Agent_ID = dt.Rows[0]["Agent_ID"];
                    ViewBag.Ticket_Commission = dt.Rows[0]["Ticket_Commission"];
                    ViewBag.Commission_Amount = dt.Rows[0]["Commission_Amount"];
                    ViewBag.TicketClass_ID = dt.Rows[0]["TicketClass_ID"];
                    ViewBag.Cust_Code = dt.Rows[0]["Cust_Code"];
                    ViewBag.Lookup = dt.Rows[0]["Lookup"];
                    ViewBag.Address = dt.Rows[0]["Address"];
                    ViewBag.City = dt.Rows[0]["City"];
                    ViewBag.State = dt.Rows[0]["State"];
                    ViewBag.ZIP_Code = dt.Rows[0]["ZIP_Code"];
                    ViewBag.Cust_ID = dt.Rows[0]["Cust_ID"];
                    ViewBag.Phone = dt.Rows[0]["Phone"];
                    ViewBag.Email = dt.Rows[0]["Email"];
                    ViewBag.Fax = dt.Rows[0]["Fax"];
                    ViewBag.Contact_Name = dt.Rows[0]["Contact_Name"];
                    ViewBag.Company_Name = dt.Rows[0]["Company_Name"];

                    return View();
                }
                
            }
            
        }

      
    }
}