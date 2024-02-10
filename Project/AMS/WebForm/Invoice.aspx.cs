using AMS.DataSets;
using AMS.Models;
using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using CrystalDecisions.CrystalReports;
using CrystalDecisions.Shared;

namespace AMS.WebForm
{
    public partial class Invoice : System.Web.UI.Page
    {
        Entities db = new Entities();
        AllDataSets ds;
        DataTable dt = new DataTable();
        private static string GetConStr
        {
            get
            {
                string strConnection = System.Configuration.ConfigurationManager.ConnectionStrings["AMS.Properties.Settings.Setting"].ConnectionString;
                return strConnection;
            }
        }
        SqlConnection con = new SqlConnection(GetConStr);
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!IsPostBack)
            //{
            //    string InvNo = Request.QueryString["InvNo"];
            //    //string InvoiceNo = Request.QueryString["InvNo"];

            //    ChangeFunction(InvNo);

            //}
            //else
            //{

            //    ReportDocument doc = (ReportDocument)Session["EmpSalesReport"];
            //    Inovice.ReportSource = doc;
            //}


            string InvNo = Request.QueryString["InvNo"];

            ChangeFunction(InvNo);
            //ReportDocument doc = (ReportDocument)Session["EmpSalesReport"];
            //Inovice.ReportSource = doc;
        }

        public void ChangeFunction(string InvoiceNo)
        {
            ds = new AllDataSets();
            SqlCommand cmd = new SqlCommand("SELECT Invoice_Details.Invoice_Number, Invoice_Details.ReceivePay_Status, "+
                " Invoice_Details.Pay_Status, Invoice_Details.Invoice_Date, Invoice_Details.Ticket_Number, " +
                " Invoice_Details.Description, Invoice_Details.Routing, Invoice_Details.Departure_Date, " +
                " Invoice_Details.Arrival_Date, Invoice_Details.Ticket_Status, Invoice_Details.Paid, " +
" (CASE WHEN Invoice_Details.Ticket_Status = '03' THEN Refund.Customer_Penalty ELSE Invoice_Details.Invoice_Amount END) "+
" AS Invoice_Amount, Invoice_Details.Base_Fare, Invoice_Details.Tax,  " +
" Invoice_Details.Other_Cost, (CASE WHEN Invoice_Details.Ticket_Status = '03' "+
" THEN Refund.AirLine_Penalty ELSE Invoice_Details.Net_Payable END) AS Net_Payable, Invoice_Details.Stream_ID, "+
" Invoice_Details.Paid2, Invoice_Details.Other_Ref, Invoice_Details.Payable_Code, "+
" Invoice_Details.Agent_ID, Invoice_Details.Ticket_Commission, "+
" Invoice_Details.Commission_Amount, Invoice_Details.TicketClass_ID, Customers.Cust_Code AS Cust_Code, Customers.Lookup,"+
" Customers.Address, Customers.City, Customers.State, Customers.ZIP_Code, Customers.Cust_ID, " +
" Customers.Phone, Customers.Email, Customers.Fax, Customers.Contact_Name, Customers.Company_Name " +
" FROM            Invoice_Details INNER JOIN " +
" Customers ON Invoice_Details.Cust_Code = Customers.Cust_ID LEFT OUTER JOIN " +
" Refund ON Invoice_Details.Invoice_Number = Refund.Invoice_Number " +
" WHERE(Invoice_Details.Invoice_Number = '" + InvoiceNo + "')", con);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            //da.Fill(ds, "Invoice_Details");
            dt = new DataTable();
            dt.TableName = "Invoice_Details";
            da.Fill(dt);
            

            ReportDocument po = new ReportDocument();
            po.Load(Server.MapPath("~/Reports/rpt_Invoice.rpt"));
            po.SetDataSource(dt);


            Inovice.PageZoomFactor = 100;
            Inovice.HasToggleGroupTreeButton = false;
            Inovice.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            Inovice.HasToggleParameterPanelButton = false;
            Inovice.HasCrystalLogo = false;
            Inovice.HasDrillUpButton = false;
            Inovice.HasSearchButton = false;
            Inovice.HasZoomFactorList = false;
            Inovice.EnableDrillDown = false;
            Inovice.HasDrilldownTabs = false;
            Inovice.DisplayStatusbar = false;
            Inovice.EnableParameterPrompt = false;
            Inovice.ReuseParameterValuesOnRefresh = true;
            Inovice.EnableDatabaseLogonPrompt = false;
            Inovice.ReportSource = po;

            //Session["EmpSalesReport"] = po;
            //Inovice.ReportSource = po;
            //Inovice.DataBind();
            //Inovice.RefreshReport();

            //this.Inovice.BestFitPage = true;
            //this.Inovice.HasExportButton = true;
            //this.Inovice.EnableDrillDown = true;
            //this.Inovice.ShowAllPageIds = true;
            //this.Inovice.Zoom(100);
            //this.Inovice.HasPrintButton = true;
            //this.Inovice.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            //ViewReport();
        }
        private void ViewReport()
        {
            this.Inovice.BestFitPage = true;
            this.Inovice.HasExportButton = true;
            this.Inovice.EnableDrillDown = false;
            this.Inovice.ShowAllPageIds = false;
            this.Inovice.HasGotoPageButton = false;
            this.Inovice.HasPageNavigationButtons = false;
            this.Inovice.HasToggleGroupTreeButton = false;
            this.Inovice.HasCrystalLogo = false;
            this.Inovice.HasDrillUpButton = false;
            this.Inovice.HasDrilldownTabs = false;

            this.Inovice.Zoom(100);
            this.Inovice.HasPrintButton = true;
            this.Inovice.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            //this.Inovice.SeparatePages = false;

            this.Inovice.PrintMode = CrystalDecisions.Web.PrintMode.ActiveX;
            //this.Inovice.ShowAllPageIds = true;

            int myFOpts = (int)(CrystalDecisions.Shared.ViewerExportFormats.ExcelRecordFormat | CrystalDecisions.Shared.ViewerExportFormats.PdfFormat | CrystalDecisions.Shared.ViewerExportFormats.RptrFormat | CrystalDecisions.Shared.ViewerExportFormats.ExcelFormat | CrystalDecisions.Shared.ViewerExportFormats.WordFormat | CrystalDecisions.Shared.ViewerExportFormats.XLSXFormat);
            this.Inovice.AllowedExportFormats = myFOpts;
        }


        public void toPDF(string InvoiceNo)
        {
            ds = new AllDataSets();
            SqlCommand cmd = new SqlCommand("SELECT Invoice_Details.Invoice_Number, Customers.Cust_Code, " +
                " Customers.Lookup, Customers.Address, Customers.City, Customers.Phone, Customers.ZIP_Code, " +
                " Customers.State, Customers.Email, Customers.Fax, " +
                " Customers.Contact_Name, Customers.Company_Name, Customers.Cust_ID, Invoice_Details.Invoice_Date, " +
                " Invoice_Details.Description, Invoice_Details.Ticket_Number, Invoice_Details.Invoice_Amount, " +
                " Invoice_Details.Net_Payable FROM Customers INNER JOIN " +
                " Invoice_Details ON Customers.Cust_ID = Invoice_Details.Cust_Code " +
                " WHERE(Invoice_Details.Invoice_Number = '" + InvoiceNo + "')", con);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(ds, "Invoice_Details");
            ReportDocument crpt = new ReportDocument();
            crpt.Load(Server.MapPath("~/Reports/rpt_Invoice.rpt"));
            crpt.SetDataSource(ds);
            crpt.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, @"c:\Pdf Files\Invoice.pdf");
        }
    }
}






