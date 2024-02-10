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
    [RoutePrefix("Bank")]
    public class BankController : Controller
    {
        // GET: Agent
        Entities con = new Entities();

        #region Agent
        [Route("~/all-bank")]
        [Authorize(Roles = "Admin, Add New Bank")]
        public ActionResult Bank()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Add New Bank, Update Record")]
        public ActionResult AddOrEdit(Bank model)
        {
            if (model.Bank_ID == 0)
            {
                var progID = con.Banks.Select(x => x.Bank_ID).Max();
                progID++;

                ViewBag.NextID = progID;
                return View();
            }
            else
            {
                var check = con.Banks.Where(x => x.Bank_ID == model.Bank_ID).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    Bank obj = new Bank
                    {
                        Bank_ID = model.Bank_ID,
                        Bank_Name = model.Bank_Name,
                        Status = model.Status
                    };

                    try
                    {
                        con.Banks.Add(obj);
                        con.SaveChanges();
                        int NextID = obj.Bank_ID;
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
                        check.Bank_Name = model.Bank_Name;
                        check.Status = model.Status;

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
        [Authorize(Roles = "Admin, Add New Bank")]
        public ActionResult AllBank()
        {
            var r = con.Banks.ToList();
            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;
            var check = (from q in con.Banks
                         where q.Bank_ID == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(new { check, success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false, message = "No Data Found" }, JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        public ActionResult DeleteDataByID(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.Banks
                     where q.Bank_ID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var NextID = con.Banks.Select(x => x.Bank_ID).Max();
                    NextID++;

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