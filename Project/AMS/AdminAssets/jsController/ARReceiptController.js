$('#reservation').daterangepicker()

function changeBank(val) {

    if (val != "") {
        $.ajax({
            type: "GET",
            url: "/AmountReceiveable/GetBalance",
            data: {
                BankID: val
            },
            success: function (data) {
                rBalance = [];

                if (data.RemainingBalance != null) {
                    rBalance.push(data.RemainingBalance);
                    $("#Balance").val(data.RemainingBalance);
                } else {
                    $("#Balance").val(0);
                }

                //alert(data);
                //$("#VID").val(data.InvNo);

            },
            error: function (er) {
                alert(er);
            }
        });
    }

}

var rBalance = [];


function Calculate_Received_Amount(val) {

    if (previousAmount.length == 0) {
        if (rBalance.length == 0) {

        } else {

            var balnc = parseFloat(rBalance[0]) + parseFloat(val); //+ parseFloat(OpeningBalance).toFixed(2);
            $("#Balance").val(balnc.toFixed(2));
        }

    }
    else {
        var balnc = parseFloat(rBalance[0]) - parseFloat(previousAmount) + parseFloat(val); //+ parseFloat(OpeningBalance).toFixed(2);
        $("#Balance").val(balnc.toFixed(2));
    }
}

