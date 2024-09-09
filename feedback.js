const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const cors = require('cors')

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Create MySQL connection
const connection = mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Rupani@16',
    database: 'feedback'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Define a route to handle form submission
app.post('/submit-feedback', (req, res) => {
    // Extract data from the request
    const { firstname, lastname, email, number, first_report, experience} = req.body;

    const createTableQuery = "CREATE TABLE IF NOT EXISTS feedback (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, number VARCHAR(20) NOT NULL, first_report varchar(100) NOT NULL, experience varchar(555) NOT NULL);";

    connection.query(createTableQuery, function (error, results, fields) {
        if (error) throw error;
        console.log("The table has been created successfully.");
      });

    // Insert feedback into MySQL database
    const sql = 'INSERT INTO feedback (firstname, lastname, email, number,first_report,experience) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [firstname, lastname, email, number,first_report,experience], (err, result) => {
        if (err) {
            console.error('Error inserting feedback into MySQL:', err);
            res.status(500).send('Error saving feedback');
        } else {
            console.log('Feedback saved successfully');
            res.status(200).json('Feedback saved successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});