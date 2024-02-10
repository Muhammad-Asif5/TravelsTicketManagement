
//$('#Routing').inputmask('****-****-****', { 'placeholder': 'ABCD-EFGH-IJKL' })
//$('#Routing').inputmask('****-****-****')



$('#reservation').daterangepicker()

$('.select2').select2({
    theme: 'bootstrap4'
});

function viewReportByDate() {

    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);

    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/GetAllInvoiceByDate",
        data: {
            Dfrom: Dfrom,
            Dto: Dto,
        },
        success: function (data) {

            if (data.success == true) {
                $('#myTable').DataTable().destroy();
                $("table tbody").empty();
                if (data.r.length > 0) {

                    $('#myTable').DataTable({

                        data: data.r,
                        columns: [
                            {
                                "data": "Invoice_Number", "width": "250px", "orderable": false, render: function (data, type, row, meta) {
                                    return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                                }
                            },
                            { "data": "Invoice_Number" },
                            {
                                "data": "ReceivePay_Status", render: function (data, type, row, meta) {

                                    if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "01") {
                                        return '<label class="badge bg-success">Complete</label>';
                                    }
                                    if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "03") {
                                        return '<label class="badge bg-info">Refund/Complete</label>';
                                    }
                                    if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "02") {
                                        return '<label class="badge bg-info">Exchange</label>';
                                    }
                                    if (row.ReceivePay_Status != "1" && row.Pay_Status != "1") {
                                        return '<label class="badge bg-danger">Pending</label>';
                                    }
                                    if (row.ReceivePay_Status == "1" && row.Pay_Status != "1") {
                                        return '<label class="badge bg-danger">Not Paid</label>';
                                    }
                                    if (row.ReceivePay_Status != "1" && row.Pay_Status == "1") {
                                        return '<label class="badge bg-danger">Not Received</label>';
                                    }
                                    else
                                        return '-';
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
                        select: true,
                        scrollY: '50vh',
                        "order": [1, "DESC"],

                        "language": {
                            search: '',

                        },
                        "bLengthChange": false,
                        "bScrollCollapse": true,
                        "processing": true,
                        "sPaginationType": "full_numbers",

                        "oLanguage": {
                            "sEmptyTable": "No data found, Please click on <b>Add New Invoice</b> Button"
                        }
                    });
                    $('.dataTables_filter input').attr("placeholder", "Search Invoice");
                }
            } else {
                alert(data.message);
            }
        },
        error: function (er) {
            alert(er);
        }
    })

}

function ViewReportData(id) {

    if (id != null) {

        var url = "CReceiptVoucher/CReceiptVoucher?InvNo=" + id;


        var windowName = "_blank";
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        document.body.style.height = windowHeight + "px";
        newwindow = window.open(url, windowName, 'width=940,height=' + windowHeight + '');

        if (window.focus) { newwindow.focus() }

        return false;
    } else {
        alert(0);
    }
}

function Calculate_Invoice_Amount(val) {
    var BaseFare = $("#Base_Fare").val();
    var TotalValue = $("#Total_Value").val();
    var totalvalue = TotalValue - BaseFare;
    $("#Tax").val(totalvalue.toFixed(2));
    var Tax = $("#Tax").val();

    var OtherCost = $("#Other_Cost").val();
    if (val != "") {
        var InvoiceAmount = parseFloat(BaseFare) + parseFloat(Tax) + parseFloat(OtherCost);
        $("#Invoice_Amount").val(InvoiceAmount.toFixed(2));

        var CommissionAmount = (($("#Base_Fare").val() * $("#Ticket_Commission").val()) / 100);

        var Ticket_Commission = $("#Ticket_Commission").val();
        if (Ticket_Commission != "") {
            var VAT = $("#VAT").val();
            $("#Commission_Amount").val(CommissionAmount);
            var VATAmount = CommissionAmount * (VAT / 100);
            $("#VAT_Amount").val(VATAmount.toFixed(2));

            var NetPayable = $("#Invoice_Amount").val() - $("#Other_Cost").val() - $("#VAT_Amount").val() - CommissionAmount;
            $("#Net_Payable").val(NetPayable.toFixed(2));
        } else {
            var NetPayable = $("#Invoice_Amount").val() - $("#Other_Cost").val() - CommissionAmount;
            $("#Net_Payable").val(NetPayable.toFixed(2));
        }
    }
}


