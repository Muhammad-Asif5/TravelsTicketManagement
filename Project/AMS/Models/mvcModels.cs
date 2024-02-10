using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AMS.Models
{
    #region Customer View
    public class mvcCustomerViewModel
    {
        public int Cust_ID { get; set; }
        [Required]
        [Display(Name = "Lookup")]
        public string Lookup { get; set; }
        [Required]
        [Display(Name = "Cust Code")]
        public string Cust_Code { get; set; }
        [Required]
        [Display(Name = "Company Name")]
        public string Company_Name { get; set; }
        [Required]
        [Display(Name = "Contact Name")]
        public string Contact_Name { get; set; }
        [Required]
        [Display(Name = "Address")]
        public string Address { get; set; }
        [Required]
        [Display(Name = "City")]
        public string City { get; set; }
        [Required]
        [Display(Name = "State")]
        public string State { get; set; }
        [Required]
        [Display(Name = "ZIP Code")]
        public string ZIP_Code { get; set; }
        [Required]
        [Display(Name = "Phone")]
        public string Phone { get; set; }
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
        [Required]
        [Display(Name = "Fax")]
        public string Fax { get; set; }

    }

    #endregion

    #region Air Lines

    public class mvcModelAirLine
    {
        [Required]
        [Display(Name = "ID")]
        public string Air_ID { get; set; }
        [Required(ErrorMessage = "Enter Payable Code")]
        [Display(Name = "Payable Code")]
        public string Payable_Code { get; set; }
        [Required(ErrorMessage = "Enter Payable Supplier")]
        [Display(Name = "Payable Supplier")]
        public string Payable_Supplier { get; set; }
        [Required(ErrorMessage = "Enter Ticket Commission")]
        [Display(Name = "Ticket Commission")]
        public Nullable<decimal> Ticket_Commission { get; set; }
        [Required(ErrorMessage = "Enter VAT")]
        [Display(Name = "VAT %")]
        public Nullable<decimal> VAT { get; set; }
        public int Cat_ID { get; set; }
    }

    #endregion

    #region Exp
    public class mvcModelDailyExpens
    {
        [Required]
        [Display(Name = "ID")]
        public string Exp_Code { get; set; }
        [Required(ErrorMessage = "Enter Account")]
        [Display(Name = "Account")]
        public string Account { get; set; }
        [Required(ErrorMessage = "Enter Contact Name")]
        [Display(Name = "Contact Name")]
        public string Contact_Name { get; set; }
        public int Cat_ID { get; set; }
    }

    #endregion

    #region Income Stream

    public class mvcModelIncome_Stream
    {
        [Required]
        [Display(Name = "ID")]
        public string Stream_ID { get; set; }
        [Required(ErrorMessage = "Enter Stream Name")]
        [Display(Name = "Stream Name")]
        public string Stream_Name { get; set; }
        [Required(ErrorMessage = "Select Stream Status")]
        [Display(Name = "Stream Status")]
        public string Stream_Status { get; set; }

    }

    #endregion

    #region Invoice Details

    public class mvcModelsInvoice_Details
    {
        public int Invoice_Number { get; set; }
        public string AltInvoice_Number { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        [Display(Name = "Invoice Date")]
        public Nullable<System.DateTime> Invoice_Date { get; set; }
        [Display(Name = "Ticket Number")]
        [Required]
        public string Ticket_Number { get; set; }
        [Display(Name = "Passenger Name")]
        [Required]
        public string Description { get; set; }
        [Display(Name = "Routing")]
        [Required]
        public string Routing { get; set; }
        [Display(Name = "Departure Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        [Required]
        public Nullable<System.DateTime> Departure_Date { get; set; }
        [Display(Name = "Arrival Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        [Required]
        public Nullable<System.DateTime> Arrival_Date { get; set; }
        [Display(Name = "Base Fare")]
        [Required]
        public Nullable<decimal> Base_Fare { get; set; }
        
        [Display(Name = "Total Value")]
        [Required]
        public Nullable<decimal> Total_Value { get; set; }
        [Display(Name = "Tax")]
        [Required]
        public Nullable<decimal> Tax { get; set; }
        [Display(Name = "Other Cost")]
        [Required]
        public Nullable<decimal> Other_Cost { get; set; }
        [Display(Name = "Stream")]
        [Required]
        public string Stream_ID { get; set; }
        [Display(Name = "Cust Code")]
        [Required]
        public Nullable<int> Cust_Code { get; set; }
        [Display(Name = "Ticket Status")]
        [Required]
        public string Ticket_Status { get; set; }
        [Display(Name = "Payable Code")]
        [Required]
        public string Payable_Code { get; set; }
        [Display(Name = "Agent")]
        [Required]
        public Nullable<int> Agent_ID { get; set; }
        [Display(Name = "TicketClass")]
        [Required]
        public Nullable<int> TicketClass_ID { get; set; }
        public string Other_Ref { get; set; }
        public string Payable_Supplier { get; set; }
        public string Agent_Name { get; set; }
        public string Ticket_Class { get; set; }
        [Display(Name = "AirLine Penalty")]
        [Required]
        public Nullable<decimal> AirLine_Penalty { get; set; }
        [Display(Name = "Customer Penalty")]
        [Required]
        public Nullable<decimal> Customer_Penalty { get; set; }

        public string Air_ID { get; set; }

        [Display(Name = "Invoice Amount")]
        [Required]
        public Nullable<decimal> Invoice_Amount { get; set; }
        [Display(Name = "Ticket Commission")]
        [Required]
        public Nullable<decimal> Ticket_Commission { get; set; }
        [Display(Name = "Commission Amount")]
        [Required]
        public Nullable<decimal> Commission_Amount { get; set; }
        [Display(Name = "Net Payable")]
        [Required]
        public Nullable<decimal> Net_Payable { get; set; }

        public Nullable<decimal> Paid { get; set; }
        public Nullable<decimal> Paid2 { get; set; }

        public string Pay_Status { get; set; }
        public string ReceivePay_Status { get; set; }
        public string Bank_Cash_Receiveable { get; set; }
        public string Stream_Name { get; set; }
        public string Ticket_Class_Status { get; set; }
        public string CustCode { get; set; }
        public Nullable<decimal> VAT { get; set; }
        public Nullable<decimal> VAT_Amount { get; set; }
    }

    #endregion

    #region Amount Receiveable

    public class mvcModelsAmountReceiveable
    {
        public int VID { get; set; }
        [Display(Name = "Receive Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Received_Paid_Date { get; set; }
        public string Narration { get; set; }
        [Display(Name = "Received From")]
        public string Received_Paid { get; set; }
        public Nullable<decimal> Amount { get; set; }

        public Nullable<int> Cust_Code { get; set; }
        [Display(Name = "Customer")]
        public string CustName { get; set; }
        [Display(Name = "Select Bank")]
        public int Bank_ID { get; set; }


    }

    #endregion

    #region Amount Payable

    public class mvcModelsAmountPayable
    {
        public int VID { get; set; }
        [Display(Name = "Paid Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Received_Paid_Date { get; set; }
        public Nullable<int> AccountID { get; set; }
        public string DrCr { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public string Narration { get; set; }
        public string Received_Paid { get; set; }
        public string Cust_Code { get; set; }
        public string Payable_Code { get; set; }
        [Display(Name = "Code")]
        public string Exp_Code { get; set; }
        public int Bank_ID { get; set; }
        //public virtual AirLine AirLine { get; set; }
    }

    #endregion

    #region Bank Receiveable
    public class BankReceiveable_Result
    {
        public int? Receipt_Ref { get; set; }
        [Display(Name = "Receive Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Date { get; set; }
        [Display(Name = "Receive From")]
        public string Received_Paid { get; set; }
        [Display(Name = "Description")]
        public string Narration { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> Balance { get; set; }
        [Display(Name = "AR CODE")]
        public string Cust_Code { get; set; }

        //public string VID { get; set; }
        //[Display(Name = "Receive Date")]
        //[DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        //public Nullable<System.DateTime> Received_Paid_Date { get; set; }
        //public string Narration { get; set; }
        //[Display(Name = "Received From")]
        //public string Received_Paid { get; set; }
        //public Nullable<decimal> Amount { get; set; }

        //public Nullable<int> Cust_Code { get; set; }
        //public Nullable<decimal> Balance { get; set; }
        //[Display(Name = "Customer")]
        //public string CustName { get; set; }

    }

    #endregion

    #region Bank Payable

    public class BankPayable_Result
    {
        public int? Payment_Ref { get; set; }
        [Display(Name = "Paid Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Date { get; set; }
        public string Received_From { get; set; }
        [Display(Name = "Description")]
        public string Narration { get; set; }
        public Nullable<decimal> Cedit { get; set; }
        public Nullable<decimal> Balance { get; set; }
        [Display(Name = "Exp Code")]
        public string Exp_Code { get; set; }
        [Display(Name = "AP CODE")]
        public string Payable_Code { get; set; }
    }

    #endregion

    #region Cash Book
    public class CashBook_Result
    {
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Date { get; set; }
        [Display(Name = "Receipt Ref")]
        public string Receipt_Ref { get; set; }
        [Display(Name = "Payment Ref")]
        public string Payment_Ref { get; set; }
        public string Description { get; set; }
        public string Received_Paid { get; set; }
        public Nullable<decimal> Credit { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public string Cust_Code { get; set; }
        public string Payable_Code { get; set; }
        public string Account { get; set; }
    }

    #endregion

    #region Bank Statement 
    //public class Bank_Statement_Result
    //{
    //    [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
    //    public Nullable<System.DateTime> Date { get; set; }
    //    public string Receipt_Ref { get; set; }
    //    public string Payment_Ref { get; set; }
    //    public string Description { get; set; }
    //    public string Received_Paid { get; set; }
    //    public Nullable<decimal> Credit { get; set; }
    //    public Nullable<decimal> Debit { get; set; }
    //    public Nullable<decimal> Balance { get; set; }
    //    public string Cust_Code { get; set; }
    //    public string Payable_Code { get; set; }
    //    public string Account { get; set; }
    //}
    #endregion






    #region Login / Forgot Password / Change Password
    public class mvcLoginViewModel
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
    public class mvcForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class mvcChangePasswordViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    #endregion

    #region User With Role
    public class mvcUserWithRoleViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Roles { get; set; }
        public string EmailConfirmed { get; set; }
    }
    #endregion

    #region Create New User
    public class mvcUserViewModel
    {
        //[Required]
        //[Display(Name = "First Name")]
        //public string FirstName { get; set; }
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        public string RoleID { get; set; }
    }

    #endregion

    #region Assign Role

    public class mvcUserRoleViewModel
    {
        public string RoleID { get; set; }
        public string RoleName { get; set; }
        public bool IsSelected { get; set; }

    }

    #endregion








    public class CashReceiveable_Result
    {
        public string Receipt_Ref { get; set; }
        [Display(Name = "Receive Date")]
        [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy}", ApplyFormatInEditMode = true)]
        public Nullable<System.DateTime> Date { get; set; }
        [Display(Name = "Receive From")]
        public string Received_Paid { get; set; }
        [Display(Name = "Description")]
        public string Narration { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> Balance { get; set; }
        [Display(Name = "AR CODE")]
        public string Cust_Code { get; set; }
    }



}