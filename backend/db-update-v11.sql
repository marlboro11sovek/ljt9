-- Каталог деталей
CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    allowedMachines TEXT,
    timePerPiece INTEGER
);

-- Таблиця простоїв
CREATE TABLE IF NOT EXISTS downtime (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobId INTEGER,
    operator TEXT,
    reason TEXT,
    duration INTEGER,
    date TEXT,
    FOREIGN KEY (jobId) REFERENCES jobs(id)
);-- Каталог деталей
CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    allowedMachines TEXT,
    timePerPiece INTEGER
);

-- Таблиця простоїв
CREATE TABLE IF NOT EXISTS downtime (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobId INTEGER,
    operator TEXT,
    reason TEXT,
    duration INTEGER,
    date TEXT,
    FOREIGN KEY (jobId) REFERENCES jobs(id)
);