function changePayable_Code(val) {

    if (val != "") {

        $.ajax({
            type: "POST",
            url: "/GenerateInvoice/GetPayAbleCommission",
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
        url: "/GenerateInvoice/GetDataById",
        data: { id: id },
        success: function (data) {
            if (data == "") {
                swal("WARNING!", "You cannot edit this info / No Permission or Session Expired", "warning");
            } else {
                if (data[0].Pay_Status == "1" || data[0].ReceivePay_Status == "1") {
                    $("#MistakenEdit").show();
                } else {
                    $("#MistakenEdit").hide();
                }
                $("#Payable_Code").val(data[0].Payable_Code);
                $("#Invoice_Number").val(data[0].Invoice_Number);
                var nDate = ConvertDate(data[0].Invoice_Date);
                $("#Invoice_Date").val(nDate);
                var dDate = ConvertDate(data[0].Departure_Date);
                $("#Departure_Date").val(dDate);
                var aDate = ConvertDate(data[0].Arrival_Date);
                $("#Arrival_Date").val(aDate);

                $("#Ticket_Number").val(data[0].Ticket_Number);
                $("#Description").val(data[0].Description);
                $("#Routing").val(data[0].Routing);

                $("#Invoice_Amount").val(data[0].Invoice_Amount);
                $("#ZIP_Code").val(data[0].ZIP_Code);
                $("#Base_Fare").val(data[0].Base_Fare);
                $("#Tax").val(data[0].Tax);
                $("#Other_Cost").val(data[0].Other_Cost);
                $("#Stream_ID").val(data[0].Stream_ID).trigger('change');

                $("#Other_Ref").val(data[0].Other_Ref);
                $("#Cust_Code").val(data[0].Cust_Code).trigger('change');
                $("#Ticket_Status").val(data[0].Ticket_Status).trigger('change');

                $("#Agent_ID").val(data[0].Agent_ID).trigger('change');
                $("#TicketClass_ID").val(data[0].TicketClass_ID).trigger('change');

                $("#Ticket_Commission").val(data[0].Ticket_Commission);
                $("#VAT").val(data[0].VAT);
                $("#Commission_Amount").val(data[0].Commission_Amount);
                $("#VAT_Amount").val(data[0].VAT_Amount);
                $("#Net_Payable").val(data[0].Net_Payable);
                $("#Paid").val(data[0].Paid);
                $("#Paid2").val(data[0].Paid2);
                $("#Total_Value").val(data[0].Total_Value);


                $("#btnSave").hide();
                $("#btnUpdate").show();

                $(".modal-title").text("Update Invoice Details");
                $("#myModal").modal('show');
                $(".modal-header").addClass('bg-primary');
                $(".modal-header").removeClass('bg-success');
            }

        },
        error: function (error) {
            swal("Error!", error, "error");
        }
    });

}
function deleteById(id) {

    var table = $('#myTable').DataTable();

    var rowData = table.row("#" + id).data();

    var empId = rowData.Agent_Name;

    var forAlert = empId;

    swal({
        title: "Are you sure?",
        text: "Your will not be able to recover " + forAlert + " Invoice Data!",

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
                    url: "/GenerateInvoice/DeleteDataByID",
                    data: { id: id },
                    success: function (data) {

                        if (data.success) {

                            if (data.Delete == "Delete") {
                                var table = $('#myTable').DataTable();
                                index = table.row('#' + id);
                                var temp = table.row(index[0]).data();
                                table.row(index[0]).remove().draw();


                                swal("Deleted!", data.message, "success");
                                setTimeout(function () {
                                    swal.close();
                                }, 1000);
                            } else {
                                swal("WARNING!", data.message, "warning");
                            }


                        } else {
                            swal("WARNING!", "You cannot edit this info / No Permission or Session Expired", "warning");

                        }
                    },
                    error: function (error) {
                        swal("Error!", error, "error");
                    }
                });
            }
            else {
                swal("Cancelled", "Your file is safe :)", "error");
            }
        });

}
$("#btnUpdate").click(function (e) {

    if ($("#myForm").valid()) {
        var oForm = document.forms["myForm"];


        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {

                if (data.success) {

                    var table = $("#myTable").DataTable();

                    $('#myModal').modal('hide');

                    index = table.row('#' + oForm["Invoice_Number"].value); //1234126
                    var temp = table.row(index[0]).data();
                    temp["Invoice_Date"] = oForm["Invoice_Date"].value;
                    temp["Ticket_Number"] = oForm["Ticket_Number"].value;
                    temp["Description"] = oForm["Description"].value;
                    temp["Routing"] = oForm["Routing"].value;
                    temp["Departure_Date"] = oForm["Departure_Date"].value;
                    temp["Arrival_Date"] = oForm["Arrival_Date"].value;

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

                        styling: 'bootstrap3',
                    });
                }
                else if (data == "") {
                    swal("EXPIRED!", "Session Expired, Login Again", "warning");
                }
                else {
                    swal("Error!", data.message, "error");
                }
            },
            error: function (error) {
                swal("Error!", error, "error");
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

$("#btnSave").click(function () {

    var oForm = document.forms["myForm"];

    if ($("#myForm").valid()) {
        var table = $("#myTable").DataTable();
        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {

                if (data.success) {
                    if (data.message.substring(0, 6) == "Ticket") {
                        swal("WARNING!", data.message, "warning");
                    } else {
                        $('#myModal').modal('hide');
                        var rowIndex = table.row.add({
                            "Invoice_Number": '<button class="btn btn-success btn-sm"  id="' + data.NextID + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data.NextID + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + data.NextID + '" class="btn btn-danger btn-sm" onclick="deleteById(id)">Delete</button>',
                            "Invoice_Number": data.NextID,
                            "ReceivePay_Status": 'Pending',
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
                        $(row).attr('id', data.NextID);
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

                            styling: 'bootstrap3',
                        });
                    }

                }
                else if (data == "") {
                    swal("EXPIRED!", "Session Expired, Login Again", "warning");
                }
                else {
                    swal("Error!", data.message, "error");
                }
            },
            error: function (error) {
                swal("Error!", error, "error");
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
    $("#MistakenEdit").hide();

    $("select").val("").trigger('change');
    $("#myForm")[0].reset();
    $(".form-control.is-invalid").removeClass('is-invalid');

    $("#Base_Fare").val(0);
    $("#Total_Value").val(0);
    $("#Tax").val(0);
    $("#Other_Cost").val(0);

}


$(document).ready(function () {

    $("#MistakenEdit").hide();
    myDatatable();


    $("#Invoice_Date").datepicker({
        format: 'd/M/yyyy',
        todayBtn: "linked",
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
            }

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

            , Invoice_Amount: {
                required: true,
            }, Ticket_Commission: {
                required: true,
            }, Commission_Amount: {
                required: true,
            }, Net_Payable: {
                required: true,
            }

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
        url: "/GenerateInvoice/GetAllInvoice",
        data: {},
        success: function (data) {

            $('#myTable').DataTable({

                data: data.r,
                columns: [
                    {
                        "data": "Invoice_Number", "width": "230px", "orderable": false, render: function (data, type, row, meta) {
                            return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                        }
                    },
                    { "data": "Invoice_Number" },
                    {
                        "data": "ReceivePay_Status", render: function (data, type, row, meta) {

                            if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "01") {
                                return '<label class="badge bg-success">Complete</label>';
                            }
                            if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "03") {
                                return '<label class="badge bg-info">Refund/Complete</label>';
                            }
                            if (row.ReceivePay_Status == "1" && row.Pay_Status == "1" && row.Ticket_Status == "02") {
                                return '<label class="badge bg-info">Exchange</label>';
                            }
                            if (row.ReceivePay_Status == "0" && row.Pay_Status == "0") {
                                return '<label class="badge bg-danger">Pending</label>';
                            }
                            if (row.ReceivePay_Status == "1" && row.Pay_Status == "0") {
                                return '<label class="badge bg-danger">Not Paid</label>';
                            }
                            if (row.ReceivePay_Status == "0" && row.Pay_Status == "1") {
                                return '<label class="badge bg-danger">Not Received</label>';
                            }
                            else
                                return '-';
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
                select: true,
                scrollY: '50vh',
                "order": [1, "DESC"],

                "language": {
                    search: '',

                },
                "bLengthChange": false,
                "bScrollCollapse": true,
                "processing": true,

                "sPaginationType": "full_numbers",

                "oLanguage": {
                    "sEmptyTable": "No data found, Please click on <b>Add New Invoice</b> Button"
                }
            });
            $('.dataTables_filter input').attr("placeholder", "Search Invoice");
        }
        , error: function (er) {

            alert("Error! " + er);
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
