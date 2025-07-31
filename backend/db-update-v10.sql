-- Додати нові колонки до таблиці jobs
ALTER TABLE jobs ADD COLUMN note TEXT;
ALTER TABLE jobs ADD COLUMN shiftHours INTEGER;
ALTER TABLE jobs ADD COLUMN confirmed INTEGER DEFAULT 0;
