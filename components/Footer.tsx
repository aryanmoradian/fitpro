
import React from 'react';
import { Instagram, MessageCircle, Phone, ArrowUp, Mail, Send, MapPin, ExternalLink } from 'lucide-react';
import FPBadge from './FPBadge';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080a0f] text-gray-400 relative font-sans border-t border-white/5">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00B894] to-transparent opacity-30"></div>

      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-right">
          
          {/* Column 1: Official Emails */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#00B894] rounded-full shadow-[0_0_10px_#00B894]"></span>
              مکاتبات رسمی
            </h3>
            <div className="space-y-4">
              <a href="mailto:info@mokamelfitpro.ir" className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-[#00B894]/30 transition group">
                <div className="bg-[#00B894]/20 p-2.5 rounded-xl text-[#00B894] group-hover:scale-110 transition">
                  <Mail size={20} />
                </div>
                <span className="text-gray-300 group-hover:text-white font-mono text-sm tracking-wide">info@mokamelfitpro.ir</span>
              </a>
              
              <a href="mailto:info@mokamelpro.ir" className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-[#00B894]/30 transition group">
                <div className="bg-[#00B894]/20 p-2.5 rounded-xl text-[#00B894] group-hover:scale-110 transition">
                  <Mail size={20} />
                </div>
                <span className="text-gray-300 group-hover:text-white font-mono text-sm tracking-wide">info@mokamelpro.ir</span>
              </a>

              <a href="mailto:info@fit-pro.ir" className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-[#00B894]/30 transition group">
                <div className="bg-[#00B894]/20 p-2.5 rounded-xl text-[#00B894] group-hover:scale-110 transition">
                  <Mail size={20} />
                </div>
                <span className="text-gray-300 group-hover:text-white font-mono text-sm tracking-wide">info@fit-pro.ir</span>
              </a>
            </div>
          </div>

          {/* Column 2: Communication Channels */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full shadow-[0_0_10px_#FF6B35]"></span>
              کانال‌های ارتباطی
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <a href="https://wa.me/989981749697" className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition group">
                <div className="flex items-center gap-3">
                  <MessageCircle size={22} className="text-[#25D366]" />
                  <span className="text-gray-300 font-bold group-hover:text-white">واتساپ پشتیبانی</span>
                </div>
                <ExternalLink size={16} className="text-gray-500 group-hover:text-white opacity-50" />
              </a>

              <a href="#" className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#229ED9]/10 hover:border-[#229ED9]/30 transition group">
                <div className="flex items-center gap-3">
                  <Send size={22} className="text-[#229ED9]" />
                  <span className="text-gray-300 font-bold group-hover:text-white">کانال تلگرام</span>
                </div>
                <ExternalLink size={16} className="text-gray-500 group-hover:text-white opacity-50" />
              </a>

              <a href="tel:09981749697" className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/30 transition group">
                <div className="flex items-center gap-3">
                  <Phone size={22} className="text-[#FF6B35]" />
                  <div className="flex flex-col text-right">
                    <span className="text-gray-400 text-xs">تماس مستقیم</span>
                    <span className="text-white font-mono text-lg font-bold" dir="ltr">0998 174 9697</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Column 3: About Fit Pro */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
              فیت پرو
            </h3>
            
            <div className="bg-[#1E293B]/50 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00B894]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <FPBadge className="w-14 h-14" />
                <div>
                  <h4 className="text-xl font-black text-white">اکوسیستم فیت پرو</h4>
                  <span className="text-xs text-[#FF6B35] font-bold tracking-wide">تکنولوژی + دانش ورزشی</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-7 text-justify relative z-10">
                تلفیق دانش روز، مکمل‌های اورجینال و تکنولوژی هوشمند برای ساختن بهترین نسخه شما. ما در فیت پرو متعهد هستیم تا با ارائه ابزارهای دقیق و علمی، فاصله بین شما و اهدافتان را به حداقل برسانیم.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <a href="https://instagram.com/fitpro.ir" className="bg-white/5 p-2 rounded-lg hover:text-[#E1306C] transition"><Instagram size={20}/></a>
                <div className="text-xs text-gray-500 border-r border-white/10 pr-4 mr-2">
                  همراه هوشمند مسیر قهرمانی
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer Bottom / Copyright */}
        <div className="border-t border-white/5 mt-16 pt-10 text-center relative">
          <button onClick={scrollToTop} className="absolute left-1/2 -translate-x-1/2 -top-5 bg-[#1E293B] border border-white/10 hover:border-[#00B894] hover:text-[#00B894] text-white p-3 rounded-full shadow-xl transition-all duration-300 group">
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition" />
          </button>

          <div className="flex flex-col items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <p className="text-gray-300 font-bold text-sm">
              طراحی با عشق ❤️ توسط آریان مرادیان
            </p>
            <p className="text-[#00B894] text-xs font-mono tracking-wider">
              © 2026 تمامی حقوق برای اکوسیستم فیت پرو محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
