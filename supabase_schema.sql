-- قم بتشغيل هذا الكود في SQL Editor الخاص بـ Supabase (الرابط الذي أرسلته)

CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  days JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل سياسات الوصول (RLS) - للتبسيط سنسمح بالوصول العام حالياً
-- يمكنك تعديل هذه السياسات لاحقاً لزيادة الأمان
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access" ON habits
  FOR ALL
  USING (true)
  WITH CHECK (true);
