/*
    Created By          :   Gaurav Mohan Bansal
    Created On          :   08 Apr 2015
    Remarks             :   This code can be extended as per your requirements.
                            This is a core javascript code & is not dependent on any other library.
                            It only depends on an IFrame (add anywhere in DOM)which is used to export HTML Table data in case of IE.
                            ****************<iframe id="exportIF" style="display: none"></iframe>****************
                            Include this Iframe in your Master Page/Common Layout Page or Individual page to implement HTML Table Export.
                            IE does not support Data URIs hence it requires some document reference.    
*/


function fnExportHTML(tableNames, headerbdColor, filename) {
    debugger
    //****************Validating input parameters********************************
    if (tableNames.trim() === "") {
        alert("No table supplied to export data!");
        return;
    }
    if (headerbdColor.trim() === "") {
        //Default Back Color
        headerbdColor = "#87AFC6"; 
    }
    if (filename.trim() === "") {
        //Default Filename
        filename = "ExportedData"; 
    }
    //********************************************************************************

    var export_data = "";
    var arrTableNames = tableNames.split("|");

    if (arrTableNames.length > 0) {
        for (var i = 0 ; i < arrTableNames.length ; i++) {
            export_data += "<table border='2px'><tr bgcolor='" + headerbdColor + "'>";
            objTable = document.getElementById(arrTableNames[i]); // table to export

            if (objTable === undefined) {
                alert("Table not found!");
                return;
            }

            for (var j = 0 ; j < objTable.rows.length ; j++) {
                export_data += objTable.rows[j].innerHTML + "</tr>";
            }

            export_data += "</table>";
        }

        //*********Optional Code: In case not required, please comment it*********************

        //For removing links in table data(if any)
        export_data = export_data.replace(/<A[^>]*>|<\/A>/g, "");

        //For removing images in table data(if any)
        export_data = export_data.replace(/<img[^>]*>/gi, "");

        //For reomving input params(if any)
        export_data = export_data.replace(/<input[^>]*>|<\/input>/gi, "");

        //*************************************************************************************
    }
    else {
        alert("No table supplied to export data!");
        return;
    }

    // If Internet Explorer(Not supported Data URIs), Check navigator details & find whether it is IE or NOT
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!window.navigator.userAgent.match(/Trident.*rv\:11\./)) {
        exportIF.document.open("txt/html", "replace");
        exportIF.document.write(export_data);
        exportIF.document.close();
        exportIF.focus();
        //SaveAs command to Save CSV File
        sa = exportIF.document.execCommand("SaveAs", true, filename + ".xls");  
    }
    else //other browsers : Chrome/FireFox (Supported Data URIs)
    {
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(export_data));
    }
    //return (sa);
}