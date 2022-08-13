import tableWrapper from "./lib/tableWrapper.js";


const mainTable = document.querySelector("#mainTable");
const csvInput = document.querySelector("#csvInput");
const csvTable = new tableWrapper(mainTable);

var headers = [];
var tableBody;
var rows = [];
var headerIndex = 0;
var conditionIndex = 'match';


csvInput.addEventListener("change", function() {
    Papa.parse(csvInput.files[0], {
        delimiter: ",",
        skipEmptyLines: true,
        complete: results => {
            csvTable.update(results.data[0], results.data.slice(1));
            headers = csvTable.table.querySelectorAll('th');

            // Loop over the headers
            [].forEach.call(headers, function (header, index) {
                header.addEventListener('click', function () {
                    sortColumn(index);
                });
            });
   
            tableBody = csvTable.table.querySelector('tbody');
            rows = tableBody.querySelectorAll('tr');
           
            // Populate dropdown with headers
            updateDropdown();
            // ensure the header selected works imidately after loading the table
            onChange_header();
        }

    });

});


const searchBar = document.getElementById('searchBar');

// Searchbar, only active if csv file has been loaded
searchBar.addEventListener('keyup', function () {
    var filter, tr, td, i, txtValue;
    filter = searchBar.value;
    headerIndex = 0;
    if (csvTable.table !== null) { 
        tr = csvTable.table.getElementsByTagName("tr");

        if (conditionIndex === 'match') {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[headerIndex];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        } else if (conditionIndex === 'lt') {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[headerIndex];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (filter !== "" && !isNaN(filter/1)) {
                        if (txtValue/1 < filter/1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        } else if (conditionIndex === 'gt') {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[headerIndex];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (filter !== "" && !isNaN(filter/1)) {
                        if (txtValue/1 > filter/1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        } else if (conditionIndex === 'neq') {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[headerIndex];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (filter !== "" && !isNaN(filter/1)) {
                        if (txtValue/1 !== filter/1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        } else if (conditionIndex === 'eq') {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[headerIndex];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (filter !== "" && !isNaN(filter/1)) {
                        if (txtValue/1 === filter/1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
     }
});


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