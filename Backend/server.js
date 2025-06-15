const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your frontend HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Create or open the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('❌ Failed to connect to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Create "users" table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        password TEXT,
        userType TEXT
    )
`);

// Handle signup form POST
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, userType } = req.body;

    if (!firstName || !lastName || !email || !password || !userType) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = `
        INSERT INTO users (firstName, lastName, email, password, userType)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [firstName, lastName, email, password, userType], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: 'Email already exists!' });
            }
            return res.status(500).json({ error: 'Database error' });
        }

        return res.status(200).json({ message: 'Signup successful!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
