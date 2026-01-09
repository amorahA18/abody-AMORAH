-- Seed Data for Supabase
-- Run this after running supabase_schema_full.sql

-- 1. Insert a default user
INSERT INTO users (username, mode) 
VALUES ('default_user', 'boys')
ON CONFLICT (username) DO NOTHING;

-- 2. Insert default habits for the user
-- We assume the user ID is 1 for this example
INSERT INTO habits (user_id, name, category, type)
VALUES 
(1, 'الصلاة', 'spirituality', 'boolean'),
(1, 'القراءة', 'learning', 'boolean'),
(1, 'الرياضة', 'daily', 'boolean'),
(1, 'شرب الماء', 'daily', 'numeric')
ON CONFLICT DO NOTHING;

-- 3. Insert some sample habit completions
INSERT INTO habit_days (habit_id, day, status, value)
VALUES 
(1, CURRENT_DATE, true, 1),
(2, CURRENT_DATE, true, 1),
(3, CURRENT_DATE, false, 0),
(4, CURRENT_DATE, true, 8)
ON CONFLICT DO NOTHING;

-- 4. Insert a sample mood
INSERT INTO moods (user_id, date, mood_value, context)
VALUES (1, CURRENT_DATE, 5, 'يوم رائع ومثمر!')
ON CONFLICT DO NOTHING;

-- 5. Insert a sample note
INSERT INTO notes (user_id, date, content)
VALUES (1, CURRENT_DATE, 'اليوم بدأت باستخدام متتبع العادات الجديد.')
ON CONFLICT DO NOTHING;
