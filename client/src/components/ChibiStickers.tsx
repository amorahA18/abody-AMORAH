import React from 'react';

const STICKER_IMAGES = [
  '/images/taiga-happy.png',
  '/images/ryuuji-happy.png',
  '/images/tiga-excited.png',
  '/images/ryuuji-excited.png',
  '/images/tiga-calm.png',
  '/images/ryuuji-calm.png',
  '/images/chibi-boy-happy.png',
  '/images/couple-hug.png',
  
];

const DECORATIONS = ['✨', '⭐', '🎀', '💖', '🌸', '☁️', '🍭', '🌈'];

export default function ChibiStickers() {
  const getPositionClasses = (index: number) => {
    const positions = [
      'top-[10%] left-[2%]',
      'top-[20%] right-[2%]',
      'top-[40%] left-[1%]',
      'top-[60%] right-[1%]',
      'bottom-[10%] left-[2%]',
      'bottom-[20%] right-[2%]',
      'top-[5%] right-[20%]',
      'bottom-[5%] left-[20%]',
    ];
    return positions[index % positions.length];
  };

  const getDecorPosition = (index: number) => {
    const positions = [
      'top-[15%] left-[15%]',
      'top-[25%] right-[25%]',
      'top-[45%] left-[10%]',
      'top-[65%] right-[15%]',
      'bottom-[15%] left-[10%]',
      'bottom-[25%] right-[10%]',
      'top-[5%] left-[40%]',
      'bottom-[5%] right-[40%]',
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Anime Character Stickers */}
      {STICKER_IMAGES.map((image, index) => (
        <div
          key={`sticker-${index}`}
          className={`absolute ${getPositionClasses(index)} opacity-20 hover:opacity-40 transition-opacity duration-700 animate-float`}
          style={{ animationDelay: `${index * 0.8}s` }}
        >
          <img
            src={image}
            alt="chibi sticker"
            className={`w-24 h-24 md:w-48 md:h-48 object-contain filter drop-shadow-lg ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}
          />
        </div>
      ))}

      {/* Floating Decorations */}
      {DECORATIONS.map((emoji, index) => (
        <div
          key={`decor-${index}`}
          className={`absolute ${getDecorPosition(index)} text-4xl md:text-6xl opacity-10 animate-sparkle`}
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}
