

// ----------------------------------------------------------------------------------------------------------------------
// real code:- 

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Rupani@16",
  database: "users",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the login form!");
});

app.post("/register", (req, res) => {
  const createTableQuery =
    "CREATE TABLE IF NOT EXISTS users (fullname VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);";

  console.log("first");

  db.query(createTableQuery, function (error, results, fields) {
    if (error) throw error;
    console.log("The table has been created successfully.");
  });

  const { fullname, username, password } = req.body;
  const sql = `INSERT INTO users (fullname, username, password) VALUES ('${fullname}', '${username}', '${password}')`;
  const sql2 = `SELECT * FROM users WHERE username = ?`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json("Error saving user data");
    } else {
      console.log(result)
      console.log("User data saved successfully");
      db.query(sql2, [username], (err, result2) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(result2)
          res.status(200).json({ message: "User data saved successfully", user: result2[0] });
        }
      })
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json("Error fetching user data");
    }
    if (result.length > 0) {
      // console.log(result)
      const user = result[0];
      if (password === user.password) {
        // console.log("Login successful");
        // console.log(user)
        res.status(200).json({ message: "Login successful", user });
      } else {
        console.log("Password incorrect");
        res.status(401).json("Password incorrect");
      }
    } else {
      console.log("User not found");
      res.status(404).json("User not found");
    }
  });
});

app.get('/main', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// -------------------------------------------------------------------------------------------------
// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());

// // MySQL Connection
// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "#MYSQLPASSWORD#",
//   database: "users",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL database");
// });

// // Routes
// app.get("/", (req, res) => {
//   res.send("Welcome to the login form!");
// });

// app.post("/register", (req, res) => {
//   const createTableQuery =
//     "CREATE TABLE IF NOT EXISTS users (fullname VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);";

//   console.log("first");

//   db.query(createTableQuery, function (error, results, fields) {
//     if (error) throw error;
//     console.log("The table has been created successfully.");
//   });

//   const { fullname, username, password } = req.body;
//   const sql = `INSERT INTO users (fullname, username, password) VALUES ('${fullname}', '${username}', '${password}')`;

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
//   const { username, password } = req.body;
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

// app.post("/update-profile", (req, res) => {
//   const { username, fullname, newPassword } = req.body;
//   const sql = "UPDATE users SET fullname = ?, password = ? WHERE username = ?";
//   db.query(sql, [fullname, newPassword, username], (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json("Error updating user profile");
//     }
//     console.log("User profile updated successfully");
//     res.status(200).json("User profile updated successfully");
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
