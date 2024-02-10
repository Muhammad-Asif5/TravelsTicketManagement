
    $("#AddBtn").click(function () {
        resetDatafromFrom();

            $("#btnSave").show();
            $("#btnUpdate").hide();

            $(".modal-title").text("Add New Customer");
            $("#myModal").modal('show');
            $(".modal-header").removeClass('bg-primary');
            $(".modal-header").addClass('bg-success');

        });
        function CalculateLookUp(value) {

            var Cust_Code = $("#Cust_Code").val();
            var Company_Name = $("#Company_Name").val();

            $("#Lookup").val(Cust_Code + " - " + Company_Name);
        }
        function getById(id) {
        resetDatafromFrom();

            $.ajax({
        type: "POST",
                url: "/Customer/GetDataById",
                data: {id: id },
                success: function (data) {

                    if (data == "") {
        swal("WARNING!", "You cannot edit this info / No Permission", "warning");
                    }
                    else {
        $("#Cust_ID").val(data[0].Cust_ID);

                        $("#Lookup").val(data[0].Lookup);
                        $("#Cust_Code").val(data[0].Cust_Code);
                        $("#Company_Name").val(data[0].Company_Name);
                        $("#Contact_Name").val(data[0].Contact_Name);
                        $("#Address").val(data[0].Address);
                        $("#City").val(data[0].City);
                        $("#State").val(data[0].State);
                        $("#ZIP_Code").val(data[0].ZIP_Code);
                        $("#Phone").val(data[0].Phone);
                        $("#Email").val(data[0].Email);
                        $("#Fax").val(data[0].Fax);


                        $("#btnSave").hide();
                        $("#btnUpdate").show();

                        $(".modal-title").text("Update Customer");
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

            var empId = rowData[0];
            var ename = rowData[1];
            var forAlert = empId + ", " + ename;

            swal({
        title: "Are you sure?",
                text: "Your will not be able to recover " + forAlert + " Data!",
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
            url: "/Customer/DeleteDataByID",
            data: { id: id },
            success: function (data) {

                if (data.success) {

                    if (data.Delete == "Delete") {
                        var table = $('#myTable').DataTable();
                        index = table.row('#' + id);
                        var temp = table.row(index[0]).data();
                        table.row(index[0]).remove().draw();

                        progid.push(data.NextID);
                        $("#Cust_ID").val(progid);

                        $('.ui-pnotify').remove();
                        new PNotify({
                            title: 'DELETED!',
                            text: data.message,
                            type: 'error',
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

                            index = table.row('#' + oForm["Cust_ID"].value); //1234126
                            var temp = table.row(index[0]).data();
                            temp[0] = oForm["Cust_Code"].value;
                            temp[1] = oForm["Company_Name"].value;
                            temp[2] = oForm["Lookup"].value;
                            temp[3] = oForm["Contact_Name"].value;
                            temp[4] = oForm["Address"].value;
                            temp[5] = oForm["City"].value;
                            temp[6] = oForm["State"].value;
                            temp[7] = oForm["ZIP_Code"].value;
                            temp[8] = oForm["Phone"].value;
                            temp[9] = oForm["Email"].value;
                            temp[10] = oForm["Fax"].value;

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
                            var rowIndex = table.row.add([
                                oForm["Lookup"].value,
                                oForm["Cust_Code"].value,
                                oForm["Company_Name"].value,
                                oForm["Contact_Name"].value,
                                oForm["Address"].value,
                                oForm["City"].value,
                                oForm["State"].value,
                                oForm["ZIP_Code"].value,
                                oForm["Phone"].value,
                                oForm["Email"].value,
                                oForm["Fax"].value,
                                '<button onclick="getById(this.id)" id="' + oForm[" Cust_ID"].value + '" class="btn btn-primary">Edit</button> <button id="' + oForm[" Cust_ID"].value + '" class="btn btn-danger" onclick = "deleteById(id)" > Delete</button > '
                            ]).draw(false);

var row = $('#myTable').dataTable().fnGetNodes(rowIndex);
$(row).attr('id', oForm["Cust_ID"].value);

progid.push(data.NextID);
$("#Cust_ID").val(progid);

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
    $("#Cust_ID").prop('readonly', true);
    $("#myForm")[0].reset();
    $(".form-control.is-invalid").removeClass('is-invalid');

    if (progid == 0) {
        $("#Cust_ID").val(NextID);
    } else {
        $("#Cust_ID").val(progid);
    }

}


$(document).ready(function () {


    $("#btnUpdate").hide();

    $('#myForm').validate({
        rules: {
            Course_ID: {
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
            Course_ID: {
                required: "Please Enter Course ID"
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


$(function () {
    $("#myTable").DataTable({
        //"paging": false,
        //searching: false,                   // for disable search box
        select: {
            info: false
        },

        //"order": [0, "asc"],
        // "orderable": false,
        "columnDefs": [
            { "targets": [0, 2, 5], "orderable": false }
        ],
        //dom: 'lBfrtip',
        language: {
            search: "", // for hide label of search
            searchPlaceholder: "Search Course", // place holder of search box
        },
        //responsive: true,
        //select: 'single',
        select: true,                       // for Select Row
        //bDestroy: true,                     // this will disable table when new load data
        "bLengthChange": false,           //  for Show more Entries
        //scrollY: '20vh',
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        "bScrollCollapse": true,
        "processing": true,
        //"bPaginate": false,
        "sPaginationType": "full_numbers",
        //"langauge": {
        //    "QueryTable": "No data found, Please click on <b>Add New </b> Button"
        //},
        "oLanguage": {
            "sEmptyTable": "No data found, Please click on <b>Add New Customer</b> Button"
        }
    });

    $('input[type="search"]').addClass('form-control'); // <-- add this line

    //$("#myTable").DataTable({
    //    "responsive": true,
    //    "autoWidth": false,
    //});

    //$('#example2').DataTable({
    //    "paging": true,
    //    "lengthChange": false,
    //    "searching": false,
    //    "ordering": true,
    //    "info": true,
    //    "autoWidth": false,
    //    "responsive": true,
    //});
});
