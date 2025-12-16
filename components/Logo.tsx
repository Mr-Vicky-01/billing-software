import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClass = sizeMap[size];

  return (
    <Image
      src="/logo.png"
      alt="Sports Shop Logo"
      width={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
      height={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
      className={`${className} object-contain`}
    />
  );
}; export const LogoWithText: React.FC<LogoProps> = ({ size = 'md' }) => {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className={`${textSize} font-black tracking-tight bg-gradient-to-r from-blue-600 via-primary-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm`}>
        Sports Shop
      </span>
    </div>
  );
};
