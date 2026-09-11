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
        <div className="absolute inset-0 rounded-full border-2 border-[#B84A32]/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#B84A32] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border border-b-[#C85A3A] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="font-serif text-sm tracking-widest text-[#B84A32] uppercase animate-pulse">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0D0B09]/95 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
