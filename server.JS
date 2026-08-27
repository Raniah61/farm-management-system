<<<<<<< HEAD
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve frontend static files if you put them in a 'public' folder later
app.use(express.static(path.join(__dirname, '../public')));

// Connect to SQLite database (creates 'farm.db' in your root folder)
const dbPath = path.join(__dirname, '../farm.db');
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

    // 7. Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_info TEXT,
        action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error("Error creating tables:", err.message);
        } else {
            console.log("All farm management tables are successfully created/verified!");
        }
    });
});

// Test route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Farm Management API is running successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
=======
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve frontend static files if you put them in a 'public' folder later
app.use(express.static(path.join(__dirname, '../public')));

// Connect to SQLite database (creates 'farm.db' in your root folder)
const dbPath = path.join(__dirname, '../farm.db');
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

    // 7. Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_info TEXT,
        action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error("Error creating tables:", err.message);
        } else {
            console.log("All farm management tables are successfully created/verified!");
        }
    });
});

// Test route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Farm Management API is running successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
>>>>>>> 261ea5962531d809f5e43bea0407a4a38318f2a3
