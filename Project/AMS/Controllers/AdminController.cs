using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using AMS.Models;

using Microsoft.AspNet.Identity.EntityFramework;
using System.Net.Mail;
using System.Configuration;
using System.Net.Mime;
using System.Data.Entity;
using System.Collections.Generic;

namespace AMS.Controllers
{
    [Authorize(Roles ="Admin")]
    public class AdminController : Controller
    {
        ApplicationDbContext context = new ApplicationDbContext();

        #region Create Users

        public ActionResult CreateUser()
        {
            return View();
        }

        public async Task<ActionResult> AddOrEdit(mvcUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                ModelState.Clear();
                return View();
            }
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            //var userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            userManager.UserValidator = new UserValidator<ApplicationUser>(userManager)
            {
                RequireUniqueEmail = true,
                AllowOnlyAlphanumericUserNames = false,
            };
            userManager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };

            userManager.UserLockoutEnabledByDefault = true;
            userManager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            userManager.MaxFailedAccessAttemptsBeforeLockout = 5;

            //userManager.RegisterTwoFactorProvider("Phone Code", new PhoneNumberTokenProvider<ApplicationUser>
            //{
            //    MessageFormat = "Your security code is {0}"
            //});
            //userManager.RegisterTwoFactorProvider("Email Code", new EmailTokenProvider<ApplicationUser>
            //{
            //    Subject = "Security Code",
            //    BodyFormat = "Your security code is {0}"
            //});

            //userManager.EmailService = new EmailService();
            //userManager.SmsService = new SmsService();

            //var dataProtectionProvider = new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("MyTestApplication");
            //userManager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("UserToken"))
            //{
            //    TokenLifespan = TimeSpan.FromDays(7)
            //};

            ApplicationUser find = await userManager.FindByEmailAsync(model.Email);

