
import React from 'react';
import { UserProfile, AppView, SubscriptionTier } from '../types';
import PredictiveProgress from './PredictiveProgress';
import { Check, Star, Crown, Shield, Zap, TrendingUp, Users } from 'lucide-react';

interface SubscriptionLandingProps {
    setCurrentView: (view: AppView) => void;
    setTargetTier: (tier: SubscriptionTier) => void;
}

const SubscriptionLanding: React.FC<SubscriptionLandingProps> = ({ setCurrentView, setTargetTier }) => {
    
    const handleSelectPlan = (tier: SubscriptionTier) => {
        setTargetTier(tier);
        setCurrentView(AppView.PAYMENT);
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-[#0F172A] text-white selection:bg-[#FF6B35] selection:text-white pb-20">
            
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#22C1C3]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm text-[#FFD166] mb-6 animate-in fade-in slide-in-from-bottom-4">
                        <Crown size={14} /> <span>نسخه جدید Elite Plus منتشر شد</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                        پتانسیل واقعی خود را <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C1C3] to-[#FFD166]">آزاد کنید</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        به جمع ۱٪ ورزشکاران برتر بپیوندید. با هوش مصنوعی پیشرفته، تحلیل‌های دقیق و برنامه‌ریزی حرفه‌ای، سریع‌تر از همیشه به هدف برسید.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => handleSelectPlan('elite')}
                            className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-orange-900/50 hover:scale-105 transition"
                        >
                            شروع عضویت ویژه
                        </button>
                        <button 
                             onClick={() => { document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl transition"
                        >
                            مقایسه پلن‌ها
                        </button>
                    </div>
                </div>
            </div>

            {/* Predictive Widget Section */}
            <div className="max-w-6xl mx-auto px-4 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold mb-4">آینده ورزشی خود را ببینید</h2>
                        <p className="text-gray-400 mb-6 text-lg">
                            ویجت پیش‌بینی هوشمند ما بر اساس داده‌های هزاران ورزشکار، مسیر پیشرفت شما را با متدهای علمی Fit Pro در مقایسه با تمرین سنتی شبیه‌سازی می‌کند. تفاوت فقط در تلاش نیست، در <span className="text-[#22C1C3] font-bold">هوشمندانه تمرین کردن</span> است.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {[
                                'تحلیل نقاط ضعف با AI',
                                'برنامه تغذیه داینامیک و منعطف',
                                'مدیریت ریکاوری و پیشگیری از آسیب'
                            ].map(item => (
                                <li key={item} className="flex items-center text-gray-300">
                                    <Check className="text-[#FFD166] ml-3" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <PredictiveProgress />
                    </div>
                </div>
            </div>

            {/* Pricing Plans */}
            <div id="plans" className="max-w-7xl mx-auto px-4 mb-20">
                <h2 className="text-center text-4xl font-bold mb-4">انتخاب مسیر قهرمانی</h2>
                <p className="text-center text-gray-400 mb-12">طرحی را انتخاب کنید که با اهداف شما همخوانی دارد</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Free Tier */}
                    <div className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="text-3xl font-black text-white mb-6">رایگان</div>
                        <p className="text-gray-400 text-sm mb-6">برای شروع و آشنایی با سیستم</p>
                        <button disabled className="w-full py-3 rounded-lg font-bold bg-gray-700 text-gray-400 cursor-default mb-8">طرح فعلی</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Check size={16} className="ml-2 text-gray-500"/> ثبت تمرینات روزانه</li>
                            <li className="flex"><Check size={16} className="ml-2 text-gray-500"/> پروفایل بدنی پایه</li>
                            <li className="flex"><Check size={16} className="ml-2 text-gray-500"/> مدیریت وزن ساده</li>
                        </ul>
                    </div>

                    {/* Elite Tier */}
                    <div className="bg-[#1E293B] rounded-2xl p-8 border border-[#FFD166] relative transform md:-translate-y-4 shadow-2xl shadow-yellow-900/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FFD166] text-black text-xs font-bold px-3 py-1 rounded-b-lg">پیشنهاد ویژه</div>
                        <h3 className="text-xl font-bold text-[#FFD166] mb-2">Elite</h3>
                        <div className="text-4xl font-black text-white mb-1">$7 <span className="text-lg font-normal text-gray-500">/ ماه</span></div>
                        <p className="text-gray-400 text-xs mb-6">~ ۴۲۰,۰۰۰ تومان</p>
                        <button onClick={() => handleSelectPlan('elite')} className="w-full py-3 rounded-lg font-bold bg-[#FFD166] text-black hover:bg-[#ffc107] transition mb-8">شروع Elite</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Star size={16} className="ml-2 text-[#FFD166]"/> <strong>اسکنر هوشمند خوراکی (AI)</strong></li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> تحلیل پیشرفته نمودارها</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> سیستم امتیازدهی ریکاوری</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> چالش‌های ماهانه و نشان‌ها</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> تم طلایی اختصاصی</li>
                        </ul>
                    </div>

                    {/* Elite Plus Tier */}
                    <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-2xl p-8 border border-[#22C1C3]">
                        <h3 className="text-xl font-bold text-[#22C1C3] mb-2">Elite Plus</h3>
                        <div className="text-4xl font-black text-white mb-1">$15 <span className="text-lg font-normal text-gray-500">/ ماه</span></div>
                        <p className="text-gray-400 text-xs mb-6">~ ۹۰۰,۰۰۰ تومان</p>
                        <button onClick={() => handleSelectPlan('elite_plus')} className="w-full py-3 rounded-lg font-bold bg-[#22C1C3] text-black hover:bg-[#1CA7A9] transition mb-8">شروع VIP</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Crown size={16} className="ml-2 text-[#22C1C3]"/> <strong>تمام امکانات Elite</strong></li>
                            <li className="flex"><Zap size={16} className="ml-2 text-[#22C1C3]"/> ۲ برابر پیام با مربی</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#22C1C3]"/> نقشه راه ۹۰ روزه شخصی</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#22C1C3]"/> بررسی ویدیویی فرم تمرین</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#22C1C3]"/> تم نئون اختصاصی</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#22C1C3]"/> ۲۰٪ تخفیف فروشگاه مکمل</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center">سوالات متداول</h2>
                <div className="space-y-4">
                    <details className="bg-[#1E293B] rounded-xl p-4 cursor-pointer group">
                        <summary className="font-bold flex justify-between items-center list-none">
                            آیا می‌توانم هر زمان اشتراک را لغو کنم؟
                            <span className="text-gray-500 group-open:rotate-180 transition">+</span>
                        </summary>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">بله، اشتراک‌ها برای دوره خریداری شده فعال می‌مانند و تمدید خودکار ندارند. شما کنترل کامل دارید.</p>
                    </details>
                    <details className="bg-[#1E293B] rounded-xl p-4 cursor-pointer group">
                        <summary className="font-bold flex justify-between items-center list-none">
                            چگونه با تتر پرداخت کنم؟
                            <span className="text-gray-500 group-open:rotate-180 transition">+</span>
                        </summary>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">در مرحله پرداخت، گزینه USDT TRC20 را انتخاب کنید. آدرس ولت به شما نمایش داده می‌شود. پس از واریز، کد پیگیری (TxID) را وارد کنید تا سیستم به طور خودکار حساب شما را ارتقا دهد.</p>
                    </details>
                    <details className="bg-[#1E293B] rounded-xl p-4 cursor-pointer group">
                        <summary className="font-bold flex justify-between items-center list-none">
                            تفاوت Elite و Elite Plus چیست؟
                            <span className="text-gray-500 group-open:rotate-180 transition">+</span>
                        </summary>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">الیت پلاس علاوه بر تمام امکانات نرم‌افزاری، شامل خدمات انسانی مانند بررسی فرم تمرین توسط مربی و تخفیف‌های فروشگاهی است.</p>
                    </details>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8 px-4">
                <div className="flex justify-center gap-6 mb-4">
                    <Shield size={20} className="hover:text-white cursor-pointer"/>
                    <Users size={20} className="hover:text-white cursor-pointer"/>
                </div>
                <p>© ۲۰۲۵-۲۰۲۶ تمامی حقوق برای Fit Pro محفوظ است.</p>
            </footer>
        </div>
    );
};

export default SubscriptionLanding;
