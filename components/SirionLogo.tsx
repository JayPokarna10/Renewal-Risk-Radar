import React from 'react';

interface SirionLogoProps {
  className?: string;
}

export const SirionLogo: React.FC<SirionLogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`${className} bg-white rounded-md flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="text-sirion-midnight font-bold text-xl font-sans leading-none select-none pt-0.5">S</span>
    </div>
  );
};