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
    [RoutePrefix("IStream")]
    public class IStreamController : Controller
    {
        // GET: IStream
        Entities con = new Entities();

        #region Agent
        [Route("~/all-income")]
        [Authorize(Roles = "Admin, Add New Stream")]
        public ActionResult IStream()
        {
            return View();
        }
        [Authorize(Roles = "Admin, Add New Stream, Update Record")]
        public ActionResult AddOrEdit(mvcModelIncome_Stream model)
        {
            
            if (!ModelState.IsValid==true)
            {
                var id = con.Income_Stream.ToList();
                if (id.Count>0)
                {
                    string rMaxID = con.Income_Stream.Select(x => x.Stream_ID).Max(); // 01
                    int no = int.Parse(rMaxID);//01
                    no++;
                    string MaxSO = string.Format("{0:00}", no);

                    ViewBag.NextID = MaxSO;
                }
                else
                {
                    ViewBag.NextID = "01";
                }
                ModelState.Clear();
                return View(model);
            }
            else
            {
                var check = con.Income_Stream.Where(x => x.Stream_ID == model.Stream_ID).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    Income_Stream obj = new Income_Stream
                    {
                        Stream_ID = model.Stream_ID,
                        Stream_Name = model.Stream_Name,
                        Stream_Status = model.Stream_Status
                    };

                    try
                    {
                        con.Income_Stream.Add(obj);
                        con.SaveChanges();
                        string Nextid = obj.Stream_ID;
                        int no = int.Parse(Nextid);//01
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
                        check.Stream_Name = model.Stream_Name;
                        check.Stream_Status = model.Stream_Status;

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
        [Authorize(Roles = "Admin, Add New Stream")]
        public ActionResult AllIStream()
        {
            var r = (from q in con.Income_Stream
                     select new mvcModelIncome_Stream
                     {
                         Stream_ID = q.Stream_ID,
                         Stream_Name = q.Stream_Name,
                         Stream_Status = q.Stream_Status
                     }).ToList();
            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(string id)
        {
            con.Configuration.ProxyCreationEnabled = false;
            var check = (from q in con.Income_Stream
                         where q.Stream_ID == id
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

            var r = (from q in con.Income_Stream
                     where q.Stream_ID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var Pid = con.Income_Stream.ToList();
                    string NextID = string.Empty;

                    if (Pid.Count > 0)
                    {
                        string rMaxID = con.Income_Stream.Select(x => x.Stream_ID).Max(); // 01
                        int no = int.Parse(rMaxID);//01
                        no++;
                        string MaxSO = string.Format("{0:00}", no);

                        NextID = MaxSO;
                    }
                    else
                    {
                       NextID = "01";
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