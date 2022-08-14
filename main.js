import tableWrapper from "./lib/tableWrapper.js";


const mainTable = document.querySelector("#mainTable");
const csvInput = document.querySelector("#csvInput");
const csvTable = new tableWrapper(mainTable);

var headers = [];
var tableBody;
var rows = [];
var headerIndex = 0;
var conditionIndex = 'match';
var tableData = [];
var secondTableData = []; // save data, such that reset is possible


csvInput.addEventListener("change", function() {
    Papa.parse(csvInput.files[0], {
        delimiter: ",",
        skipEmptyLines: true,
        complete: results => {
            tableData = results.data;
            secondTableData = results.data;
            csvTable.update(results.data[0], results.data.slice(1));
            headers = csvTable.table.querySelectorAll('th');
           
            // Populate dropdown with headers
            updateDropdown();
            // ensure the header selected works imidately after loading the table
            // probably not really needed
            onChange_header();

            // causes sorting header to not work
            // applySorting(); has been added to onChange_viewMode();
            onChange_viewMode();
        }

    });

});


const searchBar = document.getElementById('searchBar');

// Searchbar, only active if csv file has been loaded
searchBar.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {

        var filter, tr, td, i, txtValue;
        filter = searchBar.value;
        var tempList = [];
        
        // reset the table for new search
        csvTable.update(secondTableData[0], secondTableData.slice(1));

        if (csvTable.table !== null) { 
            tr = csvTable.table.getElementsByTagName("tr");

            if (conditionIndex === 'match') {
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[headerIndex];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.indexOf(filter) > -1) {
                            //r[i].style.display = "";
                            tempList.push(secondTableData.slice(1)[i-1]);
                        } 
                    }
                }
                csvTable.update(tableData[0], tempList);
                tableData = [tableData[0]].concat(tempList);

            } else if (conditionIndex === 'lt') {
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[headerIndex];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (filter !== "" && !isNaN(filter/1)) {
                            if (txtValue/1 < filter/1) {
                                //tr[i].style.display = "";
                                tempList.push(secondTableData.slice(1)[i-1]);
                            } 
                        }   
                    }
                }
                csvTable.update(tableData[0], tempList);
                tableData = [tableData[0]].concat(tempList);

            } else if (conditionIndex === 'gt') {
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[headerIndex];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (filter !== "" && !isNaN(filter/1)) {
                            if (txtValue/1 > filter/1) {
                                //tr[i].style.display = "";
                                tempList.push(secondTableData.slice(1)[i-1]);
                            }
                        }   
                    }
                }
                csvTable.update(tableData[0], tempList);
                tableData = [tableData[0]].concat(tempList);

            } else if (conditionIndex === 'neq') {
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[headerIndex];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (filter !== "" && !isNaN(filter/1)) {
                            if (txtValue/1 !== filter/1) {
                                //tr[i].style.display = "";
                                tempList.push(secondTableData.slice(1)[i-1]);
                            }
                        }
                    }
                }
                csvTable.update(tableData[0], tempList);
                tableData = [tableData[0]].concat(tempList);

            } else if (conditionIndex === 'eq') {
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[headerIndex];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (filter !== "" && !isNaN(filter/1)) {
                            if (txtValue/1 === filter/1) {
                                //tr[i].style.display = "";
                                tempList.push(secondTableData.slice(1)[i-1]);
                            } 
                        }
                    }
                }
                csvTable.update(tableData[0], tempList);
                tableData = [tableData[0]].concat(tempList);
            }

        }
        // Ensure view is constant also after searching
        onChange_viewMode();
    }
    
});


function applySorting() {
    headers = csvTable.table.querySelectorAll('th');
    tableBody = csvTable.table.querySelector('tbody');
    rows = tableBody.querySelectorAll('tr');

    [].forEach.call(headers, function (header, index) {
        header.addEventListener('click', function () {
            sortColumn(index);
        });
    });
}


// Populate dropdown with headers
function updateDropdown() {
    const dropdown = document.getElementById("selectColumn");
    dropdown.innerHTML = "";
    headers.forEach(function (header, index) {
        const option = document.createElement('option');
        option.value = index;
        option.innerHTML = header.innerHTML;
        dropdown.appendChild(option);
    } );
}


// Get dropdown menu header index
var e = document.getElementById("selectColumn");
function onChange_header() {
  headerIndex = e.value;
}
e.onchange= onChange_header;
onChange_header();

// Get dropdown menu header index
var c = document.getElementById("conditionalSearch");
function onChange_condition() {
  conditionIndex = c.value;
}
c.onchange = onChange_condition;
onChange_condition();


// change view mode of table
var viewMode = document.getElementById("viewMode");
function onChange_viewMode() {
    

    if (csvTable.table !== null) { 
        var tableDataCopy = tableData;
        if (viewMode.value === "table-all") {     
            csvTable.update(tableData[0], tableData.slice(1));
            tableData = tableDataCopy;
            applySorting();

        } else if (viewMode.value === "table-head") {
            csvTable.update(tableData[0], tableData.slice(1, 11));
            tableData = tableDataCopy;
            applySorting();

        } else if (viewMode.value === "table-tail") {
            csvTable.update(tableData[0], tableData.slice(tableData.length - 11, tableData.length));
            tableData = tableDataCopy;
            applySorting();

        } else if (viewMode.value === "table-preview") {
            var firstFive = tableData.slice(1, 6);
            var lastFive = tableData.slice(tableData.length - 6, tableData.length);
            csvTable.update(tableData[0], firstFive.concat(lastFive));
            tableData = tableDataCopy;
            applySorting();
        }
    }
}
viewMode.onchange = onChange_viewMode;


// Track the direction of sorting
const directions = Array.from(headers).map(function (header) {
    return '';
});


// Allow sorting of more than numbers
function transform(index, content) {
    const type = headers[index].getAttribute('data-type');
    switch (type) {
        case 'number':
            return parseFloat(content);
        case 'string':
        default:
            return content;
    }
};



function sortColumn(index) {

    // track direction
    const direction = directions[index] || 'asc';
    const multiplier = (direction === 'asc') ? 1 : -1;

    const newRows = Array.from(rows);

    // Sort rows by the content of cells
    newRows.sort(function (rowA, rowB) {
        const cellA = rowA.querySelectorAll('td')[index].innerHTML;
        const cellB = rowB.querySelectorAll('td')[index].innerHTML;
    
        // Transform the content of cells
        const a = transform(index, cellA);
        const b = transform(index, cellB);

        switch (true) {
            case a > b: return 1 * multiplier;
            case a < b: return -1 * multiplier;
            case a === b: return 0;
        }
    
        // And compare them
        switch (true) {
            case a > b:
                return 1;
            case a < b:
                return -1;
            case a === b:
                return 0;
        }
    });

    directions[index] = direction === 'asc' ? 'desc' : 'asc';

    // Remove old rows
    [].forEach.call(rows, function (row) {
        tableBody.removeChild(row);
    });

    // Append new row
    newRows.forEach(function (newRow) {
        tableBody.appendChild(newRow);
    });
};