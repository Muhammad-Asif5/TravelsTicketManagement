$('.select2').select2({
    theme: 'bootstrap4'
});
function ViewReportData(id) {

    if (id != null) {

        var url = "CReceiptVoucher/CReceiptVoucher?InvNo=" + id;

        //var windowName = "Change Logo";

        var windowName = "_blank";
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        document.body.style.height = windowHeight + "px";
        //window.addEventListener("resize", setWindowHeight, false);
        newwindow = window.open(url, windowName, 'width=940,height=' + windowHeight + '');

        if (window.focus) { newwindow.focus() }

        return false;
    } else {
        alert(0);
    }
}
function ViewReportData1(id) {

    if (id != null) {

        var url = "http://localhost:1216/WebForm/Invoice.aspx?InvNo=" + id;

        //var windowName = "Change Logo";

        var windowName = "_blank";
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        document.body.style.height = windowHeight + "px";
        //window.addEventListener("resize", setWindowHeight, false);
        newwindow = window.open(url, windowName, 'width=940,height=' + windowHeight + '');

        if (window.focus) { newwindow.focus() }

        return false;
    } else {
        alert(0);
    }
}

function Calculate_AirLine_Penalty(val) {
    var BaseFare = $("#Base_Fare").val();
    var Tax = $("#Tax").val();
    var OtherCost = $("#Other_Cost").val();
    var AirLinePenalty = $("#AirLine_Penalty").val();
    var CustomerPenalty = $("#Customer_Penalty").val();
    if (val != "") {

        var InvoiceAmount = parseFloat(BaseFare) + parseFloat(Tax) + parseFloat(OtherCost);
        var TotalInvoiceAmount = parseFloat(InvoiceAmount) - parseFloat(AirLinePenalty) - parseFloat(CustomerPenalty);

        $("#Invoice_Amount").val(TotalInvoiceAmount.toFixed(2));
        var CommissionAmount = $("#Commission_Amount").val();

        var NetPayable = (parseFloat(BaseFare) + parseFloat(Tax) - parseFloat(AirLinePenalty) - parseFloat(CommissionAmount));
        $("#Net_Payable").val(NetPayable.toFixed(2));
    }

}
function changePayable_Code(val) {
    //alert(val);
    if (val != "") {

        $.ajax({
            type: "POST",
            url: "/InvoiceRefund/GetPayAbleCommission",
            data: { PCode: val },
            success: function (data) {

                $("#Ticket_Commission").val(data.Ticket_Commission);
                var CommissionAmount = (($("#Base_Fare").val() * (data.Ticket_Commission)) / 100);
                $("#Commission_Amount").val(CommissionAmount);
                $("#VAT").val(data.VAT);

                var VATAmount = CommissionAmount * (data.VAT / 100);
                $("#VAT_Amount").val(VATAmount.toFixed(2));

                var NetPayable = $("#Invoice_Amount").val() - $("#Other_Cost").val() - $("#VAT_Amount").val() - CommissionAmount;
                $("#Net_Payable").val(NetPayable.toFixed(2));

            }
        })
    }
}