            if (find == null)
            {
                //create Default User
                var user = new ApplicationUser();
                user.FirstName = model.Username;
                user.LastName = model.Username;
                user.Email = model.Email;
                user.PhoneNumber = model.PhoneNumber;
                user.EmailConfirmed = true;
                user.UserName = model.Username;
                string pwdUser = model.Password;

                var result = await userManager.CreateAsync(user, pwdUser);
                if (result.Succeeded)
                {
                    //string code = await userManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);

                    //string subject = "Confirm your account";
                    //string body = "";
                    //body += " <html>";
                    //body += "<body>";
                    //body += "<div class='container' style='padding: 20px'><div class='col-xs-12 col-sm-3'><div class='col-xs-12 col-sm-3'></div>";
                    //body += "<div class='col-xs-12 col-sm-3'><div style='box-shadow: 1px 1px 5px 1px grey;'>";
                    //body += "<div style='margin-bottom: 10px; background: #bacee8; padding: 20px; text-align: center; text-transform: uppercase;'>";
                    //body += "<h1 style='color: #ff6d05e3; font-size: 36pt; font-family: fantasy; margin-top: 0px; margin-bottom: 0px;'>Horizon <span style='color: #cc5d33;'>Travel</span></h1>";
                    //body += "</div><hr /><div style='padding: 0px 20px 30px 20px'><p> <label style='font-weight: bolder'>Dear User, </label></p>";
                    //body += "<p>Please click the below link to Confirm your account</p>";
                    //body += "<p><a href='" + callbackUrl + "' style='background-color: #1c56b2; color: #e8e8e8; font-weight: 600; padding: 10px; border-radius: 5px; line-height: 40px; text-decoration: none'>Confirm Account</a></p>";
                    //body += "<div class='row' style='margin-top: 50px;margin-bottom:30px;'>";
                    //body += "<div class='col-sm-6'>Username:<label style='font-weight: bolder'>" + user.UserName + "</label></div>";
                    //body += "<div class='col-sm-6'>Password:<label style='font-weight: bolder'>" + model.Password + "</label></div></div>";
                    //body += "<strong>Note: This is an automatic generated email and requires no reply.</strong>";
                    //body += "<div style='font-weight: bolder; color: #626262;'><br><br>";
                    //body += "<h3><p>Regards,</p><p>Horizon Travel Team.</p></h3>";
                    //body += "</div></div></div></div>";
                    //body += "<div class='col-xs-12 col-sm-3'></div>";
                    //body += "</div>";
                    //body += "</body>";
                    //body += "</html>";

                    //await userManager.SendEmailAsync(user.Id, subject, body);

                    return Json(new { userid = user.Id, success = true, message = "User Created Successfully" }, JsonRequestBehavior.AllowGet);
                    //create super user role
                    //var userRole = new IdentityRole("User");
                    //roleManager.Create(userRole);
                }
                else
                    return Json(new { success = false, message = result.Errors }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //Update Default User

                find.LastName = model.Username;
                find.UserName = model.Username;
                find.Email = model.Email;

                //var result = userManager.Update(find);
                var result = await userManager.UpdateAsync(find);
                if (result.Succeeded)
                {
                    //string code = await userManager.GenerateEmailConfirmationTokenAsync(find.Id);
                    //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = find.Id, code = code }, protocol: Request.Url.Scheme);
                    //await userManager.SendEmailAsync(find.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return Json(new { userid = find.Id, success = true, message = "User Created Successfully" }, JsonRequestBehavior.AllowGet);
                    //create super user role
                    //var userRole = new IdentityRole("User");
                    //roleManager.Create(userRole);
                }
                else
                    return Json(new { success = false, message = result.Errors }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AllUsers()
        {
            //var roles = context.Users.ToList();
            var userList = (from user in context.Users
                            select new
                            {
                                UserId = user.Id,
                                Username = user.UserName,
                                user.Email,
                                user.EmailConfirmed,
                                RoleNames = (from userRole in user.Roles //[AspNetUserRoles]
                                             join role in context.Roles //[AspNetRoles]//
                                             on userRole.RoleId
                                             equals role.Id
                                             select role.Name).ToList()
                            }).ToList();

            var userListVm = userList.Select(p => new mvcUserWithRoleViewModel
            {
                UserId = p.UserId,
                UserName = p.Username,
                Email = p.Email,
                Roles = string.Join(" , ", p.RoleNames),
                EmailConfirmed = p.EmailConfirmed.ToString()
            }).ToList();

            return View(userListVm);
        }

        public ActionResult DeleteDataByID(string id)
        {
            var r = context.Users.Where(x => x.Id == id).FirstOrDefault();
            try
            {
                context.Entry(r).State = EntityState.Deleted;
                context.SaveChanges();
                return Json(new { success = true, Delete = "Delete", message = "User Deleted Successfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetDataById(string id)
        {
            var r = context.Users.Where(x => x.Id == id).FirstOrDefault();
            return Json(new { success = true, r }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        public ActionResult CreateRole(FormCollection form)
        {
            ApplicationDbContext context = new ApplicationDbContext();

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            if (!roleManager.RoleExists("Admin"))
            {
                //create super admin role
                var adminRole = new IdentityRole("Admin");
                roleManager.Create(adminRole);
            }

            return View();
        }
        [HttpGet]
        public ActionResult AssignRole(string id)
        {
            if (id == null)
            {
                return RedirectToAction("CreateUser");
            }
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            ViewBag.UserID = id;

            var user = userManager.FindById(id);
            ViewBag.user = user;
            if (user == null)
            {
                ViewBag.TopTitle = "No Found";
                ViewBag.Title = $"User Not Found In Database";
                ViewBag.SubTitle = $"User with Id = {id} connot be found";
                return View("_NotFound");
            }

            var model = new List<mvcUserRoleViewModel>();
            var role = roleManager.Roles.OrderBy(x=>x.Id).ToList();
            for (int i = 0; i < role.Count; i++)
            {
                var mvcUserRoleViewModel = new mvcUserRoleViewModel
                {
                    RoleID = role[i].Id,
                    RoleName = role[i].Name
                };

                if (userManager.IsInRole(id, role[i].Name))
                {
                    mvcUserRoleViewModel.IsSelected = true;
                }
                else
                {
                    mvcUserRoleViewModel.IsSelected = false;
                }
                model.Add(mvcUserRoleViewModel);
            }

            return View(model);
        }
        [HttpPost]
        public ActionResult AssignRole(string UserID, string[] InvNo, string[] roleName)
        {

            var user = context.Users.Where(x => x.Id == UserID).FirstOrDefault();
            if (user == null)
            {
                return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
            }
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            for (int i = 0; i < InvNo.Length; i++)
            {
                if (!userManager.IsInRole(user.Id, roleName[i]))
                {
                    var result = userManager.AddToRole(user.Id, roleName[i]);
                }
            }
            return Json(new { success = true, message = "Role Assigned successfully" }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult RemoveRoleOfEmployee(string roleName, string userid)
        {
            ApplicationDbContext context = new ApplicationDbContext();

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            if (userid != null)
            {
                ApplicationUser user = userManager.FindById(userid);
                if (user == null)
                {
                    ViewBag.ErrorMessage = $"User with Id = {userid} cannot be found";
                    return View("_NotFound");
                }
                else
                {

                    var result = userManager.RemoveFromRoles(user.Id, roleName);
                    if (result.Succeeded)
                    {
                        return Json(new { success = true, message = "Removed successfully" }, JsonRequestBehavior.AllowGet);
                    }
                }

            }

            return View();
        }

    }


    public class EmailService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            // Plug in your email service here to send an email.
            //return Task.FromResult(0);

            return Task.Factory.StartNew(() =>
            {
                sendMail(message);
            });
        }

        void sendMail(IdentityMessage message)
        {
            #region formatter
            string text = string.Format("Please click on this link to {0}: {1}", message.Subject, message.Body);
            string html = "Please confirm your account by clicking this link: <a href=\"" + message.Body + "\">link</a><br/>";

            html += HttpUtility.HtmlEncode(@"Or click on the copy the following link on the browser:" + message.Body);
            string html2 = message.Body;
            #endregion

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress(ConfigurationManager.AppSettings["Email"].ToString());
            msg.To.Add(new MailAddress(message.Destination));
            msg.Subject = message.Subject;
            //msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html2, null, MediaTypeNames.Text.Html));
            msg.IsBodyHtml = true;

            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587));
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("mohammad.asif@nu.edu.pk",
               "Asif123321");
            smtpClient.Credentials = credentials;
            smtpClient.EnableSsl = true;
            smtpClient.Send(msg);
        }
    }

    public class SmsService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }


}