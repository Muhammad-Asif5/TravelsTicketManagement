using AMS.DataSets;
using AMS.Models;
using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AMS.WebForm
{
    public partial class BReceipts : System.Web.UI.Page
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
            if (!IsPostBack)
            {
                string InvNo = Request.QueryString["Vid"];
                //string InvoiceNo = Request.QueryString["InvNo"];

                ChangeFunction(InvNo);
            }
            else
            {
                ReportDocument doc = (ReportDocument)Session["EmpSalesReport"];
                Receipt.ReportSource = doc;
            }
        }

        public void ChangeFunction(string VID)
        {
            ds = new AllDataSets();
            SqlCommand cmd = new SqlCommand("SELECT Voucher.VID, Voucher.Received_Paid_Date, Customers.Cust_Code, " +
                " Customers.Company_Name, Customers.Contact_Name, Customers.Address, Voucher.Amount, Voucher.Narration, " +
                " Voucher.Received_Paid FROM Voucher INNER JOIN Customers ON Voucher.Cust_Code = Customers.Cust_ID " +
                " WHERE(Voucher.VID = '" + VID + "')", con);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(ds, "ReceiptTable");

            ReportDocument po = new ReportDocument();
            po.Load(Server.MapPath("~/Reports/rpt_BReceipt.rpt"));
            po.SetDataSource(ds);
            Session["EmpSalesReport"] = po;
            Receipt.ReportSource = po;
            Receipt.DataBind();
            Receipt.RefreshReport();

            //this.Receipt.BestFitPage = true;
            //this.Receipt.HasExportButton = true;
            //this.Receipt.EnableDrillDown = true;
            //this.Receipt.ShowAllPageIds = true;
            //this.Receipt.Zoom(100);
            //this.Receipt.HasPrintButton = true;
            //this.Receipt.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            ViewReport();
        }
        private void ViewReport()
        {
            this.Receipt.BestFitPage = true;
            this.Receipt.HasExportButton = true;
            this.Receipt.EnableDrillDown = true;
            this.Receipt.ShowAllPageIds = true;
            this.Receipt.Zoom(100);
            this.Receipt.HasPrintButton = true;
            this.Receipt.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            //this.Receipt.SeparatePages = false;

            this.Receipt.PrintMode = CrystalDecisions.Web.PrintMode.ActiveX;
            //this.Receipt.ShowAllPageIds = true;

            int myFOpts = (int)(CrystalDecisions.Shared.ViewerExportFormats.ExcelRecordFormat | CrystalDecisions.Shared.ViewerExportFormats.PdfFormat | CrystalDecisions.Shared.ViewerExportFormats.RptrFormat | CrystalDecisions.Shared.ViewerExportFormats.ExcelFormat | CrystalDecisions.Shared.ViewerExportFormats.WordFormat | CrystalDecisions.Shared.ViewerExportFormats.XLSXFormat);
            this.Receipt.AllowedExportFormats = myFOpts;
        }
    }
}