function invoiceChange(val) {
    $("#Invoice_Number").val(0);
    if (val != "") {
        $.ajax({
            type: "POST",
            url: "/InvoiceRefund/GetDataById",
            data: {
                id: val
            },
            success: function (data) {

                //$("tbody tr").empty();
                $('#tblBody tr td:not(:first)').remove();
                if (data.success == true) {
                    //alert(data.html);

                    //$("#Invoice_Number").val(data.InvNo);
                    if ($("#AirLine_Penalty").val() == "" || $("#Customer_Penalty").val() == "") {

                        $("#AirLine_Penalty").val("-" + 0);
                        $("#Customer_Penalty").val("-" + 0);
                        $("#AirLine_Penalty").addClass('is-invalid');
                        $("#Customer_Penalty").addClass('is-invalid');
                        $("#Other_Ref").addClass('is-invalid');
                    }
                    Net_Payable = [];
                    Net_Payable.push($("#Net_Payable").val());

                    $("#Payable_Code").val(data.check[0].Payable_Code);

                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var date = new Date();
                    var dat = date.getDate();
                    var mon = monthNames[date.getMonth()];
                    var year = date.getFullYear();
                    var todayDate = dat + "/" + mon + "/" + year;
                    $("#Invoice_Date").val(todayDate);

                    var dDate = ConvertDate(data.check[0].Departure_Date);
                    $("#Departure_Date").val(dDate);
                    var aDate = ConvertDate(data.check[0].Arrival_Date);
                    $("#Arrival_Date").val(aDate);

                    $("#Ticket_Number").val(data.check[0].Ticket_Number);
                    $("#Description").val(data.check[0].Description);
                    $("#Routing").val(data.check[0].Routing);
                    //$("#Paid").val(data[0].Paid);
                    $("#Invoice_Amount").val("-" + data.check[0].Invoice_Amount);
                    $("#ZIP_Code").val(data.check[0].ZIP_Code);
                    $("#Base_Fare").val("-" + data.check[0].Base_Fare);
                    $("#Tax").val("-" + data.check[0].Tax);
                    $("#Other_Cost").val("-" + data.check[0].Other_Cost);
                    $("#Stream_ID").val(data.check[0].Stream_ID).trigger('change');
                    //$("#Paid2").val(data[0].Paid2);
                    $("#Other_Ref").val(data.check[0].Other_Ref);
                    $("#Cust_Code").val(data.check[0].Cust_Code).trigger('change');
                    $("#Ticket_Status").val(data.check[0].Ticket_Status).trigger('change');

                    $("#Agent_ID").val(data.check[0].Agent_ID).trigger('change');
                    $("#TicketClass_ID").val(data.check[0].TicketClass_ID).trigger('change');

                    $("#Ticket_Commission").val(data.check[0].Ticket_Commission);
                    $("#VAT").val(data.check[0].VAT);
                    $("#Commission_Amount").val("-" + data.check[0].Commission_Amount);
                    $("#VAT_Amount").val("-" + data.check[0].VAT_Amount);
                    $("#Net_Payable").val("-" + data.check[0].Net_Payable);


                    $("#btnSave").show();
                    $("#btnUpdate").hide();

                    $(".modal-title").text("Refund Invoice");
                    $("#myModal").modal('show');
                    $(".modal-header").removeClass('bg-primary');
                    $(".modal-header").addClass('bg-success');
                } else {
                    $('.ui-pnotify').remove();
                    new PNotify({
                        title: 'INFO!',
                        text: data.message,
                        type: 'info',
                        animation: 'slide',
                        delay: 3000,
                        top: "500px",
                        min_height: "16px",
                        animate_speed: 400,
                        text_escape: true,
                        //nonblock: {
                        //    nonblock: true,
                        //    nonblock_opacity: .1
                        //},
                        styling: 'bootstrap3',
                    });
                }


            },
            error: function (er) {
                alert(er);
            }
        })
    }


}

$("#AddBtn").click(function () {

    resetDatafromFrom();

    $("#btnSave").show();
    $("#btnUpdate").hide();

    $(".modal-title").text("Add New Invoice Details");
    $("#myModal").modal('show');
    $(".modal-header").removeClass('bg-primary');
    $(".modal-header").addClass('bg-success');

});


