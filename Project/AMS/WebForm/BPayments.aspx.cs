using AMS.DataSets;
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
    public partial class BPayments : System.Web.UI.Page
    {
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
                Payment.ReportSource = doc;
            }
        }

        public void ChangeFunction(string VID)
        {
            ds = new AllDataSets();
            SqlCommand cmd = new SqlCommand("SELECT Voucher.VID, DailyExpenses.Account, " +
" (CASE WHEN Voucher.Payable_Code IS NULL THEN DailyExpenses.Contact_Name ELSE AirLines.Payable_Supplier END) AS PayableCode, " +
" Voucher.Received_Paid, Voucher.Narration, Voucher.Amount FROM Voucher LEFT OUTER JOIN " +
" DailyExpenses ON Voucher.Exp_Code = DailyExpenses.Exp_Code LEFT OUTER JOIN " +
" AirLines ON Voucher.Payable_Code = AirLines.Air_ID WHERE(Voucher.VID = '" + VID + "')", con);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(ds, "PayableTable");

            ReportDocument po = new ReportDocument();
            po.Load(Server.MapPath("~/Reports/rpt_BPayment.rpt"));
            po.SetDataSource(ds);
            Session["EmpSalesReport"] = po;
            Payment.ReportSource = po;
            Payment.DataBind();
            Payment.RefreshReport();

            //this.Payment.BestFitPage = true;
            //this.Payment.HasExportButton = true;
            //this.Payment.EnableDrillDown = true;
            //this.Payment.ShowAllPageIds = true;
            //this.Payment.Zoom(100);
            //this.Payment.HasPrintButton = true;
            //this.Payment.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            ViewReport();
        }
        private void ViewReport()
        {
            this.Payment.BestFitPage = true;
            this.Payment.HasExportButton = true;
            this.Payment.EnableDrillDown = true;
            this.Payment.ShowAllPageIds = true;
            this.Payment.Zoom(100);
            this.Payment.HasPrintButton = true;
            this.Payment.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
            //this.Payment.SeparatePages = false;

            this.Payment.PrintMode = CrystalDecisions.Web.PrintMode.ActiveX;
            //this.Payment.ShowAllPageIds = true;

            int myFOpts = (int)(CrystalDecisions.Shared.ViewerExportFormats.ExcelRecordFormat | CrystalDecisions.Shared.ViewerExportFormats.PdfFormat | CrystalDecisions.Shared.ViewerExportFormats.RptrFormat | CrystalDecisions.Shared.ViewerExportFormats.ExcelFormat | CrystalDecisions.Shared.ViewerExportFormats.WordFormat | CrystalDecisions.Shared.ViewerExportFormats.XLSXFormat);
            this.Payment.AllowedExportFormats = myFOpts;
        }
    }
}