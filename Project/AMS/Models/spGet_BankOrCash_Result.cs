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
    
    public partial class spGet_BankOrCash_Result
    {
        public Nullable<System.DateTime> Date { get; set; }
        public Nullable<int> Receipt_Ref { get; set; }
        public Nullable<int> Payment_Ref { get; set; }
        public string Narration { get; set; }
        public string Received_Paid { get; set; }
        public Nullable<decimal> Credit { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public string Cust_Code { get; set; }
        public string Payable_Code { get; set; }
        public string Account { get; set; }
    }
}