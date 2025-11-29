
import React, { useState, useEffect } from 'react';
import { Menu, LogIn, PhoneCall } from 'lucide-react';
import FPBadge from './FPBadge';

interface HeaderProps {
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      
      setScrollProgress(Number(scroll));
      setIsScrolled(totalScroll > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Standard Header Style
  const headerClass = `sticky top-0 z-40 transition-all duration-300 border-b border-white/5 shadow-md ${
    isScrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-xl h-20 shadow-lg' : 'bg-[#232323] h-24'
  }`;

  return (
    <header className={headerClass}>
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#00B894] via-[#0076FF] to-[#FF6B35] transition-all duration-150 z-50" style={{ width: `${scrollProgress * 100}%` }} />

      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Right: Logo */}
        <div className="flex items-center gap-4">
          <FPBadge className={`transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`} />
          <div className="hidden min-[400px]:flex flex-col text-right">
            <span className="text-2xl font-black text-white leading-none tracking-tight">فیت پرو</span>
            <span className="text-[11px] text-[#00B894] font-bold tracking-wide mt-1">اکوسیستم هوشمند ورزشی</span>
          </div>
        </div>

        {/* Center: Desktop Menu with Standard Spacing */}
        <nav className="hidden lg:flex items-center gap-10 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-sm">
            <a href="#" className="text-gray-300 hover:text-white font-bold text-sm transition relative group px-2">
              خانه
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full"></span>
            </a>
            <a href="#plans" className="text-gray-300 hover:text-white font-bold text-sm transition relative group px-2">
              تعرفه‌ها
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full"></span>
            </a>
            <a href="https://mokamelpro.ir" target="_blank" className="text-gray-300 hover:text-white font-bold text-sm transition relative group px-2">
              فروشگاه
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white font-bold text-sm transition relative group px-2">
              مقالات
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full"></span>
            </a>
        </nav>

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Quick Contact Module (Desktop) */}
          <a 
            href="tel:09981749697"
            className="hidden md:flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-orange-900/20 transform hover:-translate-y-0.5"
          >
            <PhoneCall size={18} />
            <span>تماس فوری</span>
          </a>

          {/* Quick Contact Icon (Mobile) */}
          <a 
            href="tel:09981749697"
            className="md:hidden p-3 bg-[#FF6B35]/20 text-[#FF6B35] rounded-xl hover:bg-[#FF6B35] hover:text-white transition"
          >
            <PhoneCall size={20} />
          </a>

          {/* Auth Button */}
          <button 
            onClick={() => window.location.reload()} 
            className="hidden md:flex items-center gap-2 bg-[#00B894]/10 hover:bg-[#00B894]/20 text-[#00B894] px-5 py-2.5 rounded-xl font-bold transition border border-[#00B894]/30"
          >
            <LogIn size={18} />
            <span>ورود / ثبت نام</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button onClick={onOpenMenu} className="p-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition lg:hidden" aria-label="Open Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
