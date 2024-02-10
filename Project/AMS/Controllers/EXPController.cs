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
    [RoutePrefix("EXP")]
    public class EXPController : Controller
    {
        // GET: EXP        
        Entities con = new Entities();

        #region EXP
        [Route("~/all-expenses")]
        [Authorize(Roles = "Admin, Add New EXP")]
        public ActionResult EXP()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Add New EXP, Update Record")]
        public ActionResult AddOrEdit(mvcModelDailyExpens model)
        {
            //List<mvcModelDailyExpens> listCampus = con.DailyExpenses.ToList();
            if (!ModelState.IsValid == true)
            {
                var id = con.DailyExpenses.ToList();
                if (id.Count > 0)
                {
                    string rMaxID = con.DailyExpenses.Select(x => x.Exp_Code).Max(); // 01
                    int no = int.Parse(rMaxID);//01
                    no++;
                    string MaxSO = string.Format("{0:000}", no);

                    ViewBag.NextID = MaxSO;
                }
                else
                {
                    ViewBag.NextID = "100";
                }
                ModelState.Clear();
                return View(model);
            }
            else
            {
                //ViewBag.NextID = "01";
                var check = con.DailyExpenses.Where(x => x.Exp_Code == model.Exp_Code).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    DailyExpens obj = new DailyExpens
                    {
                        Exp_Code = model.Exp_Code,
                        Account = model.Account,
                        Contact_Name = model.Contact_Name,
                        Cat_ID = 2
                    };

                    try
                    {
                        con.DailyExpenses.Add(obj);
                        con.SaveChanges();
                        var NextId = obj.Exp_Code;
                        int no = int.Parse(NextId);//01
                        no++;
                        string NextID = string.Format("{0:000}", no);

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
                        check.Account = model.Account;
                        check.Contact_Name = model.Contact_Name;
                        //check.Cat_ID = 1;

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
        [Authorize(Roles = "Admin, Add New EXP")]
        public ActionResult AllEXP()
        {
            var r = (from q in con.DailyExpenses
                     select new mvcModelDailyExpens
                     {
                         Exp_Code = q.Exp_Code,
                         Account = q.Account,
                         Contact_Name = q.Contact_Name,
                         Cat_ID = q.Cat_ID
                     }).ToList();
            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(string id)
        {
            con.Configuration.ProxyCreationEnabled = false;
            var check = (from q in con.DailyExpenses
                         where q.Exp_Code == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(check, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("No Data Found", JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        public ActionResult DeleteDataByID(string id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.DailyExpenses
                     where q.Exp_Code == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var Nextid = con.DailyExpenses.Select(x => x.Exp_Code).Max();
                    int NextID;
                    if (Nextid!=null)
                    {
                        NextID = Convert.ToInt32(Nextid);
                        NextID++;
                    }
                    else
                    {
                        NextID = 100;
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