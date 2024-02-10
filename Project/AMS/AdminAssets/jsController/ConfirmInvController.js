$('#reservation').daterangepicker()
var TotalInvoiceNoWithArray = [];
var newRollNo = [];
var AmountReceiveObject = [];

var table;
$(document).ready(function () {
    myDatatable();
    //$('.select2').select2({
    //    theme: 'bootstrap4'
    //});
    //$('#Air_ID').select2({
    //    theme: 'bootstrap4'
    //});
});

function viewReport() {
    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);
    var CustCode = $("#Cust_Code").val();

    $("#myTable").DataTable().destroy();
    $("table tbody").empty();

    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/GetAllConfirmInvoiceByDate",
        data: {
            Dfrom: Dfrom,
            Dto: Dto,
            CustCode: CustCode
        },
        beforeSend: function () {
            swal({
                title: " ",
                text: "Please Wait",
                //imageUrl: "/AdminAssets/Images/loader.gif",
                imageUrl: "/AdminAssets/Images/ajax-Load.gif",
                showCancelButton: false,
                showConfirmButton: false
            });
        },
        success: OnSuccess,
        failure: function (response) {
            alert(response.d);
        },
        error: function (response) {
            alert(response.d);
        }
    });

    $('#myTable tfoot th').each(function (i) {
        //var title = $('#myTable thead tr:eq(1) th').eq($(this).index()).text();
        var title = $(this).text();
        if (title != "Paid" && title != "Ticket Number" && title != "Invoice Amount" && title != "") {

            $(this).html('<input style="width:150px;" type="text" class="form-control" placeholder="Search ' + title + '" />');

            $('input', this).on('keyup change clear', function () {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        }
    });
}

function myDatatable() {
    Paid = [];
    TotalInvoiceNoWithArray = [];

    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/GetAllConfirmReceiveable",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            swal({
                title: " ",
                text: "Please Wait",
                //imageUrl: "/AdminAssets/Images/loader.gif",
                imageUrl: "/AdminAssets/Images/ajax-Load.gif",
                showCancelButton: false,
                showConfirmButton: false
            });
        },
        success: OnSuccess,
        failure: function (response) {
            alert(response.d);
        },
        error: function (response) {
            alert(response.d);
        }
    });

    $('#myTable tfoot th').each(function (i) {
        //var title = $('#myTable thead tr:eq(1) th').eq($(this).index()).text();
        var title = $(this).text();
        if (title != "Paid" && title != "Ticket Number" && title != "Invoice Amount" && title != "") {

            $(this).html('<input style="width:150px;" type="text" class="form-control" placeholder="Search ' + title + '" />');

            $('input', this).on('keyup change clear', function () {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        }
    });
}

function OnSuccess(response) {
    $("#checkAll").prop("checked", false);

    if (response.success == true) {
        setTimeout(function () {
            swal.close();
        }, 1500);

        table = $("#myTable").DataTable(
            {
                //bLengthChange: false,
                ////lengthMenu: [[5, 10, -1], [5, 10, "All"]],
                "lengthMenu": [[20, 50, 100, 150], [20, 50, 100, 150]],

                orderCellsTop: true,
                fixedHeader: true,
                scrollCollapse: true,
                //"paging": false,
                scrollX: true,
                //autoWidth: true,
                select: true,                       // for Select Row
                scrollY: '50vh',
                "processing": true,
                data: response.RAmount,
                columns: [
                    { "data": "Invoice_Number" },
                    {
                        "data": "Paid", render: function (data, type, row, meta) {

                            if (row.Paid == 0 || row.Paid == null) {
                                return '<input value="' + row.Invoice_Amount + '" style="width:150px;" tabindex="' + (meta.row + 1) + '" id="ObtainedMarks' + row.Invoice_Number + '" type="number" name="name" class="form-control" />';
                                //$("#ObtainedMarks" + row.Invoice_Number).val(row.Invoice_Amount);
                            } else {
                                return '<input value="' + row.Paid + '" style="width:150px;" tabindex="' + (meta.row + 1) + '" id="ObtainedMarks' + row.Invoice_Number + '" type="number" name="name" class="form-control" />';
                                //$("#ObtainedMarks" + row.Invoice_Number).val(row.Paid);
                            }

                        }
                    },

                    { "data": "Invoice_Amount" },
                    { "data": "Balance" },
                    { "data": "Ticket_Number" },
                    { "data": "Description" },
                    {
                        "data": "ReceivePay_Status", render: function (data, type, row, meta) {
                            if (row.ReceivePay_Status == "1") {
                                return "<label class='badge bg-success'>Paid</label>";
                            }
                            else {
                                return "<label class='badge bg-danger'>Not Paid</label>";
                            }
                        }
                    },
                    {
                        "data": "Invoice_Number", "orderable": false, render: function (data, type, row, meta) {
                            return '<input id="' + row.Invoice_Number + '" onclick="toggle(this);"  type="checkbox" class="RegisterChkbox" name="RegisterChkbox1" />';
                        }
                    }
                ],
                //initComplete: function () {
                //    count = 0;
                //    this.api().columns([3, 4]).every(function () {

                //        var title = this.header();
                //        //replace spaces with dashes
                //        //title = title.innerText;
                //        title = $(title).html().replace(/[\W]/g, '');
                //        var column = this;
                //        var select = $('<select style="width:100%" id="' + title + '" class="select2" ></select>')
                //            .appendTo($(column.footer()).empty())
                //            .on('change', function () {
                //                //Get the "text" property from each selected data
                //                //regex escape the value and store in array
                //                var data = $.map($(this).select2('data'), function (value, key) {
                //                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
                //                });

                //                //if no data selected use ""
                //                if (data.length === 0) {
                //                    data = [""];
                //                }

                //                //join array into string with regex or (|)
                //                var val = data.join('|');

                //                //search for the option(s) selected
                //                column
                //                    .search(val ? val : '', true, false)
                //                    .draw();
                //            });

                //        column.data().unique().sort().each(function (d, j) {
                //            select.append('<option value="' + d + '">' + d + '</option>');
                //        });

                //        //use column title as selector and placeholder
                //        $('#' + title).select2({
                //            multiple: true,
                //            closeOnSelect: false,
                //            placeholder: "Select a " + title
                //        });

                //        //initially clear select otherwise first option is selected
                //        $('.select2').val(null).trigger('change');
                //    });
                //},

                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    var rowID = aData.Invoice_Number;
                    $(nRow).attr('id', rowID);
                },
                "footerCallback": function (row, data, start, end, display) {

                    var api = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    // Total over this page
                    amount = api.column(2, { page: 'current' }).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    $(api.column(2).footer()).html(
                        '$ ' + amount.toFixed(2)
                    );

                    balance = api.column(3, { page: 'current' }).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    $(api.column(3).footer()).html(
                        '$ ' + balance.toFixed(2)
                    );
                },
                "language": {
                    search: '',
                    "lengthMenu": "Select _MENU_ ",
                    "zeroRecords": "No <b>Confirm Receive Invoice</b> Data Found",
                    //"info": "Total",
                    "infoEmpty": "No Records Available",
                    "infoFiltered": "(filtered from _MAX_ total records)"
                },
                //dom: 'lBfrtip',
                //buttons: [
                //    {
                //        extend: 'copyHtml5',
                //        title: 'Unpaid Invoice Report'
                //    },
                //    {
                //        extend: 'csvHtml5',
                //        title: 'Unpaid Invoice Report',
                //    },
                //    {
                //        extend: 'excelHtml5',
                //        //header: false,
                //        text: '<i class="fas fa-file-excel"></i> Excel',
                //        title: 'Unpaid Invoice Report',
                //        //text: 'Excel', //'Export to Excel',
                //        sheetName: 'Unpaid Invoice Report',
                //        messageTop: 'Brillant Travel Account Management System, Unpaid Invoice Report',

                //        //customize: function (xlsx) {                        // change font-size over all sheet
                //        //    var sheet = xlsx.xl['styles.xml'];
                //        //    var tagName = sheet.getElementsByTagName('sz');
                //        //    for (i = 0; i < tagName.length; i++) {
                //        //        tagName[i].setAttribute("val", "15")
                //        //    }
                //        //}

                //        //customize: function (xlsx) {
                //        //    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                //        //    $('c[r=A1] t', sheet).text('Custom Heading in First Row');
                //        //    $('row:first c', sheet).attr('s', '2'); // first row is bold //0 - Normal text, 1 - White text, 2 - Bold, 3 - Italic, 4 - Underline
                //        //    //All cells
                //        //    $('row c[r^="K"]', sheet).each(function () {
                //        //        $(this).attr('s', '15');
                //        //    });
                //        //}
                //    },
                //    {
                //        extend: 'pdfHtml5',
                //        title: 'Unpaid Invoice Report',
                //        messageTop: 'Brillant Travel Account Management System, Unpaid Invoice Report',
                //        orientation: 'landscape',
                //        //pageSize: 'A4',
                //        pageSize: 'LEGAL'
                //        //header: false, // disable / no exported column header
                //    }
                //],
            });
        $('.dataTables_filter input').attr("placeholder", "Search Confirm Receive Invoice");
        $('.dataTables_filter input').addClass('form-control');
    } else {
        $("#myTable").DataTable({
            bLengthChange: false,
            orderCellsTop: true,
            fixedHeader: true,
            scrollCollapse: true,
            searching: false,
            scrollX: true,
            scrollY: '50vh',
            "processing": true,
            "language": {
                search: '',
                "lengthMenu": "Select _MENU_ ",
                "zeroRecords": "No <b>Confirm Receive Invoice</b> Data Found",
                //"info": "Total",
                "infoEmpty": "No Records Available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
        });
        var reservation = $("#reservation").val();
        swal("INFO!", response.message + " for " + reservation, "info");
    }

};

function CalculateObtainedMarks(value, id) {

    //alert($("#"+id).val())

    // value = "9", id = "ObtainedMarks1200001"
    var RollNoL = id.substring(13, 20);
    CombineMarksvalue.push(id);
    TotalInvoiceNoWithArray.push(RollNoL);

}

$("#checkAll").change(function () {

    if (this.checked) {
        $(".RegisterChkbox").each(function () {
            this.checked = true;
            var ID = this.id;
            var obtainerMarks = $("#ObtainedMarks" + ID).val();
            AmountReceiveObject.push({ ID, obtainerMarks });
        });
    } else {

        $(".RegisterChkbox").each(function () {
            this.checked = false;
            var ID = this.id;
            AmountReceiveObject = AmountReceiveObject.filter(function (returnableObjects1) {
                return returnableObjects1.ID !== ID;
            });
        });
    }
});


function toggle(source) {
    var ID = source.id;
    var defaultCheck = source.checked;
    if (defaultCheck == true) {
        var isAllChecked = 0;
        $(".RegisterChkbox").each(function () {
            if (!this.checked)
                isAllChecked = 1;
        });
        if (isAllChecked == 0) {
            $("#checkAll").prop("checked", true);
        }
        var obtainerMarks = $("#ObtainedMarks" + ID).val();
        AmountReceiveObject.push({ ID, obtainerMarks });
    }
    else {
        $("#checkAll").prop("checked", false);
        AmountReceiveObject = AmountReceiveObject.filter(function (returnableObjects1) {
            return returnableObjects1.ID !== ID;
        });

    }
}

function getUniqueListBy(AmountReceiveObject, key) {
    return [...new Map(AmountReceiveObject.map(item => [item[key], item])).values()]
}

var AmountPaid = [];
function saveConfirmInvoice() {

    TotalInvoiceNoWithArray = [];
    if (AmountReceiveObject.length > 0) {
        const arr1 = getUniqueListBy(AmountReceiveObject, 'ID')
        for (var i = 0; i < arr1.length; i++) {
            TotalInvoiceNoWithArray.push(arr1[i].ID);
            if (arr1[i].obtainerMarks == "") {
                AmountPaid.push(null);
            } else {
                AmountPaid.push(arr1[i].obtainerMarks);
            }
        }
        UpdateConfirmInvoice(TotalInvoiceNoWithArray, AmountPaid);

    } else {
        $('.ui-pnotify').remove();
        new PNotify({
            title: 'INFO!',
            text: "Please Check at least one",
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

}

function UpdateConfirmInvoice(InvNo, Paid) {
    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/SaveConfirmReceiveable",
        data: {
            InvNo: InvNo,
            Paid: Paid
        },
        success: function (data) {

            if (data.success == true) {
                $("#myTable").DataTable().destroy();
                $("table tbody").empty();
                myDatatable();

                //var table = $('#myTable').DataTable();
                //index = table.row('#' + InvNo);
                //table.row(index[0]).remove().draw();

                $('.ui-pnotify').remove();
                // mydatatble();
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
            } else {
                $("table tbody").append("<tr>" +
                    "<td style='text-align:center; font-weight:500' colspan='9'>No Data Found, Invoice has already been Received</td>" +
                    "</tr > ");
            }

        }
    })
}

function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}
