import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Star, Heart, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";

interface Habit {
  id: number;
  name: string;
  category: string;
  type: 'boolean' | 'numeric';
  target_value: number;
  completions: Record<string, { status: boolean; value: number }>;
}

const CATEGORIES = {
  daily: 'عاداتي اليومية ✨',
  spirituality: 'الجانب الروحي 🌙',
  learning: 'تطوير الذات 📚',
  selfcare: 'العناية بالنفس 🎀',
  goals: 'أهداف لطيفة 🌟',
};

interface HabitTableProps {
  userId: number;
}

export default function HabitTable({ userId }: HabitTableProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<keyof typeof CATEGORIES>('daily');
  const [newHabitType, setNewHabitType] = useState<'boolean' | 'numeric'>('boolean');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const { data: habitsData, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${daysInMonth}`;

      const habitIds = (habitsData || []).map(h => h.id);
      let daysData: any[] = [];

      if (habitIds.length > 0) {
        const { data } = await supabase
          .from('habit_days')
          .select('*')
          .in('habit_id', habitIds)
          .gte('day', startDate)
          .lte('day', endDate);

        daysData = data || [];
      }

      const habitsWithDays = (habitsData || []).map(habit => {
        const completions: Record<string, { status: boolean; value: number }> = {};
        daysData
          .filter(d => d.habit_id === habit.id)
          .forEach(d => {
            completions[d.day] = { status: d.status, value: d.value };
          });

        return { ...habit, completions };
      });

      setHabits(habitsWithDays);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = async (habitId: number, dayNum: number) => {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentStatus = habit.completions[dayStr]?.status || false;
    const newStatus = !currentStatus;

    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              completions: {
                ...h.completions,
                [dayStr]: { status: newStatus, value: newStatus ? 1 : 0 }
              }
            }
          : h
      )
    );

    await supabase.from('habit_days').upsert({
      habit_id: habitId,
      day: dayStr,
      status: newStatus,
      value: newStatus ? 1 : 0
    }, { onConflict: 'habit_id,day' });
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return toast.error("يرجى إدخال اسم العادة");
    setIsSubmitting(true);

    try {
      const { data } = await supabase
        .from('habits')
        .insert([{ name: newHabitName, category: newHabitCategory, type: newHabitType, user_id: userId, target_value: 1 }])
        .select();

      if (data) {
        setHabits([...habits, { ...data[0], completions: {} }]);
        setNewHabitName('');
        setIsOpen(false);
        toast.success("تمت الإضافة ✨");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHabit = async (habitId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه العادة؟')) return;
    await supabase.from('habits').delete().eq('id', habitId);
    setHabits(habits.filter(h => h.id !== habitId));
  };

  const completionPercent = (habit: Habit) =>
    Math.round((Object.values(habit.completions).filter(c => c.status).length / daysInMonth) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-12">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  return (
    <div
      className="
        scrapbook-card relative
        bg-white/60 dark:bg-black/50
        border border-white/40 dark:border-white/10
        text-foreground
      "
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-primary flex items-center gap-2">
          <Sparkles className="text-accent" />
          مخطط العادات الكاواي
        </h2>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6 font-bold">
              <Plus className="mr-2" /> إضافة عادة
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-black rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-black">عادة جديدة ✨</DialogTitle>
            </DialogHeader>

            <Input
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              className="my-4 bg-background"
              placeholder="اسم العادة"
              dir="rtl"
            />

            <Button onClick={addHabit} disabled={isSubmitting} className="w-full font-black">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'إضافة إلى عالمي ✨'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(CATEGORIES).map(([key, label]) => {
        const items = habits.filter(h => h.category === key);
        if (!items.length) return null;

        return (
          <div key={key} className="mb-12">
            <h3 className="text-xl font-black mb-4 text-primary">{label}</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <tbody>
                  {items.map(habit => (
                    <tr key={habit.id} className="group">
                      <td className="bg-white/50 dark:bg-black/40 p-4 rounded-r-2xl">
                        <div className="font-black text-lg">{habit.name}</div>
                        <div className="mt-2 h-3 bg-white dark:bg-white/10 rounded-full overflow-hidden border border-primary/10">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                            style={{ width: `${completionPercent(habit)}%` }}
                          />
                        </div>
                      </td>

                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                        const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const done = habit.completions[date]?.status;

                        return (
                          <td key={d} className="text-center">
                            <button
                              onClick={() => toggleDay(habit.id, d)}
                              className={`
                                w-8 h-8 rounded-xl flex items-center justify-center
                                transition-all transform hover:scale-125 active:scale-90
                                ${done
                                  ? 'bg-primary text-primary-foreground shadow-md rotate-12'
                                  : 'bg-white dark:bg-white/10 border border-primary/10'}
                              `}
                            >
                              {done ? (
                                key === 'spirituality'
                                  ? <Star size={16} fill="currentColor" />
                                  : <Heart size={16} fill="currentColor" />
                              ) : (
                                <div className="w-1 h-1 bg-primary/20 rounded-full" />
                              )}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-2">
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 p-2 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
