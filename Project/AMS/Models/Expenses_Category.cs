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
    
    public partial class Expenses_Category
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Expenses_Category()
        {
            this.AirLines = new HashSet<AirLine>();
            this.DailyExpenses = new HashSet<DailyExpens>();
        }
    
        public int CategoryId { get; set; }
        public string Payable_Code { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AirLine> AirLines { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DailyExpens> DailyExpenses { get; set; }
    }
}