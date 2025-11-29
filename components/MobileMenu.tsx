
import React from 'react';
import { X, Home, Activity, ShoppingBag, BookOpen, Users, Instagram, Phone } from 'lucide-react';
import FPBadge from './FPBadge';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'خانه', href: 'https://fit-pro.ir' },
    { icon: Activity, label: 'فرموله بدن (AI)', href: 'https://mokamelfitpro.ir', badge: 'جدید' },
    { icon: ShoppingBag, label: 'فروشگاه مکمل پرو', href: 'https://mokamelpro.ir' },
    { icon: BookOpen, label: 'مجله تخصصی', href: 'https://www.mokamelfitpro.ir/articles/' },
    { icon: Users, label: 'گروه آموزشی واتساپ', href: 'https://chat.whatsapp.com/JkWkKSmtesJ1QID0bgNry7' },
    { icon: Instagram, label: 'اینستاگرام فیت پرو', href: 'https://instagram.com/fitpro.ir' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FPBadge className="w-8 h-8" />
              <span className="font-bold text-gray-800">منوی دسترسی</span>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600 transition">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a 
                key={idx} 
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FF6B35]/10 text-gray-600 hover:text-[#FF6B35] transition-colors group"
              >
                <div className="bg-gray-100 group-hover:bg-white p-2 rounded-lg transition-colors shadow-sm">
                  <item.icon size={20} />
                </div>
                <span className="font-bold flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#00B894] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <a 
              href="tel:09981749697"
              className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Phone size={18} />
              <span>تماس فوری با پشتیبانی</span>
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default MobileMenu;