function getById(id) {
    resetDatafromFrom();

    $.ajax({
        type: "POST",
        url: "/InvoiceRefund/GetDataById",
        data: { id: id },
        success: function (data) {
            if (data == "") {
                swal("WARNING!", "You cannot edit this info / No Permission", "warning");
            } else {

                $("#Payable_Code").val(data.check[0].Payable_Code);
                $("#Invoice_Number").val(data.check[0].Invoice_Number);
                var nDate = ConvertDate(data.check[0].Invoice_Date);
                $("#Invoice_Date").val(nDate);
                var dDate = ConvertDate(data.check[0].Departure_Date);
                $("#Departure_Date").val(dDate);
                var aDate = ConvertDate(data.check[0].Arrival_Date);
                $("#Arrival_Date").val(aDate);

                $("#Ticket_Number").val(data.check[0].Ticket_Number);
                $("#Description").val(data.check[0].Description);
                $("#Routing").val(data.check[0].Routing);
                //$("#Paid").val(data[0].Paid);
                $("#Invoice_Amount").val(data.check[0].Invoice_Amount);
                $("#ZIP_Code").val(data.check[0].ZIP_Code);
                $("#Base_Fare").val(data.check[0].Base_Fare);
                $("#Tax").val(data.check[0].Tax);
                $("#Other_Cost").val(data.check[0].Other_Cost);
                $("#Stream_ID").val(data.check[0].Stream_ID).trigger('change');
                //$("#Paid2").val(data[0].Paid2);
                $("#Other_Ref").val(data.check[0].Other_Ref);
                $("#Cust_Code").val(data.check[0].Cust_Code).trigger('change');
                $("#Ticket_Status").val(data.check[0].Ticket_Status).trigger('change');

                $("#Agent_ID").val(data.check[0].Agent_ID).trigger('change');
                $("#TicketClass_ID").val(data.check[0].TicketClass_ID).trigger('change');

                $("#Ticket_Commission").val(data.check[0].Ticket_Commission);
                $("#VAT").val(data.check[0].VAT);
                $("#Commission_Amount").val(data.check[0].Commission_Amount);
                $("#VAT_Amount").val(data.check[0].VAT_Amount);
                $("#Net_Payable").val(data.check[0].Net_Payable);
                $("#AirLine_Penalty").val(data.check[0].AirLine_Penalty);
                $("#Customer_Penalty").val(data.check[0].Customer_Penalty);

                $("#btnSave").hide();
                $("#btnUpdate").show();

                $(".modal-title").text("Update Refund Invoice");
                $("#myModal").modal('show');
                $(".modal-header").addClass('bg-primary');
                $(".modal-header").removeClass('bg-success');
            }

        }
    });

}
function deleteById(id) {

    progid = [];

    var table = $('#myTable').DataTable();

    var rowData = table.row("#" + id).data();

    var empId = rowData.Agent_Name;
    // var ename = rowData[2];
    var forAlert = empId; // + ", " + ename;

    swal({
        title: "Are you sure?",
        text: "Your will not be able to recover " + forAlert + " Invoice Data!",
        //text: forAlert,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel plx!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {

                $.ajax({
                    type: "POST",
                    url: "/InvoiceRefund/DeleteDataByID",
                    data: { id: id },
                    success: function (data) {

                        if (data.success) {

                            if (data.Delete == "Delete") {
                                var table = $('#myTable').DataTable();
                                index = table.row('#' + id);
                                var temp = table.row(index[0]).data();
                                table.row(index[0]).remove().draw();

                                progid.push(data.NextID);
                                $("#Invoice_Number").val(progid);

                                //$('.ui-pnotify').remove();
                                //new PNotify({
                                //    title: 'DELETED!',
                                //    text: data.message,
                                //    type: 'error',
                                //    animation: 'slide',
                                //    delay: 3000,
                                //    top: "500px",
                                //    min_height: "16px",
                                //    animate_speed: 400,
                                //    text_escape: true,
                                //    //nonblock: {
                                //    //    nonblock: true,
                                //    //    nonblock_opacity: .1
                                //    //},
                                //    styling: 'bootstrap3',
                                //});
                                swal("Deleted!", data.message, "success");
                                setTimeout(function () {
                                    swal.close();
                                }, 1000);
                            } else {
                                swal("Error!", data.message, "error");
                            }


                        } else {
                            swal("WARNING!", "You cannot delete this info / No Permission", "warning");
                            //location.reload();

                            //toastr.error(data.message, "Error",
                            //    options = {
                            //        "closeButton": true,
                            //        "debug": false,
                            //        "progressBar": true,
                            //        "preventDuplicates": true,
                            //        "positionClass": "toast-top-center",
                            //        "onclick": null,
                            //        "showDuration": "400",
                            //        "hideDuration": "1000",
                            //        "timeOut": "7000",
                            //        "extendedTimeOut": "1000",
                            //        "showEasing": "swing",
                            //        "hideEasing": "linear",
                            //        "showMethod": "fadeIn",
                            //        "hideMethod": "fadeOut"
                            //    });
                        }
                    }
                });
            }
            else {
                swal("Cancelled", "Your file is safe :)", "error");
            }
        });

}

