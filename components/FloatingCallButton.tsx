
import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingCallButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/989981749697"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-6 z-50 group"
      aria-label="Contact Support"
    >
      <div className="relative">
        {/* Ripple Effect */}
        <div className="absolute inset-0 bg-[#00B894] rounded-full animate-ping opacity-75"></div>
        
        {/* Main Button */}
        <div className="relative bg-[#00B894] hover:bg-[#00a382] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer">
          <MessageCircle size={28} className="fill-current" />
        </div>

        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-bold pointer-events-none">
          مشاوره واتساپ
          <div className="absolute top-1/2 right-full -translate-y-1/2 -mr-1 border-4 border-transparent border-r-white"></div>
        </div>
      </div>
    </a>
  );
};

export default FloatingCallButton;
