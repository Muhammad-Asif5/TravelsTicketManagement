using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using AMS.Models;
using AMS.App_Start;

namespace AMS.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        #region Helping

        
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        #endregion

        #region Login
        
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            //if (User.Identity.IsAuthenticated == true)
            //{
            //    return RedirectToLocal(returnUrl);
            //}
            //ViewBag.ReturnUrl = returnUrl;
            //return View();

            if (User.Identity.IsAuthenticated)
            {
                //if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                //    && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                //{
                //    return RedirectToLocal(returnUrl);
                //}
                //else
                    return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(mvcLoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
           
            //if (model.Username.Contains("@"))
            //{
            //    using (var context = new ApplicationDbContext())
            //    {
            //        model.Username = (context.Users.Any(p => p.Email == model.Username)) ?
            //          context.Users.SingleOrDefault(p => p.Email == model.Username).UserName :
            //          model.Username;
            //    }
            //}
            var userName = model.Username;
            using (var context = new ApplicationDbContext())
            {
                var user = context.Users.FirstOrDefault(p => p.Email == model.Username);
                if (user != null)
                {
                    userName = user.UserName;
                }
            }

            var Checkuser = await UserManager.FindByNameAsync(userName);

            if (Checkuser == null)
            {
                ModelState.AddModelError("", "Username is invalid");
                return View(model);
                // Don't reveal that the user does not exist or is not confirmed
                //return View("ForgotPasswordConfirmation");
            }
            //if (!(UserManager.IsEmailConfirmed(Checkuser.Id)))
            //{
            //    // Don't reveal that the user does not exist or is not confirmed
            //    ModelState.AddModelError("", "Please confirm email first");
            //    return View(model);
            //}
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true

            //var result = await SignInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, shouldLockout: true);
            var result = await SignInManager.PasswordSignInAsync(userName, model.Password, model.RememberMe, shouldLockout: true);
            switch (result)
            {
                case SignInStatus.Success:
                    ApplicationUser user = UserManager.Find(userName, model.Password);
                    Session["user"] = user;
                    if (UserManager.IsInRole(user.Id, "Admin"))
                    {
                        return RedirectToLocal(returnUrl);
                    }
                    else
                    return RedirectToAction("", "dashboard");
                case SignInStatus.LockedOut:
                    ModelState.AddModelError("", "Account has been locked for 5 minuts");
                    return View(model);
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
                    
                    //case SignInStatus.Success:
                    //    return RedirectToLocal(returnUrl);
                    //case SignInStatus.LockedOut:
                    //    return View("Lockout");
                    //case SignInStatus.RequiresVerification:
                    //    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                    //case SignInStatus.Failure:
                    //default:
                    //    ModelState.AddModelError("", "Invalid login attempt.");
                    //    return View(model);
            }
        }

        #endregion

        #region Forgot Password

        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(mvcForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);
                //if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                //{
                //    // Don't reveal that the user does not exist or is not confirmed
                //    return View("ForgotPasswordConfirmation");
                //}
                if (user == null)
                {
                    ViewBag.TopTitle = "Un Authorized";
                    ViewBag.Title = "You are not authorized to reset password";
                    ViewBag.SubTitle = "Please Contact Web Administrator";
                    return View("_NotFound");
                }
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    ViewBag.Title = "Please Confirm Your Email First";
                    ViewBag.TopTitle = "Confirmation";
                    ViewBag.SubTitle = "Please Check Your Email and Confirm Account";
                    return View("_NotFound");
                }
                if ((await UserManager.IsLockedOutAsync(user.Id)))
                {
                    ViewBag.Title = "Your Account has been locked for 5 minuts";
                    return View("_NotFound");
                }
                ViewBag.Email = model.Email;
                // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                
                string subject = "Reset Password";
                string body="";
                body += " <html>";
                body += "<body>";
                body += "<p><label style='font-weight:bolder'>Dear User, </label></p>";
                body += "<p>Please click the below link to reset your password</p>";
                //mail.Body += "";
                body += "<p><a href='" + callbackUrl + "' style='background-color:#1c56b2; color:#e8e8e8; font-weight:600; padding:10px; border-radius:5px; line-height:40px; text-decoration:none'>Reset Password</a></p>";
                body += "<strong>Note: This is an automatic generated email and requires no reply.</strong>";
                body += "<div style='font-weight:bolder; color: #626262;'>";
                body += "<br><br><h3><p>Regards,</p>";
                body += "<p>IT HelpDesk Team.</p></h3>";

                body += "</div>";
                body += "</body>";
                body += "</html>";


                try
                {
                    await UserManager.SendEmailAsync(user.Id, subject, body);
                }
                catch (Exception e)
                {
                    ViewBag.Title = "general";
                    ViewBag.SubTitle = e.Message;
                    return View("_Error");
                }
                ViewBag.Title = "Reset link has been sent to your email";
                ViewBag.SubTitle = "Please Check Your Email and follow the steps";
                return View("_Success");

            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }


        #endregion

        #region rest passwrod

        [AllowAnonymous]
        public ActionResult ResetPassword(string code, string userId)
        {
            return code == null ? View("_NotFound") : View();
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await UserManager.FindByIdAsync(model.userId);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                ModelState.AddModelError("", "User does not exist");
                return View(model);
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                if (await UserManager.IsLockedOutAsync(user.Id))
                {
                    await UserManager.SetLockoutEndDateAsync(user.Id, DateTimeOffset.UtcNow);
                }
                ViewBag.Title = "Your password has been reset";
                ViewBag.SubTitle = "Go back to login";
                return View("_Success");
            }
            AddErrors(result);
            return View();
        }

        #endregion

        #region Change Password
        public ActionResult ChangePassword()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangePassword(mvcChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var name = await UserManager.FindByNameAsync(User.Identity.Name);
            //var user = await UserManager.FindByNameAsync(model.Email);
            if (name == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ChangePasswordAsync(name.Id, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Json(new { success = true, message = "Password Changed Successfully" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = false, message = result.Errors }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("_Error");
            }
            var check = UserManager.FindById(userId);
            if (check == null)
            {
                ViewBag.Title = "The User ID is invalid";
                return View("_NotFound");
            }
            else
            {
                var result = await UserManager.ConfirmEmailAsync(userId, code);
                return View(result.Succeeded ? "ConfirmEmail" : "general");
            }            
        }
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        // POST: /Account/LogOff
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Login", "Account");
        }


        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("general");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }   
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }


        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("general");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("general");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("", "dashboard");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}