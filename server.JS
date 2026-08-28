const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve frontend static files from the root project directory
app.use(express.static(path.join(__dirname, '.')));

// Connect to SQLite database (creates 'farm.db' locally in your project folder)
const dbPath = path.join(__dirname, './farm.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite farm database.');
    }
});

// Enable foreign key support and create all core tables automatically
db.serialize(() => {
    db.run(`PRAGMA foreign_keys = ON;`);
    

    // 1. Animals Table
    db.run(`CREATE TABLE IF NOT EXISTS animals (
        animal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_number TEXT UNIQUE NOT NULL,
        species TEXT NOT NULL,
        breed TEXT,
        gender TEXT,
        purpose TEXT NOT NULL,
        birth_date TEXT,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    // 2. Poultry Batches Table
    db.run(`CREATE TABLE IF NOT EXISTS poultry_batches (
        batch_id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_name TEXT NOT NULL,
        breed TEXT,
        initial_count INTEGER NOT NULL,
        current_count INTEGER NOT NULL,
        purpose TEXT NOT NULL,
        arrival_date TEXT NOT NULL,
        status TEXT DEFAULT 'Active'
    );`);

    // 3. Health Records Table
    db.run(`CREATE TABLE IF NOT EXISTS health_records (
        health_id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        batch_id INTEGER,
        event_type TEXT NOT NULL,
        description TEXT,
        medication_used TEXT,
        cost REAL DEFAULT 0.0,
        event_date TEXT NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES poultry_batches(batch_id) ON DELETE CASCADE
    );`);

    // 4. Production Records Table
    db.run(`CREATE TABLE IF NOT EXISTS production_records (
        production_id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        batch_id INTEGER,
        metric_type TEXT NOT NULL,
        quantity REAL NOT NULL,
        recording_date TEXT NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES poultry_batches(batch_id) ON DELETE CASCADE
    );`);

    // 5. Feed Inventory Table
    db.run(`CREATE TABLE IF NOT EXISTS feed_inventory (
        feed_id INTEGER PRIMARY KEY AUTOINCREMENT,
        feed_name TEXT NOT NULL,
        category TEXT NOT NULL,
        stock_quantity_kg REAL NOT NULL,
        unit_cost REAL NOT NULL
    );`);

    // 6. Feeding Schedules Table
    db.run(`CREATE TABLE IF NOT EXISTS feeding_schedules (
        ration_id INTEGER PRIMARY KEY AUTOINCREMENT,
        feed_id INTEGER NOT NULL,
        target_section TEXT NOT NULL,
        daily_quantity_kg REAL NOT NULL,
        FOREIGN KEY (feed_id) REFERENCES feed_inventory(feed_id) ON DELETE CASCADE
    );`);

    // Create a database view for summary or recent production logs
    db.run(`
        CREATE VIEW IF NOT EXISTS v_production_summary AS
        SELECT 
            production_id AS id,
            metric_type,
            quantity,
            recording_date
        FROM production_records
        ORDER BY recording_date DESC;
    `, (err) => {
        if (err) {
            console.error("Error creating database view:", err.message);
        } else {
            console.log("Database view 'v_production_summary' is ready.");
        }
    });

    // 7. Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_info TEXT,
        action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 8. Users Table for Authentication
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );`, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table is ready.");
            
            // Automatically insert default user securely on setup
            db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['enidnamakula61@gmail.com', 'Uthuman1816'], (insertErr) => {
                if (!insertErr) {
                    console.log("Default user account verified/created.");
                }
            });
        }
    });
});

// Test route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Farm Management API is running successfully!' });
});

// Register a new user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    
    db.run(query, [username, password], function(err) {
        if (err) {
            res.status(400).json({ message: 'Error: Username already exists or invalid data.' });
        } else {
            res.json({ message: 'User registered successfully!', userId: this.lastID });
        }
    });
});

// Login route that checks the SQLite database
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Database error.' });
        } else if (row) {
            res.json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});