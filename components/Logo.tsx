import React from 'react';
import FPBadge from './FPBadge';

const Logo = ({ className = '', textClassName = '' }: { className?: string, textClassName?: string }) => (
  <div className={`flex items-center ${className}`}>
    <FPBadge className="w-10 h-10" />
    <span className={`mr-3 text-2xl font-black tracking-wider text-white ${textClassName}`}>
      فیت پرو
    </span>
  </div>
);

export default Logo;