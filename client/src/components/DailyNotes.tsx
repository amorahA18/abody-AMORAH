import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";
import { Save, Loader2, NotebookPen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyNotesProps {
  userId: number;
}

export default function DailyNotes({ userId }: DailyNotesProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayNotes();
  }, [userId]);

  const fetchTodayNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setNotes(data.content || '');
      else setNotes('');
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .upsert({
          user_id: userId,
          date: today,
          content: notes,
        }, { onConflict: 'user_id,date' });

      if (error) throw error;
      toast.success("تم حفظ ملاحظاتك اللطيفة! ✨");
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error("فشل حفظ الملاحظات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent/20 p-2 rounded-xl">
          <NotebookPen className="text-accent h-6 w-6" />
        </div>
        <h3 className="text-2xl font-black text-primary">مذكراتي اليومية</h3>
      </div>
      
      {loading ? (
        <div className="flex flex-1 justify-center items-center py-8">
          <Loader2 className="animate-spin text-primary h-10 w-10" />
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="relative flex-1 mb-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="كيف كان يومك المليء بالإنجازات؟ ✨"
              dir="rtl"
              className="w-full h-48 p-6 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none font-bold text-foreground placeholder-muted-foreground/50 bg-background/30 transition-all text-lg leading-relaxed"
            />
            <div className="absolute bottom-4 left-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
              {notes.length} / 500
            </div>
            <div className="absolute -top-3 -right-3 text-2xl animate-sparkle">✨</div>
          </div>
          
          <Button 
            onClick={handleSaveNotes} 
            disabled={saving || loading}
            className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-black py-6 rounded-2xl shadow-lg border-b-4 border-accent/40 transition-all active:translate-y-1 active:border-b-0"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
            حفظ المذكرة ✨
          </Button>
        </div>
      )}
    </div>
  );
}
