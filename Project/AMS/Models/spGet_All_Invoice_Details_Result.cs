//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AMS.Models
{
    using System;
    
    public partial class spGet_All_Invoice_Details_Result
    {
        public string ReceivePay_Status { get; set; }
        public int Invoice_Number { get; set; }
        public string Ticket_Status { get; set; }
        public Nullable<System.DateTime> Invoice_Date { get; set; }
        public string Ticket_Number { get; set; }
        public string Description { get; set; }
        public string Routing { get; set; }
        public Nullable<System.DateTime> Departure_Date { get; set; }
        public Nullable<System.DateTime> Arrival_Date { get; set; }
        public Nullable<decimal> Paid { get; set; }
        public Nullable<decimal> Invoice_Amount { get; set; }
        public Nullable<decimal> Base_Fare { get; set; }
        public Nullable<decimal> Tax { get; set; }
        public Nullable<decimal> Other_Cost { get; set; }
        public Nullable<decimal> Net_Payable { get; set; }
        public Nullable<decimal> Paid2 { get; set; }
        public string Other_Ref { get; set; }
        public string Cust_Code { get; set; }
        public string Payable_Code { get; set; }
        public string Payable_Supplier { get; set; }
        public string Agent_Name { get; set; }
        public Nullable<decimal> Ticket_Commission { get; set; }
        public Nullable<decimal> Commission_Amount { get; set; }
        public Nullable<decimal> VAT { get; set; }
        public Nullable<decimal> VAT_Amount { get; set; }
        public string Ticket_Class { get; set; }
        public string Pay_Status { get; set; }
        public Nullable<decimal> Customer_Penalty { get; set; }
        public Nullable<decimal> AirLine_Penalty { get; set; }
        public string User_Name { get; set; }
    }
}