$("#btnUpdate").click(function (e) {

    if ($("#myForm").valid()) {  //<<< I was missing this check
        var oForm = document.forms["myForm"];
        //var CourseType = $('#Course_Type option:selected').text();

        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {
                if (data.success) {

                    var table = $("#myTable").DataTable();

                    $('#myModal').modal('hide');

                    //var iDate = ConvertDate();
                    //var dDate = ConvertDate();
                    //var aDate = ConvertDate();

                    index = table.row('#' + oForm["Invoice_Number"].value); //1234126
                    var temp = table.row(index[0]).data();
                    temp["Invoice_Date"] = oForm["Invoice_Date"].value;
                    temp["Ticket_Number"] = oForm["Ticket_Number"].value;
                    temp["Description"] = oForm["Description"].value;
                    temp["Routing"] = oForm["Routing"].value;
                    temp["Departure_Date"] = oForm["Departure_Date"].value;
                    temp["Arrival_Date"] = oForm["Arrival_Date"].value;
                    //temp[10] = '0';
                    temp["Invoice_Amount"] = oForm["Invoice_Amount"].value;
                    temp["Base_Fare"] = oForm["Base_Fare"].value;
                    temp["Tax"] = oForm["Tax"].value;
                    temp["Other_Cost"] = oForm["Other_Cost"].value;
                    temp["Net_Payable"] = oForm["Net_Payable"].value;

                    table.row(index[0]).data(temp).draw(false);


                    $('.ui-pnotify').remove();
                    new PNotify({
                        title: 'SUCCESS!',
                        text: data.message,
                        type: 'success',
                        animation: 'slide',
                        delay: 3000,
                        top: "500px",
                        min_height: "16px",
                        animate_speed: 400,
                        text_escape: true,
                        //nonblock: {
                        //    nonblock: true,
                        //    nonblock_opacity: .1
                        //},
                        styling: 'bootstrap3',
                    });
                }
                else {
                    swal("Error!", data.message, "error");
                }
            }
        }
        if ($("form").attr('enctype') == "multipart/form-data") {
            ajaxConfig["contentType"] = false,
                ajaxConfig["processData"] = false;
        }
        $.ajax(ajaxConfig);
        return false;
    }

});
var progid = [];
$("#btnSave").click(function () {
    progid = [];
    var oForm = document.forms["myForm"];

    if ($("#myForm").valid()) {  //<<< I was missing this check
        var table = $("#myTable").DataTable();

        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {

                if (data.success) {
                    $('#myModal').modal('hide');

                    var rowIndex = table.row.add({
                        "Invoice_Number": '<button class="btn btn-success btn-sm"  id="' + oForm["Invoice_Number"].value + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + oForm["Invoice_Number"].value + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + oForm["Invoice_Number"].value + '" class="btn btn-danger btn-sm" onclick="deleteById(id)">Delete</button>',
                        "Invoice_Number": oForm["Invoice_Number"].value,
                        //"Ticket_Status": 'Pending',
                        "Invoice_Date": oForm["Invoice_Date"].value,
                        "Ticket_Number": $("#Ticket_Number").val(),
                        "Description": oForm["Description"].value,
                        "Routing": oForm["Routing"].value,
                        "": oForm["Departure_Date"].value,
                        "": oForm["Arrival_Date"].value,
                        "Paid": '0',
                        "Invoice_Amount": oForm["Invoice_Amount"].value,
                        "Base_Fare": oForm["Base_Fare"].value,
                        "Tax": oForm["Tax"].value,
                        "Other_Cost": oForm["Other_Cost"].value,
                        "Net_Payable": oForm["Net_Payable"].value
                    }).draw(false);

                    var row = $('#myTable').dataTable().fnGetNodes(rowIndex);

                    //var rowIndex = table.row.add([
                    //    '<button class="btn btn-success btn-sm"  id="' + oForm["Invoice_Number"].value + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + oForm["Invoice_Number"].value + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + oForm["Invoice_Number"].value + '" class="btn btn-danger btn-sm" onclick="deleteById(id)">Delete</button>',
                    //    oForm["Invoice_Number"].value,
                    //    '<label class="badge bg-danger">Pending</label>',
                    //    //'<label class="badge bg-danger">Not Paid</label>',
                    //    //'<label class="badge bg-success">Sale</label>',
                    //    oForm["Invoice_Date"].value,
                    //    oForm["Ticket_Number"].value,
                    //    oForm["Description"].value,
                    //    oForm["Routing"].value,
                    //    oForm["Departure_Date"].value,
                    //    oForm["Arrival_Date"].value,
                    //    '0',
                    //    oForm["Invoice_Amount"].value,
                    //    oForm["Base_Fare"].value,
                    //    oForm["Tax"].value,
                    //    oForm["Other_Cost"].value,
                    //    oForm["Net_Payable"].value
                    //]).draw(false);

                    //var row = $('#myTable').dataTable().fnGetNodes(rowIndex);
                    $(row).attr('id', oForm["Invoice_Number"].value);

                    progid.push(data.NextID);
                    $("#Invoice_Number").val(progid);

                    $('.ui-pnotify').remove();
                    new PNotify({
                        title: 'SUCCESS!',
                        text: data.message,
                        type: 'success',
                        animation: 'slide',
                        delay: 3000,
                        top: "500px",
                        min_height: "16px",
                        animate_speed: 400,
                        text_escape: true,
                        //nonblock: {
                        //    nonblock: true,
                        //    nonblock_opacity: .1
                        //},
                        styling: 'bootstrap3',
                    });
                }
                else {
                    swal("Error!", data.message, "error");
                }
            }
        }
        if ($("form").attr('enctype') == "multipart/form-data") {
            ajaxConfig["contentType"] = false,
                ajaxConfig["processData"] = false;
        }
        $.ajax(ajaxConfig);
        return false;
    }
});