function viewReportByDate() {

    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);

    $.ajax({
        type: "POST",
        url: "/AmountReceiveable/GetAllAmountReceiveableByDate",
        data: {
            Dfrom: Dfrom,
            Dto: Dto,
        },
        success: function (data) {
            if (data.success == true) {
                $('#myTable').DataTable().destroy();
                $("table tbody").empty();

                var data = data.jsonResult.Data;
                $('#myTable').DataTable({

                    data: data,
                    columns: [
                        {
                            "data": "Receipt_Ref", "width": "300px", "orderable": false, render: function (data, type, row, meta) {
                                return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                            }
                        },
                        { "data": "Receipt_Ref", "width": "100px" },
                        {
                            title: "Received Date",
                            "width": "100px",
                            data: "Date",
                            render: function (d) {
                                if (d == null) {
                                    return "";
                                } else {
                                    return moment(d).format("DD/MMM/YYYY");
                                }
                            }
                        },
                        //{ "data": "Narration" },
                        { title: "Received From", "data": "Received_Paid", "width": "150px" },
                        { "data": "Debit" },
                        //{ "data": "Balance" },
                        { "data": "Cust_Code" },
                    ],
                    "fnCreatedRow": function (nRow, aData, iDataIndex) {
                        var rowID = aData.Receipt_Ref;
                        $(nRow).attr('id', rowID);
                    },

                    scrollCollapse: true,
                    "scrollX": true,
                    select: true,                       // for Select Row
                    scrollY: '50vh',
                    "order": [1, "DESC"],
                    //dom: 'lBfrtip',
                    "language": {
                        search: '',
                        //placeholder: 'filter records'
                    },
                    "bLengthChange": false,           //  for Show more Entries
                    "bScrollCollapse": true,
                    "processing": true,
                    //"bPaginate": false,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {
                        "sEmptyTable": "No data found, Please click on <b>Add New Amount</b> Button"
                    }
                });
                $('.dataTables_filter input').attr("placeholder", "Search AR Receipt");
            } else {
                swal("INFO!", data.message, "info");
            }
        },
        error: function (er) {
            alert(er);
        }
    })

}
function ViewReportData(id) {

    if (id != null) {

        //var url = "http://localhost:1216/WebForm/Receipts.aspx?Vid=" + id;
        var url = "AmountReceiveable/ReceiptVoucher?InvNo=" + id;

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
$("#AddBtn").click(function () {

    resetDatafromFrom();

    $("#btnSave").show();
    $("#btnUpdate").hide();

    $(".modal-title").text("Add Receiveable Amount Details");
    $("#myModal").modal('show');
    $(".modal-header").removeClass('bg-primary');
    $(".modal-header").addClass('bg-success');

});
var previousAmount = [];
function getById(id) {
    resetDatafromFrom();

    $.ajax({
        type: "POST",
        url: "/AmountReceiveable/GetDataById",
        data: { id: id },
        success: function (data) {

            if (data == "") {
                swal("WARNING!", "You cannot edit this info / No Permission", "warning");
            } else {

                $("#Bank_ID").val(data.check[0].Bank_ID);
                $("#VID").val(data.check[0].VID);

                $("#Received_Paid_Date").val(data.check[0].Received_Paid_Date);
                $("#Narration").val(data.check[0].Narration);
                $("#Received_Paid").val(data.check[0].Received_Paid);
                $("#Amount").val(data.check[0].Amount);
                var nDate = ConvertDate(data.check[0].Received_Paid_Date);
                $("#Received_Paid_Date").val(nDate);

                $("#Cust_Code").val(data.check[0].Cust_Code).trigger('change');
                $("#Balance").val(data.RemainingBalance);


                previousAmount = [];
                previousAmount.push(data.check[0].Amount);
                rBalance = [];
                rBalance.push(data.RemainingBalance);

                addcssClassForValidation();


                $("#btnSave").hide();
                $("#btnUpdate").show();

                $(".modal-title").text("Update Receiveable Amount Details");
                $("#myModal").modal('show');
                $(".modal-header").addClass('bg-primary');
                $(".modal-header").removeClass('bg-success');

                //$(".form-control.is-invalid").addClass('is-valid');
                //$(".form-control.is-invalid").removeClass('is-invalid');
            }

        }
    });

}
function deleteById(id) {
    //progid = [];

    var table = $('#myTable').DataTable();

    var rowData = table.row("#" + id).data();

    var empId = rowData.Receipt_Ref;
    //var ename = rowData[1];
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
                    url: "/AmountReceiveable/DeleteDataByID",
                    data: { id: id },
                    success: function (data) {

                        if (data.success) {

                            if (data.Delete == "Delete") {
                                var table = $('#myTable').DataTable();
                                index = table.row('#' + id);
                                var temp = table.row(index[0]).data();
                                table.row(index[0]).remove().draw();

                                //progid.push(data.NextID);
                                //$("#VID").val(progid);
                                //Balance = data.getAllBalance;

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

                    index = table.row('#' + oForm["VID"].value); //1234126
                    var temp = table.row(index[0]).data();
                    //temp[1] = oForm["Received_Paid"].value;
                    //temp["Narration"] = oForm["Narration"].value;
                    temp["Date"] = oForm["Received_Paid_Date"].value;
                    temp["Received_Paid"] = oForm["Received_Paid"].value;
                    temp["Debit"] = oForm["Amount"].value;
                    temp["Cust_Code"] = $('#Cust_Code option:selected').text();

                    table.row(index[0]).data(temp).draw();


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
//var progid = [];
$("#btnSave").click(function () {
    // progid = [];
    Balance = parseFloat($("#Balance").val());
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
                        "Receipt_Ref": '<button class="btn btn-success btn-sm" onclick="ViewReportData(this.id)" id="' + data.NextID + '">Cash Receipt Voucher</button> <button onclick="getById(this.id)" id="' + data.NextID + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + data.NextID + '" class="btn btn-danger btn-sm" onclick="deleteById(id)">Delete</button>',
                        "Receipt_Ref": data.NextID,
                        "Date": oForm["Received_Paid_Date"].value,
                        //"Narration":oForm["Narration"].value,
                        "Received_Paid": oForm["Received_Paid"].value,
                        "Debit": oForm["Amount"].value,
                        //"Balance": oForm["Balance"].value,
                        "Cust_Code": $('#Cust_Code option:selected').text()
                    }).draw(false);

                    var row = $('#myTable').dataTable().fnGetNodes(rowIndex);
                    $(row).attr('id', data.NextID);

                    //progid.push(data.NextID);
                    //$("#VID").val(progid);

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
    $("#VID").prop('readonly', true);
    $("#myForm")[0].reset();
    //$(".form-control.is-invalid").removeClass('is-invalid');
    //$(".form-control.is-valid").removeClass('is-valid');
    //$(".form-control").addClass('is-invalid');

    $("#Amount").val(0);
    $("#VID").val(0);
    $("#Balance").val(0);

    addcssClassForValidation();

}


function addcssClassForValidation() {
    var $inputs = $('#myForm :input');
    var values = {};
    $inputs.each(function () {
        values[this.name] = $(this).val();
        //var d = this.name + "-" + $(this).val();
        //alert(d);
        if ($(this).val() == "" || $(this).val() == "0" && this.name != "btn") {
            if (this.name != "btn") {
                document.getElementById(this.id).className = "form-control is-valid is-invalid";
            }
        }
        else {
            if (this.name != "btn") {
                document.getElementById(this.id).className = "form-control is-valid";
            }
        }
    });

}

$(document).ready(function () {

    myDatatable();

    //$('.select2').select2({
    //    theme: 'bootstrap4'
    //});

    $("#Received_Paid_Date").datepicker({
        format: 'd/M/yyyy',
        todayBtn: "linked",
        //daysOfWeekDisabled: "0,6",
        daysOfWeekHighlighted: "5",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: "15-12-2016",
        endDate: "15-12-2032",

    });

    $("#btnUpdate").hide();

    $('#myForm').validate({
        rules: {
            VID: {
                required: true,
            },
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
            Received_Paid_Date: {
                required: "Please Enter Date"
            },
            Narration: {
                required: "Please Enter Description"
            },
            Received_Paid: {
                required: "Please Enter Received From"
            },
            Cust_Code: {
                required: "Please Select Customer"
            },
            Email: {
                required: "Please enter a email address",
                //Email: "Please enter a vaild email address"
            },

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
        url: "/AmountReceiveable/GetAllAmountReceiveable",
        data: {},
        success: function (data) {
            if (data.success == true) {

                var data = data.jsonResult.Data;
                $('#myTable').DataTable({

                    data: data,
                    columns: [
                        {
                            "data": "Receipt_Ref", "width": "220px", "orderable": false, render: function (data, type, row, meta) {
                                return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                            }
                        },
                        { "data": "Receipt_Ref", "width": "100px" },
                        {
                            title: "Received Date",
                            "width": "100px",
                            data: "Date",
                            render: function (d) {
                                if (d == null) {
                                    return "";
                                } else {
                                    return moment(d).format("DD/MMM/YYYY");
                                }
                            }
                        },
                        //{ "data": "Narration" },
                        { title: "Received From", "data": "Received_Paid", "width": "150px" },
                        { "data": "Debit" },
                        //{ "data": "Balance" },
                        { "data": "Cust_Code" },
                    ],
                    "fnCreatedRow": function (nRow, aData, iDataIndex) {
                        var rowID = aData.Receipt_Ref;
                        $(nRow).attr('id', rowID);
                    },

                    scrollCollapse: true,
                    "scrollX": true,
                    select: true,                       // for Select Row
                    scrollY: '50vh',
                    "order": [1, "DESC"],
                    //dom: 'lBfrtip',
                    "language": {
                        search: '',
                        //placeholder: 'filter records'
                    },
                    "bLengthChange": false,           //  for Show more Entries
                    "bScrollCollapse": true,
                    "processing": true,
                    //"bPaginate": false,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {
                        "sEmptyTable": "No data found, Please click on <b>Add New Amount</b> Button"
                    }
                });
                $('.dataTables_filter input').attr("placeholder", "Search AR Receipt");
            } else {
                $('#myTable').DataTable({
                    columns: [
                        {
                            "data": "Receipt_Ref", "width": "220px", "orderable": false, render: function (data, type, row, meta) {
                                return '<button class="btn btn-success btn-sm" id="' + data + '" onclick="ViewReportData(this.id)">Generate Invoice</button> <button onclick="getById(this.id)" id="' + data + '" class="btn btn-primary btn-sm">Edit</button> <button onclick="deleteById(this.id)" id="' + data + '" class="btn btn-danger btn-sm">Delete</button>';
                            }
                        },
                        { "data": "Receipt_Ref", "width": "100px" },
                        {
                            title: "Received Date",
                            "width": "100px",
                            data: "Date",
                            render: function (d) {
                                if (d == null) {
                                    return "";
                                } else {
                                    return moment(d).format("DD/MMM/YYYY");
                                }
                            }
                        },
                        //{ "data": "Narration" },
                        { title: "Received From", "data": "Received_Paid", "width": "150px" },
                        { "data": "Debit" },
                        //{ "data": "Balance" },
                        { "data": "Cust_Code" },
                    ],
                    scrollCollapse: true,
                    "scrollX": true,
                    select: true,                       // for Select Row
                    scrollY: '50vh',
                    "order": [1, "DESC"],
                    //dom: 'lBfrtip',
                    "language": {
                        search: '',
                        //placeholder: 'filter records'
                    },
                    "bLengthChange": false,           //  for Show more Entries
                    "bScrollCollapse": true,
                    "processing": true,
                    //"bPaginate": false,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {
                        "sEmptyTable": "No data found, Please click on <b>Add New Amount</b> Button"
                    }
                });
                swal("INFO!", data.message, "info");
            }

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
