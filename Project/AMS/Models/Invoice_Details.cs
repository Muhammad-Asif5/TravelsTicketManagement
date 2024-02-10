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
    using System.Collections.Generic;
    
    public partial class Invoice_Details
    {
        public int Invoice_Number { get; set; }
        public Nullable<System.DateTime> Invoice_Date { get; set; }
        public string Ticket_Number { get; set; }
        public string Description { get; set; }
        public string Routing { get; set; }
        public Nullable<System.DateTime> Departure_Date { get; set; }
        public Nullable<System.DateTime> Arrival_Date { get; set; }
        public Nullable<decimal> Paid { get; set; }
        public Nullable<decimal> Invoice_Amount { get; set; }
        public Nullable<decimal> Base_Fare { get; set; }
        public Nullable<decimal> Total_Value { get; set; }
        public Nullable<decimal> Tax { get; set; }
        public Nullable<decimal> Other_Cost { get; set; }
        public string Stream_ID { get; set; }
        public Nullable<decimal> Net_Payable { get; set; }
        public Nullable<decimal> Paid2 { get; set; }
        public string Other_Ref { get; set; }
        public Nullable<int> Cust_Code { get; set; }
        public string Payable_Code { get; set; }
        public Nullable<int> Agent_ID { get; set; }
        public Nullable<decimal> Ticket_Commission { get; set; }
        public Nullable<decimal> Commission_Amount { get; set; }
        public Nullable<decimal> VAT { get; set; }
        public Nullable<decimal> VAT_Amount { get; set; }
        public Nullable<int> TicketClass_ID { get; set; }
        public string Pay_Status { get; set; }
        public string ReceivePay_Status { get; set; }
        public string Ticket_Status { get; set; }
        public Nullable<decimal> Customer_Penalty { get; set; }
        public Nullable<decimal> AirLine_Penalty { get; set; }
        public string User_Name { get; set; }
    
        public virtual Agent Agent { get; set; }
        public virtual AirLine AirLine { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual Income_Stream Income_Stream { get; set; }
        public virtual TicketClass TicketClass { get; set; }
    }
}