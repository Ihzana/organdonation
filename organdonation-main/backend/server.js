// Import dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Database Connection Pooling
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Sojin12#",
    database: "organdonation",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied! No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token!" });
        req.user = user;
        next();
    });
};

// Signup Route
const registerUser = (table) => async (req, res) => {
    const { email, password, name } = req.body;
    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
        if (result.length > 0) return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(`INSERT INTO ${table} (email, password, name) VALUES (?, ?, ?)`, [email, hashedPassword, name], (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.status(201).json({ message: "User registered successfully" });
        });
    });
};
app.post("/signup/donor", registerUser("Donor"));
app.post("/signup/hospital", registerUser("Hospital"));
app.post("/signup/recipient", registerUser("Recipient"));

// Login Route
const loginUser = (table) => (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) return res.status(400).json({ message: "User not found" });
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ id: user.id, role: table }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user.id, username: user.name });
    });
};
app.post("/login/donor", loginUser("Donor"));
app.post("/login/hospital", loginUser("Hospital"));
app.post("/login/recipient", loginUser("Recipient"));

// Insert Donation
app.post("/donation", authenticateToken, (req, res) => {
    const { donor_name, organ, hospital, status } = req.body;
    if (!donor_name || !organ || !hospital || !status) return res.status(400).json({ message: "All fields are required!" });
    db.query("INSERT INTO makedonation (donor_name, organ, hospital, status) VALUES (?, ?, ?, ?)", [donor_name, organ, hospital, status], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ message: "Donation registered successfully" });
    });
});

// Get Donations
app.get("/donations", authenticateToken, (req, res) => {
    db.query("SELECT * FROM makedonation WHERE status = 'Available'", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
    });
});

// Delete Donation
app.delete("/donation/:id", authenticateToken, (req, res) => {
    db.query("DELETE FROM makedonation WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json({ message: "Donation deleted successfully" });
    });
});

// Get All Hospitals
app.get("/hospitals", authenticateToken, (req, res) => {
    db.query("SELECT id, name FROM Hospital", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
    });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
