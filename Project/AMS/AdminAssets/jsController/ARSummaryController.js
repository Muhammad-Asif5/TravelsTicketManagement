
$('#reservation').daterangepicker()

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
function viewReport() {
    var reservation = $("#reservation").val();

    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);

    $.ajax({
        type: "GET",
        url: "/ARSummary/GetARSummaryByDate",
        data: { Dfrom: Dfrom, Dto: Dto },
        success: function (data) {
            if (data.success == true) {
                $("#myTable").DataTable().destroy();
                $("table tbody").empty();

                table = $('#myTable').DataTable({

                    data: data.AR_Summary.Data,
                    columns: [
                        { "data": "Cust_Code" },
                        { "data": "Debit" },
                        {
                            'data': 'Credit',
                            'render': function (salary) {
                                if (salary == null) {
                                    return "";
                                } else {
                                    return '$ ' + salary;
                                }
                            }
                        },
                        { "data": "Balance" },

                    ],

                    "fnCreatedRow": function (row, aData, iDataIndex) {
                        if (aData.Balance != 0) {

                            $(row).find('td:eq(0)').addClass('bg-success');
                            $(row).find('td:eq(1)').addClass('bg-success');
                            $(row).find('td:eq(2)').addClass('bg-success');
                            $(row).find('td:eq(3)').addClass('bg-success');
                        }
                    },

                    scrollX: true,
                    //scrollCollapse: true,
                    autoWidth: true,
                    //paging: true,
                    //columnDefs: [
                    //    //{ "width": "100px", "targets": [0] },
                    //    { "targets": 0, "type": "date", "width": "100px" },

                    //],
                    "paging": false,
                    select: true,                       // for Select Row
                    scrollY: '50vh',
                    //"order": [1, "DESC"],
                    buttons: [
                        {
                            extend: 'copyHtml5',
                            title: 'AR Summary'
                        },
                        {
                            extend: 'csvHtml5',
                            title: 'AR Summary',
                        },
                        {
                            extend: 'excelHtml5',
                            title: 'AR Summary',
                            text: 'Excel', //'Export to Excel',
                            sheetName: 'AR Summary',
                            messageTop: 'Brillant Travel Account Management System, AR Summary',

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
                            title: 'AR Summary',
                            messageTop: 'Brillant Travel Account Management System, AR Summary',
                            orientation: 'portrait',
                            pageSize: 'A4',
                            //header: false, // disable / no exported column header
                        }
                    ],

                    dom: 'lBfrtip',
                    "language": {
                        search: '',
                        //placeholder: 'filter records'
                    },
                    "bLengthChange": false,           //  for Show more Entries
                    //"bScrollCollapse": true,
                    "processing": true,
                    "oLanguage": {
                        "sEmptyTable": "No <b>AR Summary</b> Data Found"
                    },

                    //initComplete: function () {
                    //    this.api().columns([4,8,9,10]).every(function () {
                    //        var column = this;
                    //        //var forSelect = column.context[0].aoColumns[0].data;
                    //        var select = $('<select class="form-control "><option value="">--Select--</option></select>')
                    //            .appendTo($(column.footer()).empty())
                    //            //.appendTo($(column.header()))
                    //            //.appendTo('#myTable thead tr:eq(1) th')
                    //            .on('change', function () {
                    //                var val = $.fn.dataTable.util.escapeRegex(
                    //                    $(this).val()
                    //                );
                    //                column
                    //                    .search(val ? '^' + val + '$' : '', true, false)
                    //                    .draw();
                    //            });

                    //        column.data().unique().sort().each(function (d, j) {
                    //            select.append('<option value="' + d + '">' + d + '</option>')
                    //        });
                    //    });
                    //}

                });

                $('.dataTables_filter input').attr("placeholder", "Search AR Summary");
                $('.dataTables_filter input').addClass("form-control");
            } else {
                swal("INFO!", data.message, "info");
            }
        }
    });
}

