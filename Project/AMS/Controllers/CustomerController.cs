using AMS.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMS.Controllers
{
    [Authorize]
    [RoutePrefix("Customer")]
    public class CustomerController : Controller
    {
        // GET: Customer

        #region Customer

        Entities con = new Entities();

        [Route("~/all-customer")]
        [Authorize(Roles = "Admin, Add New Customer")]
        public ActionResult Customer()
        {
            return View();
        }
        [Authorize(Roles = "Admin,Add New Customer, Add New Record, Update Record")]
        public ActionResult AddOrEdit(Customer model)
        {
            List<Customer> listCampus = con.Customers.ToList();
            ViewBag.Customers = new SelectList(listCampus, "Cust_ID", "Cust_Code");

            if (model.Cust_ID == 0)
            {
                var getallCust = con.Customers.Select(x => x.Cust_ID).ToList();
                int custID = 0;
                if (getallCust.Count > 0)
                {
                    custID = getallCust.Max();
                    custID++;
                }
                else
                {
                    custID = 1;
                }
                ViewBag.NextID = custID;
                return View();
            }
            else
            {
                var check = con.Customers.Where(x => x.Cust_ID == model.Cust_ID).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    Customer obj = new Customer
                    {
                        Cust_ID = model.Cust_ID,
                        Lookup = model.Lookup,
                        Cust_Code = model.Cust_Code,
                        Company_Name = model.Company_Name,
                        Contact_Name = model.Contact_Name,
                        Address = model.Address,
                        City = model.City,
                        State = model.State,
                        ZIP_Code = model.ZIP_Code,
                        Phone = model.Phone,
                        Email = model.Email,
                        Fax = model.Fax
                    };

                    try
                    {
                        con.Customers.Add(obj);
                        con.SaveChanges();
                        int NextID = obj.Cust_ID;
                        NextID++;
                        return Json(new { success = true, message = "Added", NextID }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {
                        return Json(new
                        {
                            Delete = "Exception",
                            success = false,
                            message = "Error " + ex.Message
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    //update here
                    try
                    {
                        check.Lookup = model.Lookup;
                        check.Cust_Code = model.Cust_Code;
                        check.Company_Name = model.Company_Name;
                        check.Contact_Name = model.Contact_Name;
                        check.Address = model.Address;
                        check.City = model.City;
                        check.State = model.State;
                        check.ZIP_Code = model.ZIP_Code;
                        check.Phone = model.Phone;
                        check.Email = model.Email;
                        check.Fax = model.Fax;

                        con.Entry(check).State = EntityState.Modified;
                        con.SaveChanges();
                        return Json(new
                        {
                            success = true,
                            message = "Updated successfully"
                        }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {
                        return Json(new
                        {
                            Delete = "Exception",
                            success = false,
                            message = "Error " + ex.Message
                        }, JsonRequestBehavior.AllowGet);
                    }


                }
            }
        }
        [Authorize(Roles = "Admin, Add New Customer")]
        public ActionResult AllCustomer()
        {
            var r = con.Customers.ToList();
            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var check = (from q in con.Customers
                         where q.Cust_ID == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(check, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("No Data Found", JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        public ActionResult DeleteDataByID(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.Customers
                     where q.Cust_ID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();

                    var getallCust = con.Customers.Select(x => x.Cust_ID).ToList();
                    int NextID = 0;
                    if (getallCust.Count > 0)
                    {
                        NextID = getallCust.Max();
                        NextID++;
                    }
                    else
                    {
                        NextID = 1;
                    }
                    return Json(new { Delete = "Delete", NextID, success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { success = false, message = "Error", JsonRequestBehavior.AllowGet });
        }

        #endregion  return View();
    }
}