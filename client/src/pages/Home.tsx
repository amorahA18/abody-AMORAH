import React, { useState, useEffect } from 'react';
import HabitTable from '@/components/HabitTable';
import MoodSelector from '@/components/MoodSelector';
import DailyNotes from '@/components/DailyNotes';
import AIChat from '@/components/AIChat';
import AnnualWishlist from '@/components/AnnualWishlist';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Sparkles } from 'lucide-react';

export default function Home() {
  const [userId, setUserId] = useState<number>(2);
  const { theme, toggleTheme } = useTheme();

  const userType = userId === 1 ? 'male' : 'female';
  const displayName = userId === 1 ? 'ريوجي' : 'تيجا';

  useEffect(() => {
    const savedUser = localStorage.getItem('selectedUserId');
    if (savedUser) setUserId(parseInt(savedUser));
  }, []);

  const handleUserChange = (id: string) => {
    setUserId(parseInt(id));
    localStorage.setItem('selectedUserId', id);
  };

  return (
    <div
      className="
        min-h-screen relative overflow-x-hidden font-sans pb-32
        bg-[url('/images/star1.png')]
        dark:bg-[url('/images/star.png')]
        bg-repeat bg-[length:250px_250px] bg-fixed
        transition-colors duration-500
      "
    >
      {/* طبقة زجاجية عامة فوق الخلفية */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10">
        {/* Header - تم زيادة المسافات الجانبية والعلوية */}
        <header className="max-w-7xl mx-auto px-6 py-10 mb-8 md:mb-40">
          <div className="
            scrapbook-card
            flex flex-col md:flex-row justify-between items-center 
            gap-8 md:gap-12 /* مسافة واضحة بين اللوجو والقائمة المنسدلة */
            bg-white/60 dark:bg-black/50
            backdrop-blur-200xl
            border border-white/40 dark:border-white/10
            shadow-xl shadow-black/5
            p-8 md:p-10 /* زيادة الحشوة الداخلية للهيدر */
            rounded-[2.5rem]
          ">
           <div className="flex items-center gap-6 md:gap-8">
  <img
    src="/images/chibi_hand_holding.png"
    alt="Chibi Hand Holding"
    className="
      h-50 w-50 md:h-20 md:w-20
      object-contain
      rotate-3
      drop-shadow-xl
      transition-transform
      hover:rotate-0 hover:scale-105
    "
  />

  <div className="space-y-2">
    <h1 className="text-5xl md:text-6xl font-black text-primary tracking-tighter text-center md:text-right">
      A18
    </h1>
    <p className="text-lg font-bold text-muted-foreground/80 text-center md:text-right">
      مرحباً بك في عالمك اللطيف،{' '}
      <span className="text-primary underline decoration-wavy decoration-accent/30">
        {displayName}
      </span>
    </p>
  </div>
</div>


            <div className="flex items-center gap-4 md:gap-6">
<Button
  variant="ghost"
  size="icon"
  onClick={toggleTheme}
  className="
    h-14 w-14 md:h-16 md:w-16
    rounded-2xl md:rounded-3xl
    bg-white/60 dark:bg-black/60
    backdrop-blur-xl
    border border-white/40 dark:border-white/10
    hover:scale-110
    transition-all
  "
>
  {theme === 'light' ? (
    <Moon
      size={26}
      className="
        text-slate-700
        hover:text-indigo-500
        transition-colors
      "
    />
  ) : (
    <Sun
      size={26}
      className="
        text-amber-300
        hover:text-amber-400
        transition-colors
      "
    />
  )}
</Button>


              <Select value={userId.toString()} onValueChange={handleUserChange}>
                <SelectTrigger
                  className="
                    w-44 md:w-56 h-14 md:h-16 rounded-2xl md:rounded-3xl font-black
                    bg-white/50 dark:bg-black/50
                    backdrop-blur-xl border border-white/40
                    text-base md:text-lg px-6
                  "
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl md:rounded-3xl p-2">
                  <SelectItem value="2" className="text-right py-3 cursor-pointer">🎀 نمط تيجا</SelectItem>
                  <SelectItem value="1" className="text-right py-3 cursor-pointer">⭐ نمط ريوجي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
          
          {/* Habit Table Section - مسافة معزولة للمخطط الرئيسي */}
          <section className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
                <HabitTable userId={userId} />
            </div>
          </section>

          {/* Grid Layout - توزيع المسافات بين البطاقات الجانبية */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            
            {/* Left Column (Mood & Notes) */}
            <div className="lg:col-span-8 space-y-10 md:space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="
                  scrapbook-card p-6 md:p-8
                  bg-white/50 dark:bg-black/50 backdrop-blur-xl
                  border border-white/40 dark:border-white/10
                  shadow-lg rounded-[2.5rem]
                ">
                  <MoodSelector userId={userId} userType={userType} />
                </div>

                <div className="
                  scrapbook-card p-6 md:p-8
                  bg-white/50 dark:bg-black/50 backdrop-blur-xl
                  border border-white/40 dark:border-white/10
                  shadow-lg rounded-[2.5rem]
                ">
                  <DailyNotes userId={userId} />
                </div>
              </div>
            </div>

            {/* Right Column (Wishlist & AI) */}
            <div className="lg:col-span-4 space-y-10 md:space-y-16">
              <div className="
                scrapbook-card p-6 md:p-8
                bg-white/50 dark:bg-black/50 backdrop-blur-xl
                border border-white/40 dark:border-white/10
                shadow-lg rounded-[2.5rem]
              ">
                <AnnualWishlist userId={userId} />
              </div>

              <div className="
                scrapbook-card sticky top-12
                p-6 md:p-8
                bg-white/60 dark:bg-black/60 backdrop-blur-2xl
                border-2 border-primary/20
                shadow-2xl shadow-primary/5 rounded-[2.5rem]
              ">
                <AIChat userName={displayName} userType={userType} />
              </div>
            </div>
          </div>
        </main>

        {/* Footer - زيادة التباعد العلوي والحشوة */}
        <footer className="max-w-7xl mx-auto px-6 mt-24 md:mt-40">
          <div className="
            scrapbook-card text-center
            bg-white/40 dark:bg-black/40
            backdrop-blur-xl border border-white/30
            p-12 md:p-16 rounded-[3rem]
            shadow-inner
          ">
            <h2 className="text-4xl font-black text-primary mb-4">A18💕</h2>
            <p className="text-xl italic text-muted-foreground max-w-md mx-auto leading-relaxed">
              صُنع بكل حب ليكون رفيقك في رحلة التغيير اللطيفة ✨
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}