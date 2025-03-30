const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // ✅ Remove trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sojin12#",
    database: "organdonation",
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL Connected...");
});
// Sample API Route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Server!");
});

//signups...................................................
app.post("/signupdonor", async (req, res) => {
  const { email, password ,name} = req.body;

  // Check if user exists
  db.query("SELECT * FROM Donor WHERE email = ?", [email], async (err, result) => {
    if (result.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO Donor (email, password,name) VALUES (?, ?,?)", [email, hashedPassword,name], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "donor registered" });
    });
  });
});
app.post("/signuphosp", async (req, res) => {
  const { email, password ,name} = req.body;

  // Check if user exists
  db.query("SELECT * FROM Hospital WHERE email = ?", [email], async (err, result) => {
    if (result.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO Hospital (email, password,name) VALUES (?, ?,?)", [email, hashedPassword,name], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "User registered" });
    });
  });
});

app.post("/signuprecp", async (req, res) => {
  const { email, password ,name} = req.body;

  // Check if user exists
  db.query("SELECT * FROM Recipient WHERE email = ?", [email], async (err, result) => {
    if (result.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO Recipient (email, password,name) VALUES (?, ?,?)", [email, hashedPassword,name], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "Reciepient  registered" });
    });
  });
});


//logins.................................................................................

app.post("/logindonor", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Donor WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    res.json({  
      userId: user.id ,
      username:user.name
    });
  });
});

app.post("/loginhospital", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Hospital WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    res.json({  
      userId: user.id ,
      username:user.name
    });
  });
});



app.post("/loginrecip", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Recipient WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({  
      userId: user.id ,
      username:user.name
    });
  });
});



//insertdonor............................
app.post("/insertdonor", async (req, res) => {
  try {
    const { donor_name, organ, hospital, status } = req.body;

    // Validate Input
    if (!donor_name || !organ || !hospital || !status) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Trim inputs

    
    const query = "INSERT INTO makedonation (donor_name, organ, hospital, status) VALUES (?, ?, ?, ?)";
    const values = [donor_name, organ, hospital, status];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Donor registered successfully", id: result.insertId });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//getting all donation...............................
app.get("/getmydonation", (req, res) => {
  const { username } = req.query;
  const query = "SELECT * FROM makedonation WHERE donor_name = ?";

  db.query(query,[username], (err, results) => {
      if (err) {
          console.error("Error fetching donations:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});


app.get("/getalldonationnotreserved", (req, res) => {
  
  const query = "SELECT * FROM makedonation WHERE status = ?";
  const status = "Available"; // Setting the status explicitly

  db.query(query, [status],(err, results) => {
      if (err) {
          console.error("Error fetching donations:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});


app.get("/getallrecipient", (req, res) => {
  const { username } = req.query;
  const query = "SELECT * FROM recipientlist WHERE name = ?";

  db.query(query, [username],(err, results) => {
      if (err) {
          console.error("Error fetching recipientlist:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});

//deleting  donation...............................
app.post("/deletedonation", async (req, res) => {
  try {
    const {id} = req.body;

    const query = "DELETE FROM makedonation WHERE id = ?";
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "donation deleted successfully"});
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/insertrecipient", async (req, res) => {
  try {
    const { donor_id, name, hospital } = req.body;

    // Validate Input
    if (!donor_id || !name || !hospital) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // SQL Queries
    const insertQuery = "INSERT INTO recipientlist (donationid, name, nameofthehospital) VALUES (?, ?, ?)";
    const updateQuery = "UPDATE makedonation SET status = 'Reserved' WHERE id = ?";

    const values = [donor_id, name, hospital];

    // Insert into recipient list
    db.query(insertQuery, values, (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Database error:", insertErr);
        return res.status(500).json({ message: "Database error" });
      }

      // Update makedonation status
      db.query(updateQuery, [donor_id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Database error in update:", updateErr);
          return res.status(500).json({ message: "Failed to update donation status" });
        }

        res.status(201).json({ message: "Recipient registered successfully", id: insertResult.insertId });
      });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/deletedonation", async (req, res) => {
  try {
    const {id} = req.body;

    const query = "DELETE FROM makedonation WHERE id = ?";
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "donation deleted successfully"});
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/deleterecipient", async (req, res) => {
  try {
    const { donor_id, id } = req.body;

    // SQL Queries
    const insertQuery = "DELETE FROM recipientlist WHERE id = ?";
    const updateQuery = "UPDATE makedonation SET status = 'Available' WHERE id = ?";

   

    // Insert into recipient list
    db.query(insertQuery, [id], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Database error:", insertErr);
        return res.status(500).json({ message: "Database error" });
      }

      // Update makedonation status
      db.query(updateQuery, [donor_id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Database error in update:", updateErr);
          return res.status(500).json({ message: "Failed to update donation status" });
        }

        res.status(201).json({ message: "Recipient deleted successfully" });
      });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/getrecipient", (req, res) => {
  const { hospitalname } = req.query;
  console.log(hospitalname)

  db.query("SELECT * FROM recipientlist WHERE nameofthehospital = ?",[hospitalname],(err, result) => {
    if (err) {
      console.error("Error fetching recipient list:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(result)
    res.status(201).json(result)
  });
});

//adminnnn.................................................
app.get("/getallrecipientadmin", (req, res) => {
  const { username } = req.query;
  const query = "SELECT id, name, nameofthehospital FROM recipientlist";

  db.query(query, [username],(err, results) => {
      if (err) {
          console.error("Error fetching recipientlist:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});

app.get("/getalldonationadmin", (req, res) => {
  const { username } = req.query;
  const query = "SELECT * FROM makedonation";

  db.query(query, [username],(err, results) => {
      if (err) {
          console.error("Error fetching donation:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});

app.get("/getallhospitals", (req, res) => {
  const { username } = req.query;
  const query = "SELECT id ,name FROM Hospital";

  db.query(query, [username],(err, results) => {
      if (err) {
          console.error("Error fetching donation:", err);
          return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
  });
});




// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});