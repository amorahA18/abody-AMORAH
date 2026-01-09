import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, Bot, Heart } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  userName?: string;
  userType?: 'male' | 'female';
}

const AI_RESPONSES = [
  'هذا رائع جداً! استمر في بذل الجهد وستحقق أهدافك قريباً! ✨',
  'أنا فخور بك! تقدمك مذهل حقاً. 🌟',
  'لا تستسلم! كل يوم خطوة نحو النجاح. 💪',
  'عظيم! أنت تفعل عملاً رائعاً في تتبع عاداتك. 🎀',
  'استمر هكذا! النجاح يأتي للمثابرين. 🚀',
  'أنت تسير في الطريق الصحيح! تابع معنا. 🌈',
  'رائع! هذه هي روح المثابرة التي نحتاجها. 🔥',
  'شكراً على مشاركتك أفكارك معي! سأساعدك دائماً. 💕',
];

export default function AIChat({ userName = 'تيجا', userType = 'female' }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const initializeChat = () => {
    const initialMessage: Message = {
      id: '1',
      text: `مرحباً ${userName}! أنا هنا لمساعدتك في تتبع عاداتك وتحقيق أهدافك. كيف يمكنني مساعدتك اليوم؟ ✨`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent/20 p-2 rounded-xl">
          <Sparkles className="text-accent h-6 w-6" />
        </div>
        <h3 className="text-2xl font-black text-primary">مساعدي اللطيف</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/30 rounded-3xl border-2 border-primary/5 mb-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm flex gap-3 ${
              msg.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tl-none font-bold' 
                : 'bg-white text-foreground rounded-tr-none border-2 border-primary/10 font-bold'
            }`}>
              <div className="shrink-0 mt-1">
                {msg.sender === 'user' ? <User size={18} /> : <Heart size={18} className="text-primary fill-current" />}
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white text-foreground p-4 rounded-2xl rounded-tr-none border-2 border-primary/10">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="اسألني أي شيء... ✨"
          className="rounded-2xl border-2 border-primary/10 focus:border-primary h-14 bg-white font-bold"
          dir="rtl"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !inputValue.trim()} 
          size="icon" 
          className="bg-primary hover:bg-primary/80 text-primary-foreground h-14 w-14 rounded-2xl shadow-lg shrink-0 transition-transform active:scale-90"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
}