$(document).ready(function () {
    $('#myTable tfoot th').each(function (i) {
        //var title = $('#myTable thead tr:eq(1) th').eq($(this).index()).text();
        var title = $(this).text();
        $(this).html('<input style="width:150px;" type="text" class="form-control" placeholder="Search ' + title + '" />');

        $('input', this).on('keyup change clear', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
    });

    myDatatable();
});
var table;

function myDatatable() {

    $.ajax({
        type: "GET",
        url: "/ARSummary/GetARSummary",
        data: {},
        success: function (data) {
            if (data.success == true) {
                table = $('#myTable').DataTable({

                    data: data.AR_Summary.Data,
                    columns: [
                        { "data": "Cust_Code" },
                        { "data": "Debit" },
                        {
                            'data': 'Credit',
                            'render': function (salary) {
                                if (salary == null) {
                                    return "";
                                } else {
                                    return '$ ' + salary;
                                }
                            }
                        },
                        { "data": "Balance" },

                    ],

                    "fnCreatedRow": function (row, aData, iDataIndex) {

                        if (aData.Balance != 0) {

                            $(row).find('td:eq(0)').addClass('bg-success');
                            $(row).find('td:eq(1)').addClass('bg-success');
                            $(row).find('td:eq(2)').addClass('bg-success');
                            $(row).find('td:eq(3)').addClass('bg-success');
                        }
                    },

                    scrollX: true,
                    //scrollCollapse: true,
                    autoWidth: true,
                    //paging: true,
                    //columnDefs: [
                    //    //{ "width": "100px", "targets": [0] },
                    //    { "targets": 0, "type": "date", "width": "100px" },

                    //],
                    order: [[3, 'asc']],
                    "paging": false,
                    select: true,                       // for Select Row
                    scrollY: '50vh',
                    //"order": [1, "DESC"],
                    buttons: [
                        {
                            extend: 'copyHtml5',
                            title: 'AR Summary'
                        },
                        {
                            extend: 'csvHtml5',
                            title: 'AR Summary',
                        },
                        {
                            extend: 'excelHtml5',
                            title: 'AR Summary',
                            text: 'Excel', //'Export to Excel',
                            sheetName: 'AR Summary',
                            messageTop: 'Brillant Travel Account Management System, AR Summary',

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
                            title: 'AR Summary',
                            messageTop: 'Brillant Travel Account Management System, AR Summary',
                            orientation: 'portrait',
                            pageSize: 'A4',
                            //header: false, // disable / no exported column header
                        }
                    ],

                    dom: 'lBfrtip',
                    "language": {
                        search: '',
                        //placeholder: 'filter records'
                    },
                    "bLengthChange": false,           //  for Show more Entries
                    //"bScrollCollapse": true,
                    "processing": true,
                    "oLanguage": {
                        "sEmptyTable": "No <b>AR Summary</b> Data Found"
                    },

                    //initComplete: function () {
                    //    this.api().columns([4,8,9,10]).every(function () {
                    //        var column = this;
                    //        //var forSelect = column.context[0].aoColumns[0].data;
                    //        var select = $('<select class="form-control "><option value="">--Select--</option></select>')
                    //            .appendTo($(column.footer()).empty())
                    //            //.appendTo($(column.header()))
                    //            //.appendTo('#myTable thead tr:eq(1) th')
                    //            .on('change', function () {
                    //                var val = $.fn.dataTable.util.escapeRegex(
                    //                    $(this).val()
                    //                );
                    //                column
                    //                    .search(val ? '^' + val + '$' : '', true, false)
                    //                    .draw();
                    //            });

                    //        column.data().unique().sort().each(function (d, j) {
                    //            select.append('<option value="' + d + '">' + d + '</option>')
                    //        });
                    //    });
                    //}

                });

                $('.dataTables_filter input').attr("placeholder", "Search AR Summary");
                $('.dataTables_filter input').addClass("form-control");
            } else {
                swal("INFO!", data.message, "info");
            }
        }
    });
}

