$("#AddBtn").click(function () {
    resetDatafromFrom();

    $("#btnSaveCourse").show();
    $("#btnUpdateCourse").hide();

    $(".modal-title").text("Add New Invoice Details");
    $("#courseModal").modal('show');
    $(".modal-header").removeClass('bg-primary');
    $(".modal-header").addClass('bg-success');

});

function getCourseById(id) {
    resetDatafromFrom();

    $.ajax({
        type: "POST",
        url: "/Course/GetCourseById",
        data: { id: id },
        success: function (data) {

            $("#Course_ID").prop('readonly', true);

            $("#Course_ID").val(data[0].Course_ID);
            $("#Short_Name").val(data[0].Short_Name);
            $("#Course_Title").val(data[0].Course_Title);
            $("#Course_Type").val(data[0].Course_Type);
            $("#Status").val(data[0].Status);

            $("#btnSaveCourse").hide();
            $("#btnUpdateCourse").show();

            $(".modal-title").text("Update Invoice Details");
            $("#courseModal").modal('show');
            $(".modal-header").addClass('bg-primary');
            $(".modal-header").removeClass('bg-success');
        }
    });

}
function deleteCourseById(id) {
    var table = $('#CourseTable').DataTable();

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
                    url: "/Course/DeleteCourseByID",
                    data: { id: id },
                    success: function (data) {

                        if (data.success) {

                            if (data.Delete == "Delete") {
                                var table = $('#CourseTable').DataTable();
                                index = table.row('#' + id);
                                var temp = table.row(index[0]).data();
                                table.row(index[0]).remove().draw();

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
                            location.reload();

                            toastr.error(data.message, "Error",
                                options = {
                                    "closeButton": true,
                                    "debug": false,
                                    "progressBar": true,
                                    "preventDuplicates": true,
                                    "positionClass": "toast-top-center",
                                    "onclick": null,
                                    "showDuration": "400",
                                    "hideDuration": "1000",
                                    "timeOut": "7000",
                                    "extendedTimeOut": "1000",
                                    "showEasing": "swing",
                                    "hideEasing": "linear",
                                    "showMethod": "fadeIn",
                                    "hideMethod": "fadeOut"
                                });
                        }
                    }
                });
            }
            else {
                swal("Cancelled", "Your file is safe :)", "error");
            }
        });

}
$("#btnUpdateCourse").click(function (e) {

    if ($("#CourseForm").valid()) {  //<<< I was missing this check
        var oForm = document.forms["CourseForm"];
        var CourseType = $('#Course_Type option:selected').text();

        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {
                if (data.success) {
                    var table = $("#CourseTable").DataTable();

                    $('#courseModal').modal('hide');

                    index = table.row('#' + oForm["Course_ID"].value); //1234126
                    var temp = table.row(index[0]).data();
                    temp[1] = oForm["Course_Title"].value;
                    temp[2] = oForm["Short_Name"].value;


                    if (oForm["Course_Type"].value == "1") {
                        temp[3] = '<label class="badge bg-success">Core Course</label>';
                    }
                    if (oForm["Course_Type"].value == "0") {
                        temp[3] = '<label class="badge bg-warning">Elective Course</label>';
                    }

                    if (oForm["Status"].value == "1") {
                        temp[4] = '<label class="badge bg-success">Active</label>';
                    }
                    if (oForm["Status"].value == "0") {

                        temp[4] = '<label class="badge bg-danger">Closed</label>';
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

$("#btnSaveCourse").click(function () {

    var oForm = document.forms["CourseForm"];

    if ($("#CourseForm").valid()) {  //<<< I was missing this check
        var table = $("#CourseTable").DataTable();

        var ajaxConfig = {
            type: "POST",
            url: oForm.action,
            data: new FormData(oForm),
            success: function (data) {

                if (data.success) {
                    $('#courseModal').modal('hide');

                    if (oForm["Course_Type"].value == '1' && oForm["Status"].value == '1') {
                        var rowIndex = table.row.add([oForm["Course_ID"].value, oForm["Course_Title"].value, oForm["Short_Name"].value, '<label class="badge bg-success">Core Course</label>', '<label class="badge bg-success">Active</label>', '<button onclick="getCourseById(this.id)" id="' + oForm["Course_ID"].value + '" class="btn btn-primary">Edit</button> <button id="' + oForm["Course_ID"].value + '" class="btn btn-danger" onclick="deleteCourseById(id)">Delete</button>']).draw(false);
                    }
                    if (oForm["Course_Type"].value == '1' && oForm["Status"].value == '0') {
                        var rowIndex = table.row.add([oForm["Course_ID"].value, oForm["Course_Title"].value, oForm["Short_Name"].value, '<label class="badge bg-success">Core Course</label>', '<label class="badge bg-danger">Closed</label>', '<button onclick="getCourseById(this.id)" id="' + oForm["Course_ID"].value + '" class="btn btn-primary">Edit</button> <button id="' + oForm["Course_ID"].value + '" class="btn btn-danger" onclick="deleteCourseById(id)">Delete</button>']).draw(false);
                    }
                    if (oForm["Course_Type"].value == '0' && oForm["Status"].value == '0') {
                        var rowIndex = table.row.add([oForm["Course_ID"].value, oForm["Course_Title"].value, oForm["Short_Name"].value, '<label class="badge bg-warning">Elective Course</label>', '<label class="badge bg-danger">Closed</label>', '<button onclick="getCourseById(this.id)" id="' + oForm["Course_ID"].value + '" class="btn btn-primary">Edit</button> <button id="' + oForm["Course_ID"].value + '" class="btn btn-danger" onclick="deleteCourseById(id)">Delete</button>']).draw(false);
                    }
                    if (oForm["Course_Type"].value == '0' && oForm["Status"].value == '1') {
                        var rowIndex = table.row.add([oForm["Course_ID"].value, oForm["Course_Title"].value, oForm["Short_Name"].value, '<label class="badge bg-warning">Elective Course</label>', '<label class="badge bg-success">Active</label>', '<button onclick="getCourseById(this.id)" id="' + oForm["Course_ID"].value + '" class="btn btn-primary">Edit</button> <button id="' + oForm["Course_ID"].value + '" class="btn btn-danger" onclick="deleteCourseById(id)">Delete</button>']).draw(false);
                    }

                    var row = $('#CourseTable').dataTable().fnGetNodes(rowIndex);
                    $(row).attr('id', oForm["Course_ID"].value);

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
    $("#Course_ID").prop('readonly', false);

    $("#CourseForm")[0].reset();
    $(".form-control.is-invalid").removeClass('is-invalid');
}


$(document).ready(function () {


    $("#btnUpdateCourse").hide();

    $('#CourseForm').validate({
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
    $("#CourseTable").DataTable({
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
        dom: 'lBfrtip',
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

    //$("#CourseTable").DataTable({
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