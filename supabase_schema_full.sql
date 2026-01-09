-- Supabase Full Database Schema
-- Based on database_schema_report.pdf

-- 0. Custom Types
DO $$ BEGIN
    CREATE TYPE user_mode AS ENUM ('boys', 'girls');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE habit_type AS ENUM ('boolean', 'numeric');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    mode user_mode DEFAULT 'boys',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habits Table
CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type habit_type DEFAULT 'boolean',
    target_value NUMERIC DEFAULT 1
);

-- 3. Annual Wishlist Table
CREATE TABLE IF NOT EXISTS annual_wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    year INT,
    is_completed BOOLEAN DEFAULT FALSE,
    priority TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Stickers Corner Table
CREATE TABLE IF NOT EXISTS stickers_corner (
    id BIGSERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    sticker_name TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Habit Days Table
CREATE TABLE IF NOT EXISTS habit_days (
    id SERIAL PRIMARY KEY,
    habit_id INT REFERENCES habits(id) ON DELETE CASCADE,
    day DATE NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    value NUMERIC DEFAULT 0,
    UNIQUE(habit_id, day)
);

-- 6. Habit Metadata Table
CREATE TABLE IF NOT EXISTS habit_metadata (
    habit_id INT PRIMARY KEY REFERENCES habits(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_completions INT DEFAULT 0
);

-- 7. Moods Table
CREATE TABLE IF NOT EXISTS moods (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood_value INT CHECK (mood_value BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    context TEXT,
    UNIQUE(user_id, date)
);

-- 8. Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers_corner ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create Public Access Policies (For development simplicity as requested)
CREATE POLICY "Allow public access users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habits" ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access annual_wishlist" ON annual_wishlist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access stickers_corner" ON stickers_corner FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habit_days" ON habit_days FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habit_metadata" ON habit_metadata FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access moods" ON moods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access notes" ON notes FOR ALL USING (true) WITH CHECK (true);
