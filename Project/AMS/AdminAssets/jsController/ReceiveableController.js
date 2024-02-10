﻿
function tableToExcel(table, name) {
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

function viewReport() {

    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);
    var StatusValue = $("#ReceivePay_Status").val();
    var CustCode = $("#Cust_Code").val();

    if (StatusValue != null && CustCode != "") {
        $.ajax({
            type: "POST",
            url: "/Receiveable/GetAllReceiveableByDate",
            data: {
                Dfrom: Dfrom,
                Dto: Dto,
                CustCode: CustCode,
                status: StatusValue
            },
            success: OnSuccess,
            failure: function (response) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        })
    } else {
        swal("Info!", "Select Customer & Received Status", "info");
    }


}

function changeCust_Code(val) {

    $('#myTable').DataTable().destroy();
    var Status = $('#ReceivePay_Status option:selected').text();

    var CustCode = $("#Cust_Code").val();
    var StatusValue = $("#ReceivePay_Status").val();

    $.ajax({
        type: "POST",
        url: "/Receiveable/GetAllReceiveable",
        data: { CustCode: CustCode, status: StatusValue },
        success: OnSuccess,
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });



}

function changeReceivePay_Status(val) {
    //alert(val);
    $('#myTable').DataTable().destroy();
    var CustCode = $("#Cust_Code").val();

    if (val != "" && CustCode != "") {

        $.ajax({
            type: "POST",
            url: "/Receiveable/GetAllReceiveable",
            data: { CustCode: CustCode, status: val },
            success: OnSuccess,
            failure: function (data) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        })
    }


}

function toDayDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var dt = new Date();
    var completedate = dt.getDate() + "/" + monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    //"/" + dt.getFullYear().toString().substr(2,2));
    return completedate;
}

function OnSuccess(response) {

    var CustCodeText = $('#Cust_Code option:selected').text();
    $('#myTable').DataTable().destroy();
    $("table tbody").empty();
    $("table thead").empty();
    $("table tfoot").empty();
    $("table thead").append("<tr>" +
        "<th>Invoice Number</th>" +
        "<th>Invoice Date</th>" +
        "<th>Ticket Number</th>" +
        "<th>Description</th>" +
        "<th>Routing</th>" +
        "<th>Amount</th>" +
        "<th>Paid</th>" +
        "<th>Balance</th>" +
        "</tr>")
    $("table tfoot").append("<tr>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "</tr>")

    if (response.success == true) {
        if (response.r.length > 0) {

            $("#Company_Name").text(response.r[0].Company_Name);
            $("#Contact_Name").text(response.r[0].Contact_Name);
            $("#Address").text(response.r[0].Address);
            $("#Phone").text(response.r[0].Phone);

            setTimeout(function () {
                swal.close();
            }, 1500);

            table = $("#myTable").DataTable(
                {
                    data: response.r,
                    columns: [
                        { "data": "Invoice_Number", "width": "200px" },
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
                            'data': 'Balance',
                            "width": "200px",
                            'render': function (salary) {
                                if (salary == null) {
                                    return "";
                                } else {
                                    return '$ ' + salary;
                                }
                            }
                        }
                    ],
                    "paging": false,
                    //searching: false,                   // for disable search box
                    select: {
                        info: false
                    },
                    //"order": [0, "DESC"],
                    // "orderable": false,
                    //fixedColumns: true,
                    //buttons: [
                    //    {
                    //        extend: 'copyHtml5',
                    //        title: 'Receiveable Report', footer: true,
                    //    },
                    //    {
                    //        extend: 'csvHtml5',
                    //        title: 'Receiveable Report', footer: true,
                    //    },
                    //    {
                    //        extend: 'excelHtml5',
                    //        title: 'Receiveable Report',
                    //        text: 'Excel', //'Export to Excel',
                    //        sheetName: 'Receiveable Report',
                    //        messageTop: 'Horizon Account Management System, Receiveable Report',
                    //        footer: true,
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
                    //        title: 'Receiveable Report',
                    //        messageTop: 'Horizon Account Management System, Receiveable Report', footer: true,
                    //        //orientation: 'landscape',
                    //        //pageSize: 'A4',
                    //        //pageSize: 'LEGAL'
                    //        //header: false, // disable / no exported column header
                    //    }
                    //],
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
                    scrollY: '50vh',
                    //"sScrollX": "100%",
                    "bScrollCollapse": true,
                    //"processing": true,
                    //"bPaginate": false,
                    //"sPaginationType": "full_numbers",
                    //"langauge": {
                    //    "QueryTable": "No data found, Please click on <b>Add New </b> Button"
                    //},
                    "oLanguage": {
                        "sEmptyTable": "No data found"
                    },



                    scrollX: true,
                    scrollCollapse: true,
                    autoWidth: true,
                    //paging: true,
                    columnDefs: [
                        { "width": "150px", "targets": [0] },
                        { "targets": [4], "orderable": false }
                    ],

                    "footerCallback": function (row, data, start, end, display) {

                        var api = this.api(), data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ?
                                i.replace(/[\$,]/g, '') * 1 :
                                typeof i === 'number' ?
                                    i : 0;
                        };
                        // Total over all pages
                        amount = api.column(5, { page: 'current' }).data().reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                        $(api.column(5).footer()).html(
                            '$ ' + amount.toFixed(2)
                        );
                        paid = api.column(6, { page: 'current' }).data().reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                        $(api.column(6).footer()).html(
                            '$ ' + paid.toFixed(2)
                        );
                        balance = api.column(7, { page: 'current' }).data().reduce(function (a, b) {

                            return intVal(a) + intVal(b);
                        }, 0);
                        $(api.column(7).footer()).html(
                            '$ ' + balance.toFixed(2)
                        );
                    }
                });
            $('.dataTables_filter input').attr("placeholder", "Search Receiveable");
            $('.dataTables_filter input').addClass('form-control');


            $('<tr>' +
                '<th colspan="8" style="text-align:center; font-size:20pt; background: #748db9; color: ##022e7d;"><label>STATEMENT OF ACCOUNT</label></th>' +
                +'</tr>').insertBefore('table > thead > tr:first');
            $('<tr>' +
                '<th></th><th></th><th></th><th></th><th colspan="3"><label>Statement Date</label></th><th><label id="todayDate"></label></th>' +
                +'</tr>').insertBefore('table > thead > tr:first');
            $('<tr>' +
                '<th>Paid To</th><th>' + response.r[0].Company_Name + '</th><th></th><th></th><th colspan="3"><label>Code</label></th><th>' + CustCodeText + '</th>' +
                +'</tr>').insertBefore('table > thead > tr:first');
            $('<tr>' +
                '<th colspan="5">Address: N 1781, Sur O’avenue Kapenda, Quarter Makutano, Commune et Ville de Lubumbashi</th><th></th><th colspan="2"><label>Email: admin@brillanttravel.com</label></th>' +
                +'</tr>').insertBefore('table > thead > tr:first');

            $('<tr>' +
                '<th colspan="8" style="height:60px"><img src="http://erpadmin.brillanttravel.com/Logo/logo.png" /></th>' +
                +'</tr>').insertBefore('table > thead > tr:first');

        }
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
