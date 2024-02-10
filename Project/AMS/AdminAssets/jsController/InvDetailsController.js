$('#reservation').daterangepicker()

var table;
$(document).ready(function () {

    //$('.select2').select2();

    // Setup - add a text input to each footer cell
    //$('#myTable thead tr').clone(true).appendTo('#myTable thead');
    //$('#myTable thead tr:eq(1) th').each(function (i) {
    //    var title = $('#myTable thead tr:eq(1) th').eq($(this).index()).text();
    //    //var title = $(this).text();
    //    if (title != "Cust Code" && title != "Payable Code" && title != "Payable Supplier" && title != "Agent Name" && title != "Ticket Class" ) {
    //        $(this).html('<input style="width:150px;" type="text" class="form-control" placeholder="Search ' + title + '" />');

    //        $('input', this).on('keyup change clear', function () {
    //            if (table.column(i).search() !== this.value) {
    //                table
    //                    .column(i)
    //                    .search(this.value)
    //                    .draw();
    //            }
    //        });
    //    }
    //});

    myDatatable();

    //$('.select2').select2({
    //    theme: 'bootstrap4'
    //});
});

function viewReport() {
    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);
    var Pay_Status = $("#Pay_Status").val();

    $("#myTable").DataTable().destroy();
    $("table tbody").empty();

    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/GetInvoiceDetailsReport",
        data: {
            Dfrom: Dfrom,
            Dto: Dto,
            Pay_Status: Pay_Status
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
        if (title != "Cust Code" && title != "Payable Code" && title != "Payable Supplier" && title != "Agent Name" && title != "Ticket Class") {

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
    $('.select2').val(null).trigger('change');
}

function myDatatable() {

    $.ajax({
        type: "POST",
        url: "/GenerateInvoice/GetInvoiceDetailsReport",
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
        if (title != "Cust Code" && title != "Payable Code" && title != "Payable Supplier" && title != "Agent Name" && title != "Ticket Class") {

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

    if (response.success == true) {
        setTimeout(function () {
            swal.close();
        }, 1500);

        table = $("#myTable").DataTable(
            {
                //bLengthChange: false,
                ////lengthMenu: [[5, 10, -1], [5, 10, "All"]],
                "lengthMenu": [[20, 25, 50,300], [20, 25, 50,300]],

                orderCellsTop: true,
                fixedHeader: true,
                scrollCollapse: true,
                //"paging": false,
                scrollX: true,
                //autoWidth: true,
                select: true,                       // for Select Row
                scrollY: '50vh',
                "processing": true,
                data: response.data,
                columns: [
                    { "data": "Invoice_Number", "width": "200px" },
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
                        title: "Invoice Date", "width": "200px",
                        data: "Invoice_Date",
                        render: function (d) {
                            if (d == null) {
                                return "";
                            } else {
                                return moment(d).format("DD/MMM/YYYY");
                            }
                        }
                    },

                    { "data": "Ticket_Number", "width": "200px" },
                    { "data": "Description", "width": "200px" },
                    { "data": "Routing", "width": "200px" },
                    {
                        title: "Departure Date", "width": "200px",
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
                        title: "Arrival Date", "width": "200px",
                        data: "Arrival_Date",
                        render: function (d) {
                            if (d == null) {
                                return "";
                            } else {
                                return moment(d).format("DD/MMM/YYYY");
                            }

                        }
                    },
                    {
                        'data': 'Paid',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Invoice_Amount',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Base_Fare',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Tax',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Other_Cost',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'AirLine_Penalty',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Customer_Penalty',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Net_Payable',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },
                    {
                        'data': 'Paid2',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },

                    { "data": "Other_Ref", "width": "200px" },
                    { "data": "Cust_Code", "width": "200px" },
                    { "data": "Payable_Code", "width": "100px" },
                    { "data": "Payable_Supplier", "width": "200px" },
                    { "data": "Agent_Name", "width": "200px" },
                    { "data": "Ticket_Commission", "width": "200px" },
                    {
                        'data': 'Commission_Amount',
                        "width": "200px",
                        'render': function (salary) {
                            if (salary == null) {
                                return "";
                            } else {
                                return '$ ' + salary;
                            }
                        }
                    },

                    { "data": "VAT", "width": "200px" },
                    { "data": "VAT_Amount", "width": "200px" },
                    { "data": "Ticket_Class", "width": "200px" },
                ],

                initComplete: function () {
                    count = 0;
                    this.api().columns([18, 19, 20, 21, 26]).every(function () {
                        var title = this.header();

                        //replace spaces with dashes
                        title = $(title).html().replace(/[\W]/g, '-');
                        var column = this;
                        var select = $('<select style="width:100%" id="' + title + '" class="select2" ></select>')
                            .appendTo($(column.footer()).empty())
                            .on('change', function () {
                                //Get the "text" property from each selected data
                                //regex escape the value and store in array
                                var data = $.map($(this).select2('data'), function (value, key) {
                                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
                                });

                                //if no data selected use ""
                                if (data.length === 0) {
                                    data = [""];
                                }

                                //join array into string with regex or (|)
                                var val = data.join('|');

                                //search for the option(s) selected
                                column
                                    .search(val ? val : '', true, false)
                                    .draw();
                            });

                        column.data().unique().sort().each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });

                        //use column title as selector and placeholder
                        $('#' + title).select2({
                            multiple: true,
                            closeOnSelect: false,
                            placeholder: "Select a " + title
                        });

                        //initially clear select otherwise first option is selected
                        $('.select2').val(null).trigger('change');
                    });
                },

                "language": {
                    search: '',
                    "lengthMenu": "Select _MENU_ ",
                    "zeroRecords": "No <b>Invoice Details</b> Data Found",
                    //"info": "Total",
                    "infoEmpty": "No Records Available",
                    "infoFiltered": "(filtered from _MAX_ total records)"
                },
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'copyHtml5',
                        title: 'Unpaid Invoice Report'
                    },
                    {
                        extend: 'csvHtml5',
                        title: 'Unpaid Invoice Report',
                    },
                    {
                        extend: 'excelHtml5',
                        //header: false,
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'Unpaid Invoice Report',
                        //text: 'Excel', //'Export to Excel',
                        sheetName: 'Unpaid Invoice Report',
                        messageTop: 'Brillant Travel Account Management System, Unpaid Invoice Report',

                        //customize: function (xlsx) {                        // change font-size over all sheet
                        //    var sheet = xlsx.xl['styles.xml'];
                        //    var tagName = sheet.getElementsByTagName('sz');
                        //    for (i = 0; i < tagName.length; i++) {
                        //        tagName[i].setAttribute("val", "15")
                        //    }
                        //}

                        //customize: function (xlsx) {
                        //    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        //    $('c[r=A1] t', sheet).text('Custom Heading in First Row');
                        //    $('row:first c', sheet).attr('s', '2'); // first row is bold //0 - Normal text, 1 - White text, 2 - Bold, 3 - Italic, 4 - Underline
                        //    //All cells
                        //    $('row c[r^="K"]', sheet).each(function () {
                        //        $(this).attr('s', '15');
                        //    });
                        //}
                    },
                    {
                        extend: 'pdfHtml5',
                        title: 'Unpaid Invoice Report',
                        messageTop: 'Brillant Travel Account Management System, Unpaid Invoice Report',
                        orientation: 'landscape',
                        //pageSize: 'A4',
                        pageSize: 'LEGAL'
                        //header: false, // disable / no exported column header
                    }
                ],
            });
        $('.dataTables_filter input').attr("placeholder", "Search Invoice Details");
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
                "zeroRecords": "No <b>Invoice Details</b> Data Found",
                //"info": "Total",
                "infoEmpty": "No Records Available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
        });
        var reservation = $("#reservation").val();
        swal("INFO!", response.message + " for " + reservation, "info");
    }

};
