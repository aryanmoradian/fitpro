
import React from 'react';
import { UserProfile, AppView, SubscriptionTier } from '../types';
import PredictiveProgress from './PredictiveProgress';
import { Check, Star, Crown, Shield, Zap, TrendingUp, Users } from 'lucide-react';

interface SubscriptionPageProps {
    setCurrentView: (view: AppView) => void;
    setTargetTier: (tier: SubscriptionTier) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ setCurrentView, setTargetTier }) => {
    
    const handleSelectPlan = (tier: SubscriptionTier) => {
        setTargetTier(tier);
        setCurrentView(AppView.PAYMENT);
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-[#0F172A] text-white selection:bg-[#FF6B35] selection:text-white pb-20 animate-in fade-in">
            
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
                        <button onClick={() => handleSelectPlan('elite')} className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-orange-900/50 hover:scale-105 transition">شروع عضویت ویژه</button>
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div id="plans" className="max-w-7xl mx-auto px-4 mb-20">
                <h2 className="text-center text-4xl font-bold mb-4">انتخاب مسیر قهرمانی</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-12">
                    {/* Free Tier */}
                    <div className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="text-3xl font-black text-white mb-6">رایگان</div>
                        <p className="text-gray-400 text-sm mb-6">برای شروع و آشنایی با سیستم</p>
                        <button disabled className="w-full py-3 rounded-lg font-bold bg-gray-700 text-gray-400 cursor-default mb-8">طرح فعلی</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Check size={16} className="ml-2 text-gray-500"/> ثبت تمرینات روزانه</li>
                            <li className="flex"><Check size={16} className="ml-2 text-gray-500"/> پروفایل بدنی پایه</li>
                        </ul>
                    </div>

                    {/* Elite Tier */}
                    <div className="bg-[#1E293B] rounded-2xl p-8 border border-[#FFD166] relative transform md:-translate-y-4 shadow-2xl shadow-yellow-900/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FFD166] text-black text-xs font-bold px-3 py-1 rounded-b-lg">پیشنهاد ویژه</div>
                        <h3 className="text-xl font-bold text-[#FFD166] mb-2">Elite</h3>
                        <div className="text-4xl font-black text-white mb-1">$3 <span className="text-lg font-normal text-gray-500">/ ماه</span></div>
                        <p className="text-gray-400 text-xs mb-6">پرداخت ارزی (Tether)</p>
                        <button onClick={() => handleSelectPlan('elite')} className="w-full py-3 rounded-lg font-bold bg-[#FFD166] text-black hover:bg-[#ffc107] transition mb-8">شروع Elite</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Star size={16} className="ml-2 text-[#FFD166]"/> <strong>اسکنر هوشمند خوراکی (AI)</strong></li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> تحلیل پیشرفته نمودارها</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#FFD166]"/> سیستم امتیازدهی ریکاوری</li>
                        </ul>
                    </div>

                    {/* Elite Plus Tier */}
                    <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-2xl p-8 border border-[#22C1C3]">
                        <h3 className="text-xl font-bold text-[#22C1C3] mb-2">Elite Plus</h3>
                        <div className="text-4xl font-black text-white mb-1">$5 <span className="text-lg font-normal text-gray-500">/ ماه</span></div>
                        <p className="text-gray-400 text-xs mb-6">پرداخت ارزی (Tether)</p>
                        <button onClick={() => handleSelectPlan('elite_plus')} className="w-full py-3 rounded-lg font-bold bg-[#22C1C3] text-black hover:bg-[#1CA7A9] transition mb-8">شروع VIP</button>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex"><Crown size={16} className="ml-2 text-[#22C1C3]"/> <strong>تمام امکانات Elite</strong></li>
                            <li className="flex"><Zap size={16} className="ml-2 text-[#22C1C3]"/> ۲ برابر پیام با مربی</li>
                            <li className="flex"><Check size={16} className="ml-2 text-[#22C1C3]"/> نقشه راه ۹۰ روزه شخصی</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto px-4 mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center">سوالات متداول</h2>
                <div className="space-y-4">
                    <details className="bg-[#1E293B] rounded-xl p-4 cursor-pointer group">
                        <summary className="font-bold flex justify-between items-center list-none">چرا فقط تتر (USD)؟ <span className="text-gray-500 group-open:rotate-180 transition">+</span></summary>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">برای ارائه خدمات بین‌المللی و استفاده از سرویس‌های AI دلاری، پرداخت‌ها بر بستر بلاکچین و تتر انجام می‌شود.</p>
                    </details>
                    <details className="bg-[#1E293B] rounded-xl p-4 cursor-pointer group">
                        <summary className="font-bold flex justify-between items-center list-none">چگونه اعتماد کنم؟ <span className="text-gray-500 group-open:rotate-180 transition">+</span></summary>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">تمامی تراکنش‌ها در بلاکچین ثبت شده و قابل پیگیری هستند. تیم پشتیبانی ما در واتساپ ۲۴ ساعته پاسخگو است.</p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
