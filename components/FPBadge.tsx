import React from 'react';

const FPBadge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="fp-gradient-badge" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#24FF81"/>
        <stop offset="1" stopColor="#0076FF"/>
      </linearGradient>
    </defs>
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#fp-gradient-badge)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 15.5L14.5 9.5H11.5L11.5 6.5L7.5 12.5H10.5L10.5 15.5Z" fill="url(#fp-gradient-badge)"/>
  </svg>
);

export default FPBadge;