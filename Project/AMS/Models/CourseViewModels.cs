using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AMS.Models
{
    public class CourseViewModels
    {
        [Display(Name = "Invoice Number")]
        public string Invoice_Number { get; set; }
        [Display(Name = "Invoice Date")]
        public string Invoice_Date { get; set; }
        public string Ticket_Number { get; set; }
        public string Description { get; set; }
        public string Routing { get; set; }
        public string Departure { get; set; }
        public string Arrival { get; set; }
        public string Paid_Amount { get; set; }
        public string Base_Fare { get; set; }
        public string Tax { get; set; }
        public string Other_Cost { get; set; }
        public string Payable_Code { get; set; }
        public string Ticket_Status { get; set; }
        public string Cust_Code { get; set; }
        public int Agent_ID { get; set; }
        public Nullable<System.DateTime> Created_Date { get; set; }
        public string User_id { get; set; }
    }
}