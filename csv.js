// This script contains functions to import a table into .csv format, it also contains functions 

// This function import the full csv file
function getCSVfile(filename) {
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: filename,
        headers: {
            'Authorization': 'Basic' + btoa('_system:SYS'),
            'Access-Control-Allow-Origin': '*',
            'Content-Type':'application/csv',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        contentType: "application/csv;",
        dataType: "text",
    });
    
    var html = "<table class='table table-striped'>";
    for (var i=1; i<=1; i++) {
        html+="<tr>";
        for (var k=0; k < data[0].length; k++) {
            html+="<th>"+data[0][k]+"</th>";
        }
        html+="</tr>";
    }
    for (var i=1; i < data.length; i++) {
        html+="<tr>";
        for (k=0; k < data[i].length; k++) {
            html+="<td>"+data[i][k]+"</td>";
        }
        html+="</tr>";
    }
    // *** Change the function argument to YOUR <table> element id ***
    document.getElementById("HarmonicArray").innerHTML = html
}

// This function imports the data from the csv file but only displays the columns given in the argument
function getCSVfile_Limits(Column1Index, Column2Index, filename, DestinationElement, Header1, Header2, Header3, Current) {
    $.ajax({
        // *** Change this to the location of the .csv file you are importing ***
        url: filename,
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
    });
    var k=0, Current_Array=[], Current_Fixed_Array=[];
    var html = "<table class='table table-striped'>";
    html += "<tr><th>"+ Header1 +"</th><th>"+ Header2 +"</th><th>"+ Header3 +"</th></tr>";
    for (var i=1; i<data.length; i++) {
        Current_Array[k] = (data[i][Column2Index]/100)*Current;
        Current_Fixed_Array[k] = Current_Array[k].toFixed(2);
        html+="<tr>";
        html+="<td>"+data[i][Column1Index]+"</td><td>"+data[i][Column2Index]+"</td><td>"+Current_Fixed_Array[k]+"</td>";
        html+="</tr>";
        k++;
    }
    // *** Change the function argument to YOUR <table> element id ***
    document.getElementById(DestinationElement).innerHTML = html
}


// Export Table to .csv file
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // Filename
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Trigger the function
    downloadLink.click();
}

function export_table_to_csv(TableID, filename = '') {
    var csv = [];
    var table = document.querySelector(TableID)
	var rows = table.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
		csv.push(row.join(","));
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

/*document.querySelector("#Download").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
    // *** The Second Argument in this function call will set your file name of the exported CSV file***
	export_table_to_csv(html, "Harmonic Allocation.csv");
});*/


// Export table to .xls
function export_table_to_excel(tableID, filename = ''){
    var tableHTML = document.querySelector(tableID).outerHTML
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = tableHTML
    tableHTML = tableSelect.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //Trigger the function
        downloadLink.click();
    }
}


// Need to not use in-script event lister **Use in-html asynchronous function call instead**
/*document.querySelector("#Download1").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
    // *** The Second Argument of this function call will set your .xls filename ***
	export_table_to_excel(html, "Harmonic Allocation");
});
*/

/*
document.querySelector("#EIhidownloadcsv").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
    // *** The Second Argument of this function call will set your .xls filename ***
	export_table_to_excel(html, "Harmonic Allocation");
});
 */