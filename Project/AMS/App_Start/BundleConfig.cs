using System.Web;
using System.Web.Optimization;

namespace AMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;   //enable CDN support


            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));











            var allmincss = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";
            bundles.Add(new StyleBundle("~/AdminAssets/css", allmincss).Include(
                      "~/AdminAssets/Datepicker/StyleSheet1.css"));

            bundles.Add(new StyleBundle("~/Datepicker/css").Include(
                      "~/AdminAssets/Datepicker/StyleSheet1.css"));

            bundles.Add(new StyleBundle("~/datatablesResponsive/css").Include(
                      "~/AdminAssets/ionicons/2.0.1/css/ionicons.min.css",
                      "~/AdminAssets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css",
                      "~/AdminAssets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css"));

            var datatablesSelect = "//cdn.datatables.net/select/1.3.1/css/select.bootstrap4.min.css";
            bundles.Add(new StyleBundle("~/AdminAssets1/css", datatablesSelect).Include(
                     "~/AdminAssets/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css"));

            bundles.Add(new StyleBundle("~/select2/css").Include(
                     "~/AdminAssets/plugins/select2/css/select2.min.css",
                     "~/AdminAssets/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css"));

            var datatablesbutton = "https://cdn.datatables.net/buttons/1.2.3/css/buttons.dataTables.min.css";
            bundles.Add(new StyleBundle("~/buttonsDataTables/css", datatablesbutton).Include(
                     "~/AdminAssets/pnotify/dist/pnotify.css"));

            bundles.Add(new StyleBundle("~/pnotify/css").Include(
                     "~/AdminAssets/pnotify/dist/pnotify.css"));

            bundles.Add(new StyleBundle("~/adminlte/css").Include(
                     "~/AdminAssets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css",
                     "~/AdminAssets/dist/css/adminlte.min.css"));

            var googleapis = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700";
            bundles.Add(new StyleBundle("~/googleapis/css", googleapis).Include(
                    "~/AdminAssets/plugins/summernote/summernote-bs4.css"));

            bundles.Add(new StyleBundle("~/SweetalertSpinerAndMaxlength/css").Include(
                "~/AdminAssets/sweetalert/sweetalert.css",
                "~/AdminAssets/Spiner.css",
                "~/AdminAssets/maxlength.css"));





            bundles.Add(new ScriptBundle("~/AdminAssets/jquery").Include(
                      "~/AdminAssets/plugins/jquery/jquery.min.js"));
            
            bundles.Add(new ScriptBundle("~/AdminAssets/bootstrap").Include(
                      "~/AdminAssets/plugins/bootstrap/js/bootstrap.bundle.min.js"));

            bundles.Add(new ScriptBundle("~/AdminAssets/Datepicker/jquery").Include(
                      "~/AdminAssets/Datepicker/jquery-ui.js",
                      "~/AdminAssets/Datepicker/vendors.bundle.js"));

            bundles.Add(new ScriptBundle("~/AdminAssets/datatables/jquery").Include(
                      "~/AdminAssets/plugins/datatables/jquery.dataTables.min.js",
                      "~/AdminAssets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js",
                      "~/AdminAssets/plugins/datatables-responsive/js/dataTables.responsive.min.js",
                      "~/AdminAssets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js",
                      "~/AdminAssets/plugins/sweetalert2/sweetalert2.min.js",
                      "~/AdminAssets/pnotify/dist/pnotify.js",
                      "~/AdminAssets/pnotify/dist/pnotify.buttons.js",
                      "~/AdminAssets/pnotify/dist/pnotify.nonblock.js",
                      "~/AdminAssets/plugins/select2/js/select2.full.min.js",
                      "~/AdminAssets/plugins/inputmask/min/jquery.inputmask.bundle.min.js",
                      "~/AdminAssets/plugins/bootstrap-switch/js/bootstrap-switch.min.js",
                      "~/AdminAssets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js",
                      "~/AdminAssets/dist/js/adminlte.js",
                      "~/AdminAssets/dist/js/demo.js",
                      "~/AdminAssets/plugins/jquery-validation/jquery.validate.min.js",
                      "~/AdminAssets/plugins/jquery-validation/additional-methods.min.js",
                      "~/AdminAssets/plugins/summernote/summernote-bs4.min.js",
                      "~/AdminAssets/sweetalert/sweetalert.min.js",
                      "~/AdminAssets/bootstrap-maxlength/bootstrap-maxlength.js"));



            bundles.Add(new StyleBundle("~/AdminAssets/css/daterangepicker").Include(
                "~/AdminAssets/plugins/daterangepicker/daterangepicker.css"));

            bundles.Add(new ScriptBundle("~/AdminAssets/js/daterangepicker").Include(
                      "~/AdminAssets/plugins/daterangepicker/daterangepicker.js"));

            bundles.Add(new ScriptBundle("~/AdminAssets/js/DatatableButton").Include(
                      "~/AdminAssets/plugins/datatables/dataTables.buttons.min.js",
                      "~/AdminAssets/plugins/datatables/jszip.min.js",
                      "~/AdminAssets/plugins/datatables/pdfmake.min.js",
                      "~/AdminAssets/plugins/datatables/vfs_fonts.js",
                      "~/AdminAssets/plugins/datatables/buttons.html5.min.js"));


            bundles.Add(new ScriptBundle("~/jsController/CustomerControllerMin").Include(
                     "~/AdminAssets/jsController/CustomerController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/APControllerMin").Include(
                     "~/AdminAssets/jsController/APController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/EXPControllerMin").Include(
                     "~/AdminAssets/jsController/EXPController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/AgentControllerMin").Include(
                     "~/AdminAssets/jsController/AgentController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/StreamControllerMin").Include(
                     "~/AdminAssets/jsController/StreamController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/BankControllerMin").Include(
                     "~/AdminAssets/jsController/BankController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/GInvoiceControllerMin").Include(
                     "~/AdminAssets/jsController/GInvoiceController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/ConfirmInvControllerMin").Include(
                     "~/AdminAssets/jsController/ConfirmInvController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/ConfirmPayControllerMin").Include(
                     "~/AdminAssets/jsController/ConfirmPayController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/RefunInvControllerMin").Include(
                     "~/AdminAssets/jsController/RefunInvController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/ARReceiptControllerMin").Include(
                     "~/AdminAssets/jsController/ARReceiptController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/APReceiptControllerMin").Include(
                     "~/AdminAssets/jsController/APReceiptController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/InvDetailsControllerMin").Include(
                     "~/AdminAssets/jsController/InvDetailsController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/UnpaidInvControllerMin").Include(
                     "~/AdminAssets/jsController/UnpaidInvController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/CashBookControllerMin").Include(
                     "~/AdminAssets/jsController/CashBookController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/ReceiveableControllerMin").Include(
                     "~/AdminAssets/jsController/ReceiveableController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/PayableControllerMin").Include(
                     "~/AdminAssets/jsController/PayableController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/BankStatementControllerMin").Include(
                     "~/AdminAssets/jsController/BankStatementController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/ARSummaryControllerMin").Include(
                     "~/AdminAssets/jsController/ARSummaryController.min.js"));
            bundles.Add(new ScriptBundle("~/jsController/APSummaryControllerMin").Include(
                     "~/AdminAssets/jsController/APSummaryController.min.js"));


            bundles.Add(new ScriptBundle("~/jsController/CustomerController").Include(
                     "~/AdminAssets/jsController/CustomerController.js"));


            BundleTable.EnableOptimizations = true;
        }
    }
}
