<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AMS.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <link href="Content/bootstrap.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div class="container" style="padding: 20px">
            <div class="col-xs-12 col-sm-3"></div>
            <div class="col-xs-12 col-sm-6">

                <div style='box-shadow: 1px 1px 5px 1px grey;'>
                    <div style='margin-bottom: 10px; background: #bacee8; padding: 20px; text-align: center; text-transform: uppercase;'>
                        <h1 style='color: #ff6d05e3; font-size: 36pt; font-family: fantasy; margin-top: 0px; margin-bottom: 0px;'>Horizon <span style='color: #cc5d33;'>Travel</span></h1>
                    </div>
                    <hr />
                    <div style='padding: 0px 20px 30px 20px'>
                        <p> <label style='font-weight: bolder'>Dear User, </label></p>
                        <p>Please click the below link to Confirm your account</p>
                        <p><a href='' style='background-color: #1c56b2; color: #e8e8e8; font-weight: 600; padding: 10px; border-radius: 5px; line-height: 40px; text-decoration: none'>Confirm Account</a></p>
                        <div class='row' style='margin-top: 50px;margin-bottom:30px;'>
                            <div class='col-sm-6'>Username:<label style='font-weight: bolder'>m.asif</label></div>
                            <div class='col-sm-6'>Password:<label style='font-weight: bolder'>Asif@123</label></div>
                        </div>
                        <strong>Note: This is an automatic generated email and requires no reply.</strong>
                        <div style='font-weight: bolder; color: #626262;'><br><br>
                            <h3><p>Regards,</p><p>Horizon Travel Team.</p></h3>
                        </div></div></div></div>
            <div class="col-xs-12 col-sm-3"></div>

        </div>
    </form>
</body>
</html>
