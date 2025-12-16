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
};export const LogoWithText: React.FC<LogoProps> = ({ size = 'md' }) => {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className="font-bold text-xl text-white">
        Sports Shop
      </span>
    </div>
  );
};
