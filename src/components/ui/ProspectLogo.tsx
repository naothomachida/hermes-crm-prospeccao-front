import React from 'react';

interface ProspectLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProspectLogo: React.FC<ProspectLogoProps> = ({ size = 'md', className = "" }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xl rounded-md',
    md: 'w-9 h-9 text-xl rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.2)]',
    lg: 'w-12 h-12 text-2xl rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.15)]',
    xl: 'w-24 h-24 text-6xl rounded-2xl shadow-[0_0_50_rgba(255,215,0,0.1)]'
  };

  return (
    <div className={`bg-[#FFD700] flex items-center justify-center font-black text-black italic ${sizes[size]} ${className}`}>
      p
    </div>
  );
};
