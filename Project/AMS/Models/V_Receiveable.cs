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
    
    public partial class V_Receiveable
    {
        public int Invoice_Number { get; set; }
        public Nullable<System.DateTime> Invoice_Date { get; set; }
        public string Ticket_Number { get; set; }
        public string Description { get; set; }
        public string Routing { get; set; }
        public Nullable<decimal> Invoice_Amount { get; set; }
        public Nullable<decimal> Paid { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public string Cust_Code { get; set; }
        public string Company_Name { get; set; }
        public string Contact_Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int Cust_ID { get; set; }
        public string ReceivePay_Status { get; set; }
    }
}
