﻿$('#reservation').daterangepicker()

function viewReport() {

    var BankID = $("#Bank_ID").val();
    var reservation = $("#reservation").val();
    var Dfrom = reservation.substring(0, 10);
    var Dto = reservation.substring(13);


    if (BankID != "") {
        $("#myTable").DataTable().destroy();
        $("table tbody").empty();
        $.ajax({
            type: "POST",
            url: "/BStatement/GetBStatement",
            data: {
                Dfrom: Dfrom,
                Dto: Dto,
                BankID: BankID
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
            if (title != "Received_Paid" && title != "AR Code" && title != "AP Code" && title != "EXP Code") {

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
    } else {

        alert("Select Bank");
    }

}
var table;
$(document).ready(function () {
    myDatatable();
});

function myDatatable() {
    var BankID = $("#Bank_ID").val();
    $.ajax({
        type: "GET",
        url: "/BStatement/GetBStatement",
        data: {
            Dfrom: null,
            Dto: null,
            BankID: 2
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccess,
        failure: function (response) {
            alert("failure " + response.d);
        },
        error: function (response) {
            alert("error " + response.d);
        }
    });

    $('#myTable tfoot th').each(function (i) {
        //var title = $('#myTable thead tr:eq(1) th').eq($(this).index()).text();
        var title = $(this).text();
        if (title != "Received_Paid" && title != "AR Code" && title != "AP Code" && title != "EXP Code") {

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
    $("#ClosingBalance").text("0");
    $("#ClosingBalance").text(response.RemainingBalance);
    if (response.success == true) {

        table = $("#myTable").DataTable({
            //bLengthChange: false,
            ////lengthMenu: [[5, 10, -1], [5, 10, "All"]],
            "lengthMenu": [
                [20, 25, 50,300],
                [20, 25, 50,300]
            ],

            orderCellsTop: true,
            fixedHeader: true,
            scrollCollapse: true,
            //"paging": false,
            scrollX: true,
            //autoWidth: true,
            select: true, // for Select Row
            scrollY: '50vh',
            "bDestroy": true,
            "processing": true,
            data: response.Bank_Statement.Data,
            columns: [{
                title: "Date",
                data: "Date",
                render: function (d) {
                    if (d == null) {
                        return "";
                    } else {
                        return moment(d).format("DD/MMM/YYYY");
                    }
                }
            },
            {
                "data": "Receipt_Ref"
            },
            {
                "data": "Payment_Ref"
            },
            {
                "data": "Narration"
            },
            {
                "data": "Received_Paid"
            },
            {
                "data": "Debit"
            },
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
            {
                "data": "Balance"
            },
            {
                "data": "Cust_Code"
            },
            {
                "data": "Payable_Code"
            },
            {
                "data": "Account"
            },

            ],

            initComplete: function () {
                count = 0;
                this.api().columns([4, 8, 9, 10]).every(function () {
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
                //{ "width": "100px", "targets": [0] },
                {
                    "targets": 0,
                    "type": "date"
                },
                //{
                //    "targets": [4],
                //    className: "no-wrap",
                //    "render": function (data, type, full, meta) {
                //        var rowIndex = meta.row + 1;
                //        var colIndex = meta.col + 1;

                //        $('#myTable tbody tr:nth-child(' + rowIndex + ') td:nth-child(' + colIndex + ')').css('color', 'Red');
                //        $('#myTable tbody tr:nth-child(' + rowIndex + ') td:nth-child(' + colIndex + ')').css('font-size', '15pt');
                //        return data;
                //    }
                //}
            ],
            //"fnCreatedRow": function (row, aData, iDataIndex) {
            //
            //    if (aData.ReceivePay_Status == "1") {

            //        $(row).find('td:eq(0)').addClass('bg-success');
            //        $(row).find('td:eq(1)').addClass('bg-success');
            //        $(row).find('td:eq(2)').addClass('bg-success');
            //        $(row).find('td:eq(3)').addClass('bg-success');
            //    }
            //},

            "language": {
                search: '',
                "lengthMenu": "Select _MENU_ ",
                "zeroRecords": "No <b>Bank Statement</b> Data Found",
                //"info": "Total",
                "infoEmpty": "No Records Available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
            dom: 'lBfrtip',
            buttons: [{
                extend: 'copyHtml5',
                title: 'Bank Statement'
            },
            {
                extend: 'csvHtml5',
                title: 'Bank Statement',
            },
            {
                extend: 'excelHtml5',
                title: 'Bank Statement',
                text: 'Excel', //'Export to Excel',
                sheetName: 'Bank Statement',
                messageTop: 'Brillant Travel Account Management System, Bank Statement',

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
                title: 'Bank Statement',
                messageTop: 'Brillant Travel Account Management System, Bank Statement',
                orientation: 'landscape',
                //orientation: 'portrait',
                //pageSize: 'A4',
                pageSize: 'letter',
                //pageSize: 'LEGAL',
                //header: false, // disable / no exported column header
                customize: function (doc) {
                    // Splice the image in after the header, but before the table
                    doc.content.splice(1, 0, {
                        margin: [0, 0, 0, 12],
                        alignment: 'center',
                        image: 'data:image/png;base64,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'
                    });
                    // Data URL generated by https://www.base64-image.de/
                }
            }
            ],
        });
        $('.dataTables_filter input').attr("placeholder", "Search Bank Statement");
        $('.dataTables_filter input').addClass('form-control');


    } else {
        swal("INFO!", response.message, "info");
    }

};