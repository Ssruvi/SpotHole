// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.json());

// app.use(cors());

// // MySQL Connection
// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "#MYSQLPASSWORD#",
//   database: "forms",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL database");
// });

// // Routes
// app.get("/reportform", (req, res) => {
//   res.send("Welcome to the Reporting form!");
// });

// app.post("/register", (req, res) => {
//   const createTableQuery =
//     "CREATE TABLE IF NOT EXISTS users (fullname VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);";

//   console.log("first");

//   db.query(createTableQuery, function (error, results, fields) {
//     if (error) throw error;
//     console.log("The table has been created successfully.");
//   });

//   const { firstname, lastname, email, number,location,severity } = req.body;
//   const sql = `INSERT INTO users (firstname, lastname, email, number,location,severity ) VALUES ('${firstname}', '${lastname}', '${email}', '${number}', '${location}','${severity}')`;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       res.status(500).json("Error saving user data");
//     } else {
//       console.log("User data saved successfully");
//       res.status(200).json("User data saved successfully");
//     }
//   });
// });

// app.post("/login", (req, res) => {
//   const {firstname, lastname, email, number,location,severity   } = req.body;
//   const sql = "SELECT * FROM users WHERE username = ?";
//   db.query(sql, [username], (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json("Error fetching user data");
//     }
//     if (result.length > 0) {
//       const user = result[0];
//       if (password === user.password) {
//         console.log("Login successful");
//         res.status(200).json("Login successful");
//       } else {
//         console.log("Password incorrect");
//         res.status(401).json("Password incorrect");
//       }
//     } else {
//       console.log("User not found");
//       res.status(404).json("User not found");
//     }
//   });
// });

// app.get('/main', (req, res) => {
//   res.sendFile(__dirname + '/main.html');
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer')

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log(req.body.firstname)
    console.log(req.body.lastname)
    const uniqueSuffix = req.body.firstname + "-" + req.body.lastname + '-' + file.originalname
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

// MySQL Connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Rupani@16",
  database: "forms" // Change the database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the reporting form!");
});

app.post("/submit-report", upload.single('image'), (req, res) => {
  const createTableQuery =
    "CREATE TABLE IF NOT EXISTS reports (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, number VARCHAR(20) NOT NULL, myDate date NOT NULL ,location varchar(100) NOT NULL, section varchar(255) NOT NULL, severity varchar(20) NOT NULL);";

  db.query(createTableQuery, function (error, results, fields) {
    if (error) throw error;
    console.log("The table has been created successfully.");
  });

  const { firstname, lastname, email, number, myDate, location, section, severity } = req.body;
  // console.log(req.body.severity)
  const sql = `INSERT INTO reports (firstname, lastname, email, number, myDate, location ,section, severity) VALUES (?, ?,   ?, ?,?, ?, ?,?)`;

  db.query(sql, [firstname, lastname, email, number, myDate, location, section, severity], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json("Error saving report data");
    } else {
      console.log("Report data saved successfully");
      res.status(200).json("Report data saved successfully");
    }
  });
});

app.post('/getUsers', (req, res) => {
  const { month, year } = req.body;
  const query = `
    SELECT *
    FROM reports
    WHERE MONTH(myDate) = ? AND YEAR(myDate) = ?
  `;
  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/getReportData/:username', (req, res) => {
  const { username } = req.params
  const sql = 'SELECT * FROM reports WHERE email = ?'

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.status(200).json({ message: "Report Data Fetched Successfully", user: result });
    }
  })
})

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// app.post('/getlocation', (req, res) => {
//   const {location} = req.body;
//   const query = `
//     SELECT *
//     FROM reports
//     WHERE location = ?
//   `;
//   db.query(query, [location], (err, results) => {
//     if (err) {
//       console.error('Error querying database:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.status(200).json(results);
//   });
// });
