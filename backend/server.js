const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Database
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// ===== Jobs =====
app.get('/api/jobs', (req, res) => {
    db.all('SELECT * FROM jobs', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Confirmed job progress per day (calendar/statistics)
app.get('/api/statistics/jobs', (req, res) => {
    db.all('SELECT * FROM job_progress_per_day', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Downtime per day
app.get('/api/statistics/downtime', (req, res) => {
    db.all('SELECT * FROM downtime_per_day', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== Parts =====
app.get('/api/parts', (req, res) => {
    db.all('SELECT * FROM parts', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== Downtime =====
app.get('/api/downtime', (req, res) => {
    db.all('SELECT * FROM downtime', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/downtime', (req, res) => {
    const { jobId, operator, reason, duration, date } = req.body;
    db.run(
        'INSERT INTO downtime (jobId, operator, reason, duration, date) VALUES (?, ?, ?, ?, ?)',
        [jobId, operator, reason, duration, date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
