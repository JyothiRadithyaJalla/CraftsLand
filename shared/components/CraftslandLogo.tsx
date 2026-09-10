import React from 'react';

interface CraftslandLogoProps {
  variant?: 'primary' | 'monogram' | 'light' | 'dark' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CraftslandLogo: React.FC<CraftslandLogoProps> = ({
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { crest: 'w-7 h-7', title: 'text-lg', tag: 'text-[7px]' },
    md: { crest: 'w-10 h-10', title: 'text-2xl', tag: 'text-[9px]' },
    lg: { crest: 'w-14 h-14', title: 'text-3xl', tag: 'text-[10px]' },
    xl: { crest: 'w-20 h-20', title: 'text-5xl', tag: 'text-xs' },
  };

  const isLight = variant === 'light';

  // Vector Leaf & C Emblem
  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size].crest}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
      >
        <defs>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9F3D8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C7853" />
          </linearGradient>
          <linearGradient id="darkInk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2028" />
            <stop offset="100%" stopColor="#0B0C10" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring with subtle notches */}
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke={isLight ? '#12141C' : 'url(#logoGold)'}
          strokeWidth="1.5"
          strokeOpacity={isLight ? '0.8' : '0.4'}
        />
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={isLight ? '#12141C' : 'url(#logoGold)'}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          strokeOpacity={isLight ? '0.4' : '0.6'}
        />

        {/* Stylized Sculpted "C" */}
        <path
          d="M42 22.5C39.5 18.5 35 16.5 30.5 17C22.5 17.8 17 24.2 17 32C17 39.8 22.8 46.2 30.8 47C36 47.5 41 44.5 43 40C43.5 38.8 42.4 37.8 41.2 38.3C38.2 39.8 34.5 40 31.5 38.5C26 35.8 24.5 29.5 27.5 24C29.5 20.5 33.5 19 37.2 20.2C38.5 20.6 39.8 21.4 41 22.8C41.8 23.7 42.8 23.8 43.2 22.8C43.4 22.3 42.8 21.5 42 22.5Z"
          fill={isLight ? '#12141C' : 'url(#logoGold)'}
        />

        {/* Botanical Culinary Leaf Accent at Apex */}
        <path
          d="M34 22.5C38 20.5 44.5 21.5 47.5 25.5C45.5 28 41.5 30 36.5 28.5C35.2 26 34 24 34 22.5Z"
          fill={isLight ? '#12141C' : 'url(#logoGold)'}
          opacity="0.95"
        />
        <path
          d="M36 28C40 25 44 23.5 47.5 25.5"
          stroke={isLight ? '#FFFFFF' : '#0B0C10'}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (variant === 'monogram' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-bold tracking-[0.18em] leading-none uppercase ${
            isLight
              ? 'text-[#0B0C10]'
              : 'text-gold-gradient drop-shadow-[0_1px_8px_rgba(212,175,55,0.2)]'
          } ${sizeMap[size].title}`}
        >
          CRAFTSLAND
        </span>
        <span
          className={`font-sans tracking-[0.24em] font-medium uppercase mt-1 ${
            isLight ? 'text-gray-600' : 'text-amber-200/70'
          } ${sizeMap[size].tag}`}
        >
          Good Food Brighter Moods
        </span>
      </div>
    </div>
  );
};
