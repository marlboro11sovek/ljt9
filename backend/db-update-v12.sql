-- Представлення (VIEW) для підрахунку виконаних деталей по датах
CREATE VIEW IF NOT EXISTS job_progress_per_day AS
SELECT 
    date('now') AS work_date, 
    operator, 
    SUM(progress * quantity / 100) AS completed_parts
FROM jobs
WHERE confirmed = 1
GROUP BY operator, work_date;

-- Представлення для простоїв по датах
CREATE VIEW IF NOT EXISTS downtime_per_day AS
SELECT 
    date, 
    operator, 
    SUM(duration) AS total_downtime
FROM downtime
GROUP BY operator, date;
