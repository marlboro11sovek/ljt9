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

app.post('/api/jobs', (req, res) => {
    const { machine, customer, part, quantity, operator, plannedTime } = req.body;
    db.run(
        'INSERT INTO jobs (machine, customer, part, quantity, operator, plannedTime, progress) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [machine, customer, part, quantity, operator, plannedTime, 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.put('/api/jobs/:id/progress', (req, res) => {
    const { id } = req.params;
    const { progress, note, shiftHours } = req.body;

    db.run(
        'UPDATE jobs SET progress = ?, note = ?, shiftHours = ?, confirmed = 0 WHERE id = ?',
        [progress, note, shiftHours, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

app.put('/api/jobs/:id/confirm', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE jobs SET confirmed = 1 WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ confirmed: this.changes });
    });
});

app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM jobs WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// ===== Parts =====
app.get('/api/parts', (req, res) => {
    db.all('SELECT * FROM parts', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/parts', (req, res) => {
    const { name, description, allowedMachines, timePerPiece } = req.body;
    db.run(
        'INSERT INTO parts (name, description, allowedMachines, timePerPiece) VALUES (?, ?, ?, ?)',
        [name, description, allowedMachines, timePerPiece],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
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
