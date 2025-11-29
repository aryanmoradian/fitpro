
import React, { useState } from 'react';
import { 
    BarChart2, Dumbbell, Apple, Trophy, Package, TrendingUp, 
    ClipboardCheck, Link as LinkIcon, ShieldCheck, Users, CheckCircle2, ArrowRight
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import FloatingCallButton from './FloatingCallButton';
import FPBadge from './FPBadge';

interface HomePageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogin, onRegister }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const featureModules = [
    { icon: Dumbbell, title: 'مدیریت تمرینات', desc: 'طراحی برنامه، ثبت رکوردها و تحلیل حجم تمرینی.', link: '#' },
    { icon: BarChart2, title: 'آنالیز پیشرفته', desc: 'نمودارهای دقیق پیشرفت و شاخص‌های آمادگی جسمانی.', link: '#' },
    { icon: Apple, title: 'تغذیه هوشمند', desc: 'محاسبه ماکروها، کالری‌شماری و پیشنهادات غذایی.', link: '#' },
    { icon: Users, title: 'ارتباط با مربی', desc: 'دریافت برنامه و بازخورد مستقیم از مربی اختصاصی.', link: '#' },
    { icon: Trophy, title: 'سیستم گیمیفیکیشن', desc: 'کسب امتیاز، ارتقای سطح و دریافت نشان‌های افتخار.', link: '#' },
    { icon: Package, title: 'فروشگاه مکمل', desc: 'دسترسی سریع به مکمل‌های اورجینال و تایید شده.', link: 'https://mokamelfitpro.ir' },
  ];
  
  const whyFitProItems = [
    { icon: TrendingUp, title: 'رشد سریع‌تر', text: 'با تحلیل داده‌ها، نقاط ضعف خود را بشناسید و سریع‌تر پیشرفت کنید.' },
    { icon: ClipboardCheck, title: 'نظم و دقت', text: 'همه چیز ثبت شده و منظم است. دیگر هیچ تمرینی فراموش نمی‌شود.' },
    { icon: LinkIcon, title: 'ارتباط موثر', text: 'فاصله بین مربی و ورزشکار به حداقل می‌رسد.' },
    { icon: ShieldCheck, title: 'اطمینان و امنیت', text: 'داده‌های شما امن است و به محصولات معتبر دسترسی دارید.' }
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#1F1F1F] font-sans selection:bg-[#FF6B35] selection:text-white flex flex-col dir-rtl">
      
      {/* 1. Header & Mobile Menu */}
      <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="relative bg-[#0B0F17] text-white pt-24 pb-32 px-6 overflow-hidden flex flex-col justify-center min-h-[80vh]">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00B894]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF6B35]/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="container max-w-5xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <FPBadge className="w-24 h-24 drop-shadow-[0_0_25px_rgba(0,184,148,0.6)]" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
              اکوسیستم حرفه‌ای <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B894] to-[#00A382]">فیت پرو</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              دستیابی به بدن ایده‌آل با فیت پرو
            </h2>
            
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              تلفیق دانش ورزشی و تکنولوژی روز. با فیت پرو، از راهنمایی‌های هوشمند و پیشرفته بهره‌مند شوید و پیشرفت خود را هر روز بهتر کنید.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <button 
                onClick={onLogin} 
                className="w-full sm:w-auto bg-gradient-to-r from-[#00B894] to-[#008f72] hover:from-[#00a382] hover:to-[#007a61] text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-green-900/40"
              >
                ورود به پنل کاربری
              </button>
              <button 
                onClick={onRegister}
                className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all transform hover:-translate-y-1 backdrop-blur-sm"
              >
                ثبت‌نام رایگان
              </button>
            </div>
          </div>
        </section>

        {/* --- PROMO MODULE (NEW) --- */}
        <section className="py-16 px-6 bg-gray-50">
            <div className="container max-w-4xl mx-auto">
                <div className="bg-white border-2 border-[#FF8C00] rounded-3xl p-8 md:p-12 text-center shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FF8C00]"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF8C00]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-[#333] mb-4">آیا آماده‌ای برای ارتقای پیشرفت خود؟</h2>
                    <p className="text-lg md:text-xl text-[#666] mb-8 max-w-2xl mx-auto leading-relaxed">
                        با فیت پرو، درصد موفقیت و پیشرفت شما تا <span className="text-[#FF8C00] font-bold text-2xl">۲۶٪</span> افزایش می‌یابد. امتحان کنید و نتایج خود را ببینید!
                    </p>
                    <button 
                        onClick={onRegister}
                        className="bg-[#FF8C00] hover:bg-[#ff6e00] text-white font-bold text-lg px-10 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30 flex items-center justify-center mx-auto"
                    >
                        شروع آزمایشی <ArrowRight className="mr-2 h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="py-24 px-6 bg-white">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#1F1F1F] mb-4">امکانات پلتفرم</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">ابزارهای قدرتمند برای مدیریت کامل سبک زندگی ورزشی شما</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureModules.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link} 
                  className="flex flex-col items-center text-center bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00B894]/30 hover:-translate-y-2 group"
                >
                  <div className="bg-[#00B894]/10 text-[#00B894] w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00B894] group-hover:text-white transition-colors duration-300">
                    <item.icon size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#00B894] transition-colors">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY FIT PRO --- */}
        <section className="py-24 px-6 bg-gray-50 relative">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#1F1F1F] mb-4">چرا ورزشکاران فیت پرو را انتخاب می‌کنند؟</h2>
              <p className="text-gray-500 text-lg">تفاوت در جزئیات و نگاه علمی به ورزش است</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyFitProItems.map((item, index) => (
                <div key={index} className="flex items-start gap-5 p-6 rounded-2xl bg-white hover:bg-white hover:shadow-lg border border-gray-100 transition-all duration-300">
                  <div className="shrink-0 bg-gray-50 p-3 rounded-xl shadow-sm text-[#FF6B35]">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- DASHBOARD PREVIEW & TICKER --- */}
        <section className="py-24 px-6 bg-[#0B0F17] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          
          <div className="container max-w-7xl mx-auto relative z-10">
            {/* Ticker */}
            <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-16 flex items-center mb-16 overflow-hidden relative">
              <div className="ticker-move flex items-center gap-12 px-4 whitespace-nowrap text-gray-300 font-medium">
                 {/* Content repeated for smooth loop */}
                 {[1,2,3].map(i => (
                   <React.Fragment key={i}>
                     <span className="flex items-center gap-2"><TrendingUp size={18} className="text-[#00B894]"/> امتیاز امروز: ۳۵۰</span>
                     <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#00B894]"/> تمرین سینه: تکمیل شد</span>
                     <span className="flex items-center gap-2"><TrendingUp size={18} className="text-[#FF6B35]"/> آمادگی بدنی: +۱۲٪</span>
                     <span className="flex items-center gap-2"><Apple size={18} className="text-[#FF6B35]"/> رژیم غذایی: ۹۵٪ رعایت</span>
                   </React.Fragment>
                 ))}
              </div>
            </div>
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">داشبورد یکپارچه</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">تمام ابزارهای مورد نیاز برای مدیریت حرفه‌ای ورزش و سلامتی در یک نگاه.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-[#1E293B] p-8 rounded-3xl border border-gray-700 hover:border-[#00B894] transition-all duration-300 group hover:-translate-y-2">
                    <div className="bg-[#0B0F17] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-[#00B894] transition-colors">
                        <Dumbbell className="w-8 h-8 text-[#00B894]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">مدیریت تمرین</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">ثبت ست‌ها، تکرارها و مشاهده تاریخچه رکوردها با نمودارهای پیشرفت.</p>
                </div>

                {/* Card 2 (Featured) */}
                <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-8 rounded-3xl border border-[#FF6B35]/50 shadow-2xl shadow-[#FF6B35]/10 transform md:-translate-y-6 relative z-10">
                    <div className="absolute top-0 right-0 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">ویژه</div>
                    <div className="bg-[#0B0F17] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-[#FF6B35] shadow-[0_0_15px_rgba(255,107,53,0.3)]">
                        <Apple className="w-8 h-8 text-[#FF6B35]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">تغذیه هوشمند</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">برنامه غذایی منعطف، جایگزینی هوشمند مواد غذایی و کنترل دقیق کالری.</p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#1E293B] p-8 rounded-3xl border border-gray-700 hover:border-[#00B894] transition-all duration-300 group hover:-translate-y-2">
                    <div className="bg-[#0B0F17] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-[#00B894] transition-colors">
                        <BarChart2 className="w-8 h-8 text-[#00B894]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">آنالیز پیشرفته</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">تحلیل داده‌های بدن، روند تغییرات وزن و سایز با گزارش‌های دقیق.</p>
                </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-24 px-6 bg-white">
          <div className="container max-w-5xl mx-auto">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0B0F17] to-[#1F2937] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B35]/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00B894]/20 rounded-full blur-[100px] pointer-events-none"></div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
                  نسخه حرفه‌ای‌تر خودت باش
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                  همین حالا به جمع هزاران ورزشکار فیت پرو بپیوند و مسیر موفقیت خود را آغاز کن.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
                  <button onClick={onLogin} className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold text-lg px-12 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-orange-900/40">
                    شروع رایگان
                  </button>
                  <button onClick={onRegister} className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-lg px-12 py-4 rounded-2xl transition-all backdrop-blur-md">
                    ساخت حساب کاربری
                  </button>
                </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Floating Call Button */}
      <FloatingCallButton />
      
    </div>
  );
};

export default HomePage;
