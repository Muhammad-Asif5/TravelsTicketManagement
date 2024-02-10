
function tableToExcel(table, name) {

    $("table tfoot").empty();

    $("table > tfoot").append("<tr>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th>" + asif[0] + "</th>" +
        "<th>" + asif[1] + "</th>" +
        "<th>" + asif[2] + "</th>" +
        "<th></th>" +
        "</tr>");

    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        }, format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
    var a = document.createElement('a');
    a.href = uri + base64(format(template, ctx))
    a.download = name + '.xls';
    a.click();
}


$('#reservation').daterangepicker();
$('.select2').select2({
    theme: 'bootstrap4'
});

function changePayableCodeAndStatus() {

    var pCode = $("#Air_ID").val();
    var pStatus = $("#Pay_Status").val();

    //if (pCode != "") {

    $('#myTable').DataTable().destroy();
    $("table tbody").empty();
    $("table thead").empty();
    $("table tfoot").empty();
    $("table thead").append("<tr >" +
        "<th>Invoice Number</th>" +
        "<th>Invoice Date</th>" +
        "<th>Ticket Number</th>" +
        "<th>Description</th>" +
        "<th>Routing</th>" +
        "<th>Net Payable</th>" +
        "<th>Paid2</th>" +
        "<th>Balance</th>" +
        "<th>Payable Code</th>" +
        "</tr>");
    $("table tfoot").append("<tr>" +
        "<th>Invoice Number</th>" +
        "<th>Invoice Date</th>" +
        "<th>Ticket Number</th>" +
        "<th>Description</th>" +
        "<th>Routing</th>" +
        "<th>Net Payable</th>" +
        "<th>Paid2</th>" +
        "<th>Balance</th>" +
        "<th>Payable Code</th>" +
        "</tr>")


    $.ajax({
        type: "GET",
        url: "/Payable/GetPayableByPCodeByDate",
        data: {
            pCode: pCode,
            pStatus: pStatus
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
        if (title != "Balance" && title != "Paid2" && title != "Net Payable" && title != "Routing" && title != "Description") {

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
    //}
}
function viewReport() {
    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);
    var pCode = $("#Air_ID").val();
    var pStatus = $("#Pay_Status").val();

    $('#myTable').DataTable().destroy();
    $("table tbody").empty();
    $("table thead").empty();
    $("table tfoot").empty();
    $("table thead").append("<tr >" +
        "<th>Invoice Number</th>" +
        "<th>Invoice Date</th>" +
        "<th>Ticket Number</th>" +
        "<th>Description</th>" +
        "<th>Routing</th>" +
        "<th>Net Payable</th>" +
        "<th>Paid2</th>" +
        "<th>Balance</th>" +
        "<th>Payable Code</th>" +
        "</tr>");
    $("table tfoot").append("<tr>" +
        "<th>Invoice Number</th>" +
        "<th>Invoice Date</th>" +
        "<th>Ticket Number</th>" +
        "<th>Description</th>" +
        "<th>Routing</th>" +
        "<th>Net Payable</th>" +
        "<th>Paid2</th>" +
        "<th>Balance</th>" +
        "<th>Payable Code</th>" +
        "</tr>");

    if (pCode != "" && pStatus != null && reservation != "") {
        $.ajax({
            type: "GET",
            url: "/Payable/GetPayableByPCodeByDate",
            data: {
                pCode: pCode,
                pStatus: pStatus,
                Dfrom: Dfrom,
                Dto: Dto
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
            if (title != "Balance" && title != "Paid2" && title != "Net Payable" && title != "Routing" && title != "Description") {

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
    else {
        swal("Info!", "Select Payable Code & Status", "info");
    }

}
var table;
$(document).ready(function () {
    // myDatatable();
});

function myDatatable() {
    $.ajax({
        type: "GET",
        url: "/Payable/GetPayable",
        data: {
            Dfrom: null,
            Dto: null
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
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
        if (title != "Balance" && title != "Paid2" && title != "Net Payable" && title != "Routing" && title != "Description") {

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
        table = $("#myTable").DataTable({
            //bLengthChange: false,
            ////lengthMenu: [[5, 10, -1], [5, 10, "All"]],
            "lengthMenu": [
                [20, 25, 50],
                [20, 25, 50]
            ],

            orderCellsTop: true,
            fixedHeader: true,
            scrollCollapse: true,
            "paging": false,
            scrollX: true,
            //autoWidth: true,
            select: true, // for Select Row
            scrollY: '50vh',
            "processing": true,
            data: response.CashBook,
            columns: [
                { "data": "Invoice_Number" },
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
                { "data": "Net_Payable" },
                { "data": "Paid2" },
                { "data": "Balance" },
                { "data": "Payable_Code" },
            ],

            initComplete: function () {
                count = 0;
                this.api().columns([3, 4, 8]).every(function () {
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
            columnDefs: [

                {
                    "targets": 0,
                    "type": "date",
                    "width": "100px"
                },
                { "width": "120px", "targets": [3] },
                { "width": "120px", "targets": [4] },
                { "width": "120px", "targets": [8] },
            ],

            "footerCallback": function (row, data, start, end, display) {

                var api = this.api(), data;
                asif = [];
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                // Total over all pages
                //amount = api.column(5).data().reduce(function (a, b) {
                //    return intVal(a) + intVal(b);
                //}, 0);
                // Total over this page
                amount = api.column(5, { page: 'current' }).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
                asif.push(amount.toFixed(2));
                $(api.column(5).footer()).html(
                    '$ ' + amount.toFixed(2)
                );
                //paid = api.column(6).data().reduce(function (a, b) {
                //    return intVal(a) + intVal(b);
                //}, 0);
                paid = api.column(6, { page: 'current' }).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
                asif.push(paid.toFixed(2));
                $(api.column(6).footer()).html(
                    '$ ' + paid.toFixed(2)
                );
                balance = api.column(7, { page: 'current' }).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
                asif.push(balance.toFixed(2));
                $(api.column(7).footer()).html(
                    '$ ' + balance.toFixed(2)
                );
            },

            "language": {
                search: '',
                "lengthMenu": "Select _MENU_ ",
                "zeroRecords": "No <b>Cash Book</b> Data Found",
                //"info": "Total",
                "infoEmpty": "No Records Available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },

        });
        $('.dataTables_filter input').attr("placeholder", "Search Payable");
        $('.dataTables_filter input').addClass('form-control');

        $('<tr>' +
            '<th colspan="9" style="text-align:center; font-size:20pt; background: #748db9; color: #ff0000;"><label>STATEMENT OF ACCOUNT - PAYABLE</label></th>' +
            +'</tr>').insertBefore('table > thead > tr:first');
        $('<tr>' +
            '<th></th><th></th><th></th><th></th><th></th><th><label>Statement Date</label></th><th colspan="2"><label id="todayDate"></label></th>' +
            +'</tr>').insertBefore('table > thead > tr:first');

        $('<tr>' +
            '<th colspan="5">Address: N 1781, Sur O’avenue Kapenda, Quarter Makutano, Commune et Ville de Lubumbashi</th><th></th><th colspan="3"><label>Email: admin@brillanttravel.com</label></th>' +
            +'</tr>').insertBefore('table > thead > tr:first');


        $('<tr>' +
            '<th colspan="8" style="height:60px"><img src="http://erpadmin.brillanttravel.com/Logo/logo.png" /></th>' +
            +'</tr>').insertBefore('table > thead > tr:first');

        $("#todayDate").text(toDayDate());
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
            bDestroy: true,
            "paging": false,
            info: false,
        });
        var reservation = $("#reservation").val();
        swal("INFO!", response.message + " for " + reservation, "info");
    }

};

function toDayDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var dt = new Date();
    var completedate = dt.getDate() + "/" + monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    //"/" + dt.getFullYear().toString().substr(2,2));
    return completedate;
}

var asif = [];