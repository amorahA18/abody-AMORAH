import { createClient } from '@supabase/supabase-js';

// ملاحظة: في بيئة التطوير الحقيقية، يفضل استخدام متغيرات البيئة
// ولكن هنا سنبقيها كما هي لضمان عمل المشروع مباشرة مع بيانات المستخدم
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yuoskdxgfmfuspwtfxli.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hEAc8dTlGmfelhrqd6pErw_bJKvVvC1'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
