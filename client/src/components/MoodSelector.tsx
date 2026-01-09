import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";
import { Save, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodSelectorProps {
  userId: number;
  userType: 'male' | 'female';
}

const MOODS_MAPPING: Record<'male' | 'female', any[]> = {
  female: [
    { id: 6, label: 'غاضب', image: '/images/taiga-angry.png', emoji: '💢' },
    { id: 5, label: 'سعيد', image: '/images/tiga-happy.png', emoji: '✨' },
    { id: 4, label: 'متحمس', image: '/images/tiga-excited.png', emoji: '🌟' },
    { id: 3, label: 'هادئ', image: '/images/tiga-calm.png', emoji: '☁️' },
    { id: 2, label: 'متعب', image: '/images/tiga-tired.png', emoji: '💤' },
    { id: 1, label: 'حزين', image: '/images/tiga-sad.png', emoji: '💧' },
  ],
  male: [
    { id: 6, label: 'غاضب', image: '/images/ryuuji-angry.png', emoji: '💢' },
    { id: 5, label: 'سعيد', image: '/images/ryuuji-happy.png', emoji: '✨' },
    { id: 4, label: 'متحمس', image: '/images/ryuuji-excited.png', emoji: '🌟' },
    { id: 3, label: 'هادئ', image: '/images/ryuuji-calm.png', emoji: '☁️' },
    { id: 2, label: 'متعب', image: '/images/ryuuji-tired.png', emoji: '💤' },
    { id: 1, label: 'حزين', image: '/images/ryuuji-sad.png', emoji: '💧' },
  ]
};

export default function MoodSelector({ userId, userType }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayMood();
  }, [userId]);

  const fetchTodayMood = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('mood_value')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSelectedMood(data.mood_value);
      else setSelectedMood(null);
    } catch (error) {
      console.error('Error fetching mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMood = async () => {
    if (selectedMood === null) {
      toast.error("يرجى اختيار مزاج أولاً 🎀");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('moods')
        .upsert({
          user_id: userId,
          date: today,
          mood_value: selectedMood,
        }, { onConflict: 'user_id,date' });

      if (error) throw error;
      toast.success("تم حفظ مزاجك اليوم! ✨");
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast.error("فشل حفظ المزاج");
    } finally {
      setSaving(false);
    }
  };

  const currentMoods = MOODS_MAPPING[userType];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-xl">
          <Heart className="text-primary h-6 w-6 fill-current" />
        </div>
        <h3 className="text-2xl font-black text-primary">مزاجي اليوم</h3>
      </div>
      
      {loading ? (
        <div className="flex flex-1 justify-center items-center py-8">
          <Loader2 className="animate-spin text-primary h-10 w-10" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {currentMoods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
                selectedMood === mood.id
                  ? 'bg-primary/20 border-2 border-primary scale-105 shadow-md'
                  : 'bg-background/50 border-2 border-transparent hover:bg-primary/10'
              }`}
            >
              <div className="relative">
                <img
                  src={mood.image}
                  alt={mood.label}
                  className={`w-16 h-16 object-contain transition-transform duration-300 ${
                    selectedMood === mood.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                {selectedMood === mood.id && (
                  <div className="absolute -top-2 -right-2 text-xl animate-bounce">{mood.emoji}</div>
                )}
              </div>
              <span className="text-xs font-black text-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <Button 
          onClick={handleSaveMood} 
          disabled={saving || loading}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-black py-6 rounded-2xl shadow-lg border-b-4 border-primary/40 transition-all active:translate-y-1 active:border-b-0"
        >
          {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
          حفظ الحالة المزاجية ✨
        </Button>
      </div>
    </div>
  );
}
