-- 1. تنظيف البيانات القديمة (اختياري ولكن يفضل للبدء من جديد)
TRUNCATE users, habits, annual_wishlist, stickers_corner, habit_days, habit_metadata, moods, notes CASCADE;

-- 2. إدراج المستخدمين المحددين فقط
INSERT INTO users (id, username, mode) VALUES 
(1, 'Ryuuji', 'boys'),
(2, 'Taiga', 'girls')
ON CONFLICT (username) DO NOTHING;

-- 3. حذف جدول الملصقات كما طلب المستخدم
DROP TABLE IF EXISTS stickers_corner;

-- 4. التأكد من وجود سياسات الوصول العام (للتطوير)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access users" ON users;
DROP POLICY IF EXISTS "Allow public access habits" ON habits;
DROP POLICY IF EXISTS "Allow public access annual_wishlist" ON annual_wishlist;
DROP POLICY IF EXISTS "Allow public access habit_days" ON habit_days;
DROP POLICY IF EXISTS "Allow public access habit_metadata" ON habit_metadata;
DROP POLICY IF EXISTS "Allow public access moods" ON moods;
DROP POLICY IF EXISTS "Allow public access notes" ON notes;

CREATE POLICY "Allow public access users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habits" ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access annual_wishlist" ON annual_wishlist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habit_days" ON habit_days FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access habit_metadata" ON habit_metadata FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access moods" ON moods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access notes" ON notes FOR ALL USING (true) WITH CHECK (true);
