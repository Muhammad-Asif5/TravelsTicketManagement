
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
        url: "/APSummary/GetAPSummaryByDate",
        data: { Dfrom: Dfrom, Dto: Dto },
        success: function (data) {
            if (data.success == true) {
                $("#myTable").DataTable().destroy();
                $("table tbody").empty();

                table = $('#myTable').DataTable({

                    data: data.AP_Summary.Data,
                    columns: [
                        { "data": "Payable_Supplier" },
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
                            messageTop: 'Horizon Account Management System, AR Summary',

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
                            messageTop: 'Horizon Account Management System, AR Summary',
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
    //aasas();
    //custom();
    //$('#myTable').DataTable();
});
var table;
function myDatatable() {

    $.ajax({
        type: "GET",
        url: "/APSummary/GetAPSummary",
        data: {},
        success: function (data) {
            if (data.success == true) {
                table = $('#myTable').DataTable({

                    data: data.AP_Summary.Data,
                    columns: [
                        { "data": "Payable_Supplier" },
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
                            title: 'AP Summary'
                        },
                        {
                            extend: 'csvHtml5',
                            title: 'AP Summary',
                        },
                        {
                            extend: 'excelHtml5',
                            title: 'AP Summary',
                            text: 'Excel', //'Export to Excel',
                            sheetName: 'AP Summary',
                            messageTop: 'Horizon Account Management System, AP Summary',

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
                            title: 'AP Summary',
                            messageTop: 'Horizon Account Management System, AP Summary',
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
                        "sEmptyTable": "No <b>AP Summary</b> Data Found"
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

                $('.dataTables_filter input').attr("placeholder", "Search AP Summary");
                $('.dataTables_filter input').addClass("form-control");
            } else {
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

function custom2() {

    $('#myTable').DataTable({
        "paging": true,
        "autoWidth": true,
        "columnDefs": [
            {
                "targets": 3,
                "render": function (data, type, full, meta) {
                    var cellText = $(data).text(); //Stripping html tags !!!
                    if (type === 'display' && (cellText == "Done" || data == 'Done')) {
                        var rowIndex = meta.row + 1;
                        var colIndex = meta.col + 1;
                        $('#example tbody tr:nth-child(' + rowIndex + ')').addClass('lightRed');
                        $('#example tbody tr:nth-child(' + rowIndex + ') td:nth-child(' + colIndex + ')').addClass('red');
                        return data;
                    } else {
                        return data;
                    }
                }
            }
        ]
    });
}


function custom() {
    function EuToUsCurrencyFormat(input) {
        return input.replace(/[,.]/g, function (x) {
            return x == "," ? "." : ",";
        });
    }

    $(document).ready(function () {
        //Only needed for the filename of export files.
        //Normally set in the title tag of your page.
        document.title = 'DataTable Excel';
        // DataTable initialisation
        $('#myTable').DataTable({
            "dom": '<"dt-buttons"Bf><"clear">lirtp',
            "paging": true,
            "autoWidth": true,
            "buttons": [{
                extend: 'excelHtml5',
                text: 'Excel',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    //All cells
                    $('row c', sheet).attr('s', '25');
                    //Second column
                    $('row c:nth-child(2)', sheet).attr('s', '42');
                    //First row
                    $('row:first c', sheet).attr('s', '36');
                    // One cell
                    $('row c[r^="D6"]', sheet).attr('s', '32');
                    // Loop over the cells in column `E` the amount column
                    $('row c[r^="E"]', sheet).each(function () {
                        if (parseFloat(EuToUsCurrencyFormat($('is t', this).text())) > 1500) {
                            $(this).attr('s', '17');
                        }
                    });
                    //All cells of row 10
                    $('row c[r*="10"]', sheet).attr('s', '49');
                    //Search all cells for a specific text
                    $('row* c[r]', sheet).each(function () {
                        if ($('is t', this).text().match(/(?:^|\b)(cover)(?=\b|$)/gmi)) {
                            $(this).attr('s', '20');
                        }
                    });
                }
            }]
        });
    });
}







function aasas() {


    document.title = 'Styled DataTable';
    // DataTable initialisation
    $('#myTable').DataTable({
        dom: 'lBfrtip',
        "paging": false,
        "autoWidth": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: 'Styled Excel',
                customize: function (xlsx) {
                    var new_style = '<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="https://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="2"><numFmt numFmtId="171" formatCode="d/mm/yyyy;"/><numFmt numFmtId="172" formatCode="m/d/yyyy;"/></numFmts><fonts count="10" x14ac:knownFonts="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color theme="0"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><i/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color rgb="FFC00000"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color rgb="FF006600"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color rgb="FF990033"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><sz val="11"/><color rgb="FF663300"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><b/><sz val="11"/><color rgb="FFC00000"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts><fills count="16"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC00000"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFF0000"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC000"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFFF00"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF92D050"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF00B050"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF00B0F0"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0070C0"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF002060"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF7030A0"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="1"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF99CC00"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFF9999"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFCC00"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color indexed="64"/></left><right style="thin"><color indexed="64"/></right><top style="thin"><color indexed="64"/></top><bottom style="thin"><color indexed="64"/></bottom><diagonal/></border></borders><cellStyleXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="9" fontId="1" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0"/></cellStyleXfs><cellXfs count="70"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" textRotation="90"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" textRotation="255"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment textRotation="45"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="6" fillId="13" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="6" fillId="13" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="7" fillId="14" borderId="0" xfId="1" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="7" fillId="14" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="8" fillId="15" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="8" fillId="15" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="171" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="172" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="171" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="172" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="171" fontId="9" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="172" fontId="9" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="171" fontId="9" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="172" fontId="9" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf></cellXfs><cellStyles count="2"><cellStyle name="Procent" xfId="1" builtinId="5"/><cellStyle name="Standaard" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><colors><mruColors><color rgb="FF663300"/><color rgb="FFFFCC00"/><color rgb="FF990033"/><color rgb="FF006600"/><color rgb="FFFF9999"/><color rgb="FF99CC00"/></mruColors></colors><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="https://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext></extLst></styleSheet>';

                    xlsx.xl['styles.xml'] = $.parseXML(new_style);
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    //Apply a style to the header columns
                    $('row:first c', sheet).attr('s', '48');
                    //Individual example cells styling
                    $('row:nth-child(3) c:nth-child(4)', sheet).attr('s', '2');
                    $('row:nth-child(4) c:nth-child(4)', sheet).attr('s', '3');
                    $('row:nth-child(5) c:nth-child(4)', sheet).attr('s', '4');
                    $('row:nth-child(6) c:nth-child(4)', sheet).attr('s', '5');

                    //$('row:nth-child(19) c:nth-child(4)', sheet).attr('s','18');

                    //$('row:nth-child(32) c:nth-child(4)', sheet).attr('s','31');
                    //$('row:nth-child(44) c:nth-child(4)', sheet).attr('s','43');

                    //$('row:nth-child(47) c:nth-child(4)', sheet).attr('s','46');
                    //$('row:nth-child(48) c:nth-child(4)', sheet).attr('s','47');
                    //$('row:nth-child(49) c:nth-child(4)', sheet).attr('s','48');
                    //$('row:nth-child(53) c:nth-child(4)', sheet).attr('s','52');
                    //$('row:nth-child(54) c:nth-child(4)', sheet).attr('s','53');
                    //$('row:nth-child(55) c:nth-child(4)', sheet).attr('s','54');
                    //$('row:nth-child(62) c:nth-child(4)', sheet).attr('s','61');
                    //$('row:nth-child(66) c:nth-child(4)', sheet).attr('s','65');
                    //                  $('row:nth-child(69) c:nth-child(4)', sheet).attr('s', '68');
                }
            }
        ]
    });

    $('.btn-success').on('click', function () {
        var table = $('#myTable').DataTable();
        table.button('0').trigger();
    });

}
