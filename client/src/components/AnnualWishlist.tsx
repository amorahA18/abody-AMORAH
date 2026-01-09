import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Star, CheckCircle2, Circle, Trash2, Loader2, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";

interface WishItem {
  id: number;
  title: string;
  description: string;
  year: number;
  is_completed: boolean;
  priority: string;
}

interface AnnualWishlistProps {
  userId: number;
}

export default function AnnualWishlist({ userId }: AnnualWishlistProps) {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newWish, setNewWish] = useState({ title: '', description: '', priority: 'medium' });
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchWishes();
  }, [userId]);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('annual_wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('year', currentYear)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWish = async () => {
    if (!newWish.title.trim()) {
      toast.error("يرجى إدخال عنوان للأمنية 🎀");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('annual_wishlist')
        .insert([{
          ...newWish,
          year: currentYear,
          user_id: userId,
          is_completed: false
        }])
        .select();

      if (error) throw error;
      if (data) {
        setWishes([data[0], ...wishes]);
        toast.success("تمت إضافة أمنية جديدة! ✨");
      }
      setNewWish({ title: '', description: '', priority: 'medium' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding wish:', error);
      toast.error("فشل إضافة الأمنية");
    }
  };

  const toggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('annual_wishlist')
        .update({ is_completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setWishes(wishes.map(w => w.id === id ? { ...w, is_completed: !currentStatus } : w));
      if (!currentStatus) {
        toast.success("رائع! لقد حققت أمنية! 🌟");
      }
    } catch (error) {
      console.error('Error updating wish:', error);
    }
  };

  const deleteWish = async (id: number) => {
    if (!confirm('هل تريد حذف هذه الأمنية؟')) return;
    try {
      const { error } = await supabase
        .from('annual_wishlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWishes(wishes.filter(w => w.id !== id));
      toast.success("تم حذف الأمنية 🗑️");
    } catch (error) {
      console.error('Error deleting wish:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Star className="text-primary h-6 w-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-primary">أمنيات {currentYear}</h2>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="bg-primary hover:bg-primary/0 text-primary-foreground rounded-full h-10 w-10 shadow-md">
              <Plus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[2rem] border-4 border-primary/30 p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-primary text-center">أمنية جديدة ✨</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground mr-2">ماذا تتمنى؟</label>
                <Input
                  placeholder="عنوان الأمنية..."
                  value={newWish.title}
                  onChange={e => setNewWish({ ...newWish, title: e.target.value })}
                  className="rounded-2xl border-2 border-primary/20 focus:border-primary h-12 text-lg"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground mr-2">تفاصيل (اختياري)</label>
                <Textarea
                  placeholder="أخبرنا المزيد عن حلمك..."
                  value={newWish.description}
                  onChange={e => setNewWish({ ...newWish, description: e.target.value })}
                  className="rounded-2xl border-2 border-primary/20 focus:border-primary h-24"
                  dir="rtl"
                />
              </div>
              <Button onClick={addWish} className="w-full bg-primary text-primary-foreground font-black py-8 text-xl rounded-2xl shadow-xl border-b-4 border-primary/40">
                إضافة إلى القائمة ✨
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex flex-1 justify-center items-center py-8">
          <Loader2 className="animate-spin text-primary h-10 w-10" />
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {wishes.length === 0 ? (
            <div className="text-center py-12 bg-background/30 rounded-3xl border-2 border-dashed border-primary/10">
              <Sparkles className="mx-auto h-12 w-12 text-primary/20 mb-4 animate-pulse" />
              <p className="text-muted-foreground font-black italic">لا توجد أمنيات بعد..<br/>ابدأ بالحلم يا بطل! ✨</p>
            </div>
          ) : (
            wishes.map(wish => (
              <div 
                key={wish.id} 
                className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                  wish.is_completed 
                    ? 'bg-primary/5 border-primary/10 ' 
                    : 'dark:bg-slate-350 border-primary/10 hover:border-primary/30 hover:shadow-md hover:-translate-y-1'
                }`}
                
              >
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleComplete(wish.id, wish.is_completed)}
                    className={`transition-transform duration-300 hover:scale-125 ${wish.is_completed ? 'rotate-12' : ''}`}
                  >
                    {wish.is_completed ? (
                      <div className="bg-primary p-1 rounded-lg shadow-sm">
                        <CheckCircle2 className="text-white" size={20} />
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-350 p-1 rounded-lg border-primary/20">
                        <Circle className="text-primary/20 dark:text-gray-400" size={20} />
                      </div>
                    )}
                  </button>
                  <div className={wish.is_completed ? 'line-through text-muted-foreground' : ''}>
                    <h4 className="font-black text-foreground text-base">{wish.title}</h4>
                    {wish.description && <p className="text-xs font-medium text-muted-foreground mt-1">{wish.description}</p>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteWish(wish.id)}
                  className="text-muted-foreground/100 hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
                
                {!wish.is_completed && (
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-lg">✨</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
