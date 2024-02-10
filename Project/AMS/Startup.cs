using AMS.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;

using AMS.App_Start;

[assembly: OwinStartup(typeof(AMS.Startup))]

namespace AMS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateUserAndRoles();
        }
        public void CreateUserAndRoles()
        {
            ApplicationDbContext context = new ApplicationDbContext();
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            if (!roleManager.RoleExists("Admin"))
            {
                //create Default User
                var adminUser = new ApplicationUser();
                adminUser.FirstName = "Muhammad";
                adminUser.LastName = "Asif";
                adminUser.Email = "mohammad.asif@nu.edu.pk";
                adminUser.UserName = "m.asif";
                adminUser.PhoneNumber = "+923475414625";
                string pwdAdmin = "Asif@123";
                var newAdminUser = userManager.Create(adminUser, pwdAdmin);

                if (newAdminUser.Succeeded)
                {
                    //create super admin role
                    var adminRole = new IdentityRole("Admin");
                    roleManager.Create(adminRole);

                    userManager.AddToRole(adminUser.Id, "Admin");
                }
            }
            if (!roleManager.RoleExists("Add New Bank"))
            {
                var adminRole = new IdentityRole("Add New Bank");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New Record"))
            {
                var adminRole = new IdentityRole("Add New Record");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Update Record"))
            {
                var adminRole = new IdentityRole("Update Record");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Delete Record"))
            {
                var adminRole = new IdentityRole("Delete Record");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New Customer"))
            {
                var adminRole = new IdentityRole("Add New Customer");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New AP"))
            {
                var adminRole = new IdentityRole("Add New AP");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New EXP"))
            {
                var adminRole = new IdentityRole("Add New EXP");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New Agent"))
            {
                var adminRole = new IdentityRole("Add New Agent");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add New Stream"))
            {
                var adminRole = new IdentityRole("Add New Stream");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Admin Invoice Generate"))
            {
                var adminRole = new IdentityRole("Admin Invoice Generate");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Admin Confirm Invoice"))
            {
                var adminRole = new IdentityRole("Admin Confirm Invoice");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Admin Confirm Pay"))
            {
                var adminRole = new IdentityRole("Admin Confirm Pay");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Admin Refund"))
            {
                var adminRole = new IdentityRole("Admin Refund");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Generate AR Receipt"))
            {
                var adminRole = new IdentityRole("Generate AR Receipt");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Generate AP-EXP Receipt"))
            {
                var adminRole = new IdentityRole("Generate AP-EXP Receipt");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add Bank Receiveable"))
            {
                var adminRole = new IdentityRole("Add Bank Receiveable");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Add Bank Payable"))
            {
                var adminRole = new IdentityRole("Add Bank Payable");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Invoice Details"))
            {
                var adminRole = new IdentityRole("View Invoice Details");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Unpaid Invoice"))
            {
                var adminRole = new IdentityRole("View Unpaid Invoice");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Cash Book"))
            {
                var adminRole = new IdentityRole("View Cash Book");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Receiveable"))
            {
                var adminRole = new IdentityRole("View Receiveable");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Payable"))
            {
                var adminRole = new IdentityRole("View Payable");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Bank Statement"))
            {
                var adminRole = new IdentityRole("View Bank Statement");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View Profit Statement"))
            {
                var adminRole = new IdentityRole("View Profit Statement");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View AR Summary"))
            {
                var adminRole = new IdentityRole("View AR Summary");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("View AP Summary"))
            {
                var adminRole = new IdentityRole("View AP Summary");
                roleManager.Create(adminRole);
            }


        }
    }
}