function resetDatafromFrom() {

    // $("#ImagePreview").attr('src', '/AdminAssets/dist/img/avatar5.png');//e.target.result);
    //$("#Prog_ID").prop('readonly', false);
    $("#Invoice_Number").prop('readonly', true);
    $("select").val("").trigger('change');
    $("#myForm")[0].reset();
    $(".form-control.is-invalid").removeClass('is-invalid');

    $("#Base_Fare").val(0);
    $("#Tax").val(0);
    $("#Other_Cost").val(0);
    //$("#Paid").val(0);
    //$("#Paid2").val(0);

    $("#Invoice_Number").val(0);

}


$(document).ready(function () {
    // Date renderer for DataTables from cdn.datatables.net/plug-ins/1.10.21/dataRender/datetime.js

    myDatatable();


    $("#Invoice_Date").datepicker({
        format: 'd/M/yyyy',
        todayBtn: "linked",
        daysOfWeekDisabled: "0,6",
        daysOfWeekHighlighted: "5",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: "15-12-2016",
        endDate: "15-12-2022"
    });

    $("#Departure_Date").datepicker({
        format: 'd/M/yyyy',
        todayBtn: "linked",
        daysOfWeekDisabled: "0,6",
        daysOfWeekHighlighted: "5",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: "15-12-2016",
        endDate: "15-12-2022"
    });
    $("#Arrival_Date").datepicker({
        format: 'd/M/yyyy',
        todayBtn: "linked",
        daysOfWeekDisabled: "0,6",
        daysOfWeekHighlighted: "5",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: "15-12-2016",
        endDate: "15-12-2022"
    });

    $("#btnUpdate").hide();

    $('#myForm').validate({
        rules: {
            Invoice_Number: {
                required: true,
            }, Invoice_Date: {
                required: true,
            }, Ticket_Number: {
                required: true,
            }, Description: {
                required: true,
            }, Routing: {
                required: true,
            }
            //, Departure_Date: {
            //    required: true,
            //}
            //, Arrival_Date: {
            //    required: true,
            //}
            , Base_Fare: {
                required: true,
            }, Tax: {
                required: true,
            }, Other_Cost: {
                required: true,
            }, Stream_ID: {
                required: true,
            }, Cust_Code: {
                required: true,
            }, Ticket_Status: {
                required: true,
            }, Payable_Code: {
                required: true,
            }, Agent_ID: {
                required: true,
            }, TicketClass_ID: {
                required: true,
            }
            //, Other_Ref: {
            //    required: true,
            //}
            , Invoice_Amount: {
                required: true,
            }, Ticket_Commission: {
                required: true,
            }, Commission_Amount: {
                required: true,
            }, Net_Payable: {
                required: true,
            }
            //Email: {
            //    required: true,
            //    Email: true,
            //},
            //password: {
            //    required: true,
            //    minlength: 5
            //},
            //terms: {
            //    required: true
            //},
        },
        messages: {
            Invoice_Number: {
                required: "Please Enter Invoice Number"
            },
            Invoice_Date: {
                required: "Please Enter Invoice Date"
            }, Ticket_Number: {
                required: "Please Enter Ticket Number"
            }, Description: {
                required: "Please Enter Description "
            }, Routing: {
                required: "Please Enter Routing"
            }, Departure_Date: {
                required: "Please Enter Departure Date"
            }, Arrival_Date: {
                required: "Please Enter Arrival Date "
            }, Base_Fare: {
                required: "Please Enter Base Fare"
            }, Tax: {
                required: "Please Enter Tax"
            }, Other_Cost: {
                required: "Please Enter Other Cost"
            }, Stream_ID: {
                required: "Please Enter Stream ID"
            }, Cust_Code: {
                required: "Please Select Customer"
            }, Ticket_Status: {
                required: "Please Select Ticket Status"
            }, Payable_Code: {
                required: "Please Select Payable Code"
            }, Agent_ID: {
                required: "Please Select Agent"
            }, TicketClass_ID: {
                required: "Please Select Ticket Class"
            }, Other_Ref: {
                required: "Please Enter Other Reference"
            }, Invoice_Amount: {
                required: "Please Enter Invoice Amount"
            }, Ticket_Commission: {
                required: "Please Enter Ticket Commission"
            }, Commission_Amount: {
                required: "Please Enter Commission Amount"
            }, Net_Payable: {
                required: "Please Enter Net Payable"
            }
            //password: {
            //    required: "Please provide a password",
            //    minlength: "Your password must be at least 5 characters long"
            //},
            //terms: "Please accept our terms"
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

});

function myDatatable() {

    $.ajax({
        type: "GET",
        url: "/InvoiceRefund/GetAllRefundInvoice",
        data: {},
        success: function (data) {

            $('#myTable').DataTable({

                data: data,
                columns: [
                    {
                        "data": "Invoice_Number", "width": "250px", "orderable": false, render: function (data, type, row, meta) {
                            return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                        }
                    },
                    { "data": "Invoice_Number" },
                    {
                        "data": "Ticket_Status", render: function (data, type, row, meta) {
                            return '<label class="badge bg-info">Refund/Complete</label>';
                        }
                    },
                    {
                        title: "Invoice Date",
                        data: "Invoice_Date",
                        render: function (d) {
                            if (d == null) {
                                return "";
                            } else {
                                return moment(d).format("DD/MMM/YYYY");
                            }
                        }
                    },

                    { "data": "Ticket_Number" },
                    { "data": "Description" },
                    { "data": "Routing" },
                    {
                        title: "Departure Date",
                        data: "Departure_Date",
                        render: function (d) {
                            if (d == null) {
                                return "";
                            } else {
                                return moment(d).format("DD/MMM/YYYY");
                            }
                        }
                    },
                    {
                        title: "Arrival Date",
                        data: "Arrival_Date",
                        render: function (d) {
                            if (d == null) {
                                return "";
                            } else {
                                return moment(d).format("DD/MMM/YYYY");
                            }
                        }
                    },
                    { "data": "Paid" },
                    {
                        'data': 'Invoice_Amount',
                        'render': function (salary) {
                            return '$ ' + salary;
                        }
                    },
                    { "data": "Base_Fare" },
                    { "data": "Tax" },
                    { "data": "Other_Cost" },
                    { "data": "Net_Payable" },
                ],

                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    var rowID = aData.Invoice_Number;
                    $(nRow).attr('id', rowID);
                },


                scrollCollapse: true,
                "scrollX": true,
                select: true,                       // for Select Row
                scrollY: '50vh',
                "order": [1, "DESC"],
                //dom: 'lBfrtip',
                //language: {
                //    search: "", // for hide label of search
                //    searchPlaceholder: "Search Course", // place holder of search box
                //},
                "language": {
                    search: '',
                    //placeholder: 'filter records'
                },
                "bLengthChange": false,           //  for Show more Entries
                "bScrollCollapse": true,
                "processing": true,
                //"bPaginate": false,
                "sPaginationType": "full_numbers",
                //"langauge": {
                //    "QueryTable": "No data found, Please click on <b>Add New </b> Button"
                //},
                "oLanguage": {
                    "sEmptyTable": "No data found, Please click on <b>Add New Invoice</b> Button"
                }
            });
            $('.dataTables_filter input').attr("placeholder", "Search Invoice");
        }
    });
}

function ConvertDate(value) {

    if (value == null) {
        return "";
    }
    else {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(value);
        var dt = new Date(parseFloat(results[1]));
        var completedate = dt.getDate() + "/" + monthNames[dt.getMonth()] + "/" + dt.getFullYear();
        //"/" + dt.getFullYear().toString().substr(2,2));
        return completedate;
    }
}

function ToJavaScriptDate(value) {
    if (value == null) {
        return "";
    }
    else {
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(value);
        var date = new Date(parseFloat(results[1]));

        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }

}

function closeModal() {
    //alert(0);
    $("#InvoiceNumber").val("");
    $("select").val("").trigger('change');
}
