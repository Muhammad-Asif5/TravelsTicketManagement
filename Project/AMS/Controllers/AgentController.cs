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
    [RoutePrefix("Agent")]
    public class AgentController : Controller
    {
        // GET: Agent
        Entities con = new Entities();

        #region Agent
        [Route("~/all-agent")]
        [Authorize(Roles = "Admin, Add New Agent")]
        public ActionResult Agent()
        {
            return View();
        }


        [Authorize(Roles = "Admin, Add New Agent, Update Record")]
        public ActionResult AddOrEdit(Agent model)
        {
            List<Agent> listCampus = con.Agents.ToList();

            if (model.Agent_ID == 0)
            {
                var progID = con.Agents.Select(x => x.Agent_ID).Max();
                progID++;

                ViewBag.NextID = progID;
                return View();
            }
            else
            {
                var check = con.Agents.Where(x => x.Agent_ID == model.Agent_ID).FirstOrDefault();
                if (check == null)
                {
                    //add here
                    Agent obj = new Agent
                    {
                        Agent_ID = model.Agent_ID,
                        Agent_Name = model.Agent_Name,
                        Agent_Status=model.Agent_Status
                    };

                    try
                    {
                        con.Agents.Add(obj);
                        con.SaveChanges();
                        int NextID = obj.Agent_ID;
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
                        check.Agent_Name = model.Agent_Name;
                        check.Agent_Status = model.Agent_Status;

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
        [Authorize(Roles = "Admin, Add New Agent")]
        public ActionResult AllAgent()
        {
            var r = con.Agents.ToList();
            return View(r);

        }
        [Authorize(Roles = "Admin, Update Record")]
        public ActionResult GetDataById(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;
            var check = (from q in con.Agents
                         where q.Agent_ID == id
                         select q).ToList();
            if (check.Count > 0)
            {
                return Json(new { check, success=true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false, message = "No Data Found" }, JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Admin, Delete Record")]
        public ActionResult DeleteDataByID(int id)
        {
            con.Configuration.ProxyCreationEnabled = false;

            var r = (from q in con.Agents
                     where q.Agent_ID == id
                     select q).FirstOrDefault();
            if (r != null)
            {
                try
                {
                    con.Entry(r).State = EntityState.Deleted;
                    con.SaveChanges();
                    var NextID = con.Agents.Select(x => x.Agent_ID).Max();
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