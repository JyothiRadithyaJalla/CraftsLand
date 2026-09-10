import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  label = "Preparing Culinary Experience...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border border-b-[#8C7853] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase animate-pulse">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0B0C10]/95 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
