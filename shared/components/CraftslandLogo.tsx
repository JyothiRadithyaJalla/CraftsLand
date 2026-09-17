import React from 'react';

interface CraftslandLogoProps {
  variant?: 'primary' | 'monogram' | 'light' | 'dark' | 'compact' | 'burgundy' | 'burgundy-invert' | 'navy' | 'teal' | 'green' | 'fresh' | 'green-invert';
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

  let primaryColor = '#15803D';
  let titleColor = 'text-[#111A15]';
  let tagColor = 'text-[#15803D]';

  if (variant === 'green' || variant === 'fresh' || variant === 'primary') {
    primaryColor = '#15803D';
    titleColor = 'text-[#111A15]';
    tagColor = 'text-[#15803D]';
  } else if (variant === 'green-invert') {
    primaryColor = '#22C55E';
    titleColor = 'text-[#FAF9F5]';
    tagColor = 'text-[#22C55E]';
  } else if (variant === 'burgundy') {
    primaryColor = '#6B1D2A';
    titleColor = 'text-[#1C1917]';
    tagColor = 'text-[#6B1D2A]';
  } else if (variant === 'burgundy-invert') {
    primaryColor = '#D9777F';
    titleColor = 'text-[#FAF7F2]';
    tagColor = 'text-[#D9777F]';
  } else if (variant === 'navy') {
    primaryColor = '#0F172A';
    titleColor = 'text-[#0F172A]';
    tagColor = 'text-[#1E3A5F]';
  } else if (variant === 'teal') {
    primaryColor = '#0D474A';
    titleColor = 'text-[#0F2424]';
    tagColor = 'text-[#0D474A]';
  } else if (variant === 'dark') {
    primaryColor = '#22C55E';
    titleColor = 'text-white';
    tagColor = 'text-[#22C55E]';
  } else if (variant === 'light') {
    primaryColor = '#111A15';
    titleColor = 'text-[#111A15]';
    tagColor = 'text-[#15803D]';
  }

  // Vector Leaf & C Emblem
  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size].crest}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke={primaryColor}
          strokeWidth="1.75"
          strokeOpacity="0.8"
        />
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={primaryColor}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          strokeOpacity="0.5"
        />
        <path
          d="M42 22.5C39.5 18.5 35 16.5 30.5 17C22.5 17.8 17 24.2 17 32C17 39.8 22.8 46.2 30.8 47C36 47.5 41 44.5 43 40C43.5 38.8 42.4 37.8 41.2 38.3C38.2 39.8 34.5 40 31.5 38.5C26 35.8 24.5 29.5 27.5 24C29.5 20.5 33.5 19 37.2 20.2C38.5 20.6 39.8 21.4 41 22.8C41.8 23.7 42.8 23.8 43.2 22.8C43.4 22.3 42.8 21.5 42 22.5Z"
          fill={primaryColor}
        />
        <path
          d="M34 22.5C38 20.5 44.5 21.5 47.5 25.5C45.5 28 41.5 30 36.5 28.5C35.2 26 34 24 34 22.5Z"
          fill={primaryColor}
          opacity="0.95"
        />
        <path
          d="M36 28C40 25 44 23.5 47.5 25.5"
          stroke="#FFFFFF"
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
          className={`font-serif font-bold tracking-[0.18em] leading-none uppercase ${titleColor} ${sizeMap[size].title}`}
        >
          CRAFTSLAND
        </span>
        <span
          className={`font-sans tracking-[0.24em] font-semibold uppercase mt-1 ${tagColor} ${sizeMap[size].tag}`}
        >
          Good Food Brighter Moods
        </span>
      </div>
    </div>
  );
};
