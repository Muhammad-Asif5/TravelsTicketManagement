
    $("#AddBtn").click(function () {
        resetDatafromFrom();

            $("#btnSave").show();
            $("#btnUpdate").hide();

            $(".modal-title").text("Add New Agent");
            $("#myModal").modal('show');
            $(".modal-header").removeClass('bg-primary');
            $(".modal-header").addClass('bg-success');

        });

        function getById(id) {
        resetDatafromFrom();

            $.ajax({
        type: "POST",
                url: "/Agent/GetDataById",
                data: {id: id },
                success: function (data) {

                    if (data.success == true) {
        $("#Agent_ID").val(data.check[0].Agent_ID);

                        $("#Agent_Name").val(data.check[0].Agent_Name);
                        $("#Agent_Status").val(data.check[0].Agent_Status);


                        $("#btnSave").hide();
                        $("#btnUpdate").show();

                        $(".modal-title").text("Update Agent");
                        $("#myModal").modal('show');
                        $(".modal-header").addClass('bg-primary');
                        $(".modal-header").removeClass('bg-success');
                    }
                    if (data == "") {
        swal("WARNING!", "You cannot edit this info / No Permission", "warning");
                    }

                },
                error: function (er) {
        alert(er)
    }

            });

        }
        function deleteById(id) {
        progid = [];

            var table = $('#myTable').DataTable();

            var rowData = table.row("#" + id).data();

            var empId = rowData[0];


            swal({
        title: "Are you sure?",
                text: "Your will not be able to recover " + empId + " Data!",
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
            url: "/Agent/DeleteDataByID",
            data: { id: id },
            success: function (data) {

                if (data.success) {

                    if (data.Delete == "Delete") {
                        var table = $('#myTable').DataTable();
                        index = table.row('#' + id);
                        var temp = table.row(index[0]).data();
                        table.row(index[0]).remove().draw();

                        progid.push(data.NextID);
                        $("#Agent_ID").val(progid);

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
                    //location.reload();
                    swal("WARNING!", "You cannot delete this info / No Permission", "warning");

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

                            index = table.row('#' + oForm["Agent_ID"].value); //1234126
                            var temp = table.row(index[0]).data();

                            if (oForm["Agent_Status"].value == "1") {
        temp[0] = oForm["Agent_Name"].value;
                                temp[1] = '<label class="badge bg-success">Active</label>';
                            } else {
        temp[0] = oForm["Agent_Name"].value;
                                temp[1] = '<label class="badge bg-danger">Closed</label>';
                            }

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
                            if (oForm["Agent_Status"].value == "1") {
                                var rowIndex = table.row.add([
                                    //oForm["Agent_ID"].value,
                                    oForm["Agent_Name"].value,
                                    '<label class="badge bg-success">Active</label>',
                                    '<button onclick="getById(this.id)" id="' + oForm[" Agent_ID"].value + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + oForm[" Agent_ID"].value + '" class="btn btn-danger btn-sm" onclick = "deleteById(id)" > Delete</button > '
                                ]).draw(false);
                            } else {
    var rowIndex = table.row.add([
        //oForm["Agent_ID"].value,
        oForm["Agent_Name"].value,
        '<label class="badge bg-danger">Closed</label>',
        '<button onclick="getById(this.id)" id="' + oForm["Agent_ID"].value + '" class="btn btn-primary btn-sm">Edit</button> <button id="' + oForm["Agent_ID"].value + '" class="btn btn-danger btn-sm" onclick="deleteById(id)">Delete</button>'
    ]).draw(false);
}

var row = $('#myTable').dataTable().fnGetNodes(rowIndex);
$(row).attr('id', oForm["Agent_ID"].value);

progid.push(data.NextID);
$("#Agent_ID").val(progid);

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
    $("#Agent_ID").prop('readonly', true);
    $("#myForm")[0].reset();
    $(".form-control.is-invalid").removeClass('is-invalid');

    if (progid == 0) {
        $("#Agent_ID").val(NextID);
    } else {
        $("#Agent_ID").val(progid);
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
            Agent_ID: {
                required: "Please Enter Agent ID"
            },
            Agent_Name: {
                required: "Please Enter Agent Name"
            },

            Agent_Status: {
                required: "Please Select Agent Status"
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
            { "targets": [2], "orderable": false }
        ],
        //dom: 'lBfrtip',
        language: {
            search: "", // for hide label of search
            searchPlaceholder: "Search Course", // place holder of search box
        },
        responsive: true,
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
            "sEmptyTable": "No data found, Please click on <b>Add Course</b> Button"
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

  