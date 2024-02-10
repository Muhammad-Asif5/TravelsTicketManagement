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
    [RoutePrefix("AP")]
    public class APController : Controller
    {
        // GET: AP
        Entities con = new Entities();

        #region AP
        [Route("~/all-airline")]
        [Authorize(Roles = "Admin, Add New AP")]
        public ActionResult AP()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Add New AP, Update Record")]
        public ActionResult AddOrEdit(mvcModelAirLine model)
        {
            List<AirLine> listCampus = con.AirLines.ToList();
            if (!ModelState.IsValid == true)
            {
                var id = con.AirLines.ToList();
                if (id.Count > 0)
                {
                    string rMaxID = con.AirLines.Select(x => x.Air_ID).Max(); // 01
                    int no = int.Parse(rMaxID);//01
                    no++;
                    string MaxSO = string.Format("{0:00}", no);

                    ViewBag.NextID = MaxSO;
                }
                else
                {
                    ViewBag.NextID = "20";
                }
                ModelState.Clear();
                return View(model);
            }
            else
            {
                //ViewBag.NextID = "01";
                var check = con.AirLines.Where(x => x.Air_ID == model.Air_ID).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    AirLine obj = new AirLine
                    {
                        Air_ID = model.Air_ID,
                        Payable_Code = model.Payable_Code,
                        Payable_Supplier = model.Payable_Supplier,
                        Ticket_Commission = model.Ticket_Commission,
                        VAT = model.VAT,
                        Cat_ID = 1
                    };

                    try
                    {
                        con.AirLines.Add(obj);
                        con.SaveChanges();
                        var NextId = obj.Air_ID;
                        int no = int.Parse(NextId);//01
                        no++;
                        string NextID = string.Format("{0:00}", no);

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
                        check.Payable_Supplier = model.Payable_Supplier;
                        check.Ticket_Commission = model.Ticket_Commission;
                        check.VAT = model.VAT;
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
        [Authorize(Roles = "Admin, Add New AP")]
        public ActionResult AllAP()
        {
            //var r = con.AirLines.ToList();
            var r = (from q in con.AirLines
                     select new mvcModelAirLine
                     {
                         Air_ID = q.Air_ID,
                         Payable_Code = q.Payable_Code,
                         Payable_Supplier = q.Payable_Supplier,
                         Cat_ID = q.Cat_ID,
                         Ticket_Commission=q.Ticket_Commission,
                         VAT=q.VAT
                     }).ToList();

            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(string id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var check = (from q in con.AirLines
                         where q.Air_ID == id
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

            var r = (from q in con.AirLines
                     where q.Air_ID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var NextId = con.AirLines.Select(x => x.Air_ID).Max();
                    string NextID;
                    if (NextId != null)
                    {
                        //string rMaxID = con.AirLines.Select(x => x.Air_ID).Max(); // 01
                        int no = int.Parse(NextId);//01
                        no++;
                        NextID = string.Format("{0:00}", no);
                    }
                    else
                    {
                        NextID = "20";
                    }

                    //int no = int.Parse(NextId);//01
                    //no++;
                    //string NextID = string.Format("{0:00}", no);

                    return Json(new { Delete = "Delete", NextID, success = true, message = "Deleted successfully", JsonRequestBehavior.AllowGet });
                }
                catch (Exception)
                {
                    return Json(new { Delete = "NO", success = true, message = "Please remove All their data first", JsonRequestBehavior.AllowGet });
                }
            }
            return Json(new { success = false, message = "Error", JsonRequestBehavior.AllowGet });
        }

        #endregion 
    }
}