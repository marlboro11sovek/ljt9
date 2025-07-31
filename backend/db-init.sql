-- Створення таблиці jobs
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine TEXT,
    customer TEXT,
    part TEXT,
    quantity INTEGER,
    operator TEXT,
    plannedTime INTEGER,
    progress INTEGER DEFAULT 0
);

-- Стартовий запис
INSERT INTO jobs (machine, customer, part, quantity, operator, plannedTime, progress)
VALUES 
('GS-2800Y', 'Замовник А', 'Втулка Ø40', 100, 'Сторож Вадим', 480, 0);
