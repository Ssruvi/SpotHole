// const imageTextContainers = document.querySelectorAll('.news-text-container');

// imageTextContainers.forEach(container => {
//   container.addEventListener('click', () => {
//     const image = container.querySelector('img');
//     const text = container.querySelector('p');
    
//     image.classList.toggle('slide-up'); // Add/remove class with styles
//     text.classList.toggle('show-text');  // Add/remove class with styles
//   });
// });


// -----------------------------------------------------------------


// const yearSelect = document.getElementById('year');
// const monthSelect = document.getElementById('month');
// const dataTable = document.getElementById('data-table');


// -----------------------------------------------------------------
// function populateYears() {
//   let currentYear = new Date().getFullYear();
//   for (let i = currentYear - 10; i <= currentYear; i++) {
//     const option = document.createElement('option');
//     option.value = i;
//     option.text = i;
//     yearSelect.appendChild(option);
//   }
// }

// populateYears();


// function showData() {
//   const month = monthSelect.value;
//   const year = yearSelect.value;
  
//   // Replace this with your logic to fetch data based on month and year
//   const data = [
//     ["Column 1", "Column 2", "Column 3"],
//     ["Data 1", "Data 2", "Data 3"],
//   ];

//   dataTable.innerHTML = '';
//   const tableHead = document.createElement('thead');
//   const tableRow = document.createElement('tr');
//   for (const col of data[0]) {
//     const tableHeaderCell = document.createElement('th');
//     tableHeaderCell.textContent = col;
//     tableRow.appendChild(tableHeaderCell);
//   }
//   TableHead.appendChild(tableRow);
//   dataTable.appendChild(TableHead);

//   const tableBody = document.createElement('tbody');
//   for (let i = 1; i < data.length; i++) {
//     const tableRow = document.createElement('tr');
//     for (const col of data[i]) {
//       const tableBodyCell = document.createElement('td');
//       tableBodyCell.textContent = col;
//       tableRow.appendChild(tableBodyCell);
//     }
//     tableBody.appendChild(tableRow);
//   }
//   dataTable.appendChild(tableBody);
// }

// -----------------------------------------------------------------


function showData() {
  var selectedMonth = document.getElementById('month').value;
  var selectedYear = parseInt(document.getElementById('year').value);
  
  var filteredData = dynamicData.filter(function(item) {
      return item.month === selectedMonth && item.year === selectedYear;
  });
  
  var container = document.getElementById('dataContainer');
  container.innerHTML = ''; // Clear previous data
  
  if (filteredData.length > 0) {
      // Create table element
      var table = document.createElement('table');
      
      // Create table header row
      var headerRow = table.insertRow();
      var headers = ['ID', 'First Name', 'Last Name', 'Email', 'Number',  'Location', 'Severity'];
      headers.forEach(function(headerText) {
          var headerCell = document.createElement('th');
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
      });
      
      // Populate table with data
      filteredData.forEach(function(item) {
          var row = table.insertRow();
          var rowData = [item.id, item.firstname, item.lastname, item.email, item.number ,item.location, item.severity];
          rowData.forEach(function(cellData) {
              var cell = row.insertCell();
              cell.textContent = cellData;
          });
      });
      
      // Append table to container
      container.appendChild(table);
  } else {
      container.textContent = 'No data available for the selected month and year.';
  }
}


// -----------------
const app = express();

// Handle form submission
app.post('/show_reports', (req, res) => {
    // Assuming you are using body-parser middleware to parse POST request body
    const selectedYear = req.body.year;
    const selectedMonth = req.body.month;

    // Construct SQL query
    const sql = `SELECT * 
                 FROM reports 
                 WHERE YEAR(date_column) = ? 
                 AND MONTH(date_column) = ?`;

    // Execute SQL query
    pool.query(sql, [selectedYear, selectedMonth], (err, results) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Send fetched reports as response
        res.json(results);
    });
});
