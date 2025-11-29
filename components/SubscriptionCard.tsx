
import React from 'react';
import { UserProfile, AppView } from '../types';
import { Crown, AlertCircle, Calendar, ShieldCheck, ChevronLeft } from 'lucide-react';

interface SubscriptionCardProps {
    profile: UserProfile;
    setCurrentView: (view: AppView) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ profile, setCurrentView }) => {
    const isPremium = profile.subscriptionTier !== 'free';
    
    // Calculate days remaining logic (mock)
    const daysRemaining = profile.subscriptionExpiry 
        ? Math.ceil((new Date(profile.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        : 0;

    const isActive = profile.subscriptionStatus === 'active';
    const isExpiringSoon = daysRemaining <= 5 && isActive;

    return (
        <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 ${
            isPremium ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-yellow-500/50 shadow-lg' : 'bg-black/40 border-gray-700'
        }`}>
            {/* Background Decor */}
            {isPremium && <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full blur-2xl"></div>}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Crown size={20} className={isPremium ? 'text-yellow-400' : 'text-gray-500'} />
                            وضعیت اشتراک
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            طرح فعلی: <span className={`font-bold ${isPremium ? 'text-yellow-400' : 'text-white'}`}>{profile.subscriptionTier === 'elite_plus' ? 'Elite Plus' : profile.subscriptionTier === 'elite' ? 'Elite' : 'Basic (Free)'}</span>
                        </p>
                    </div>
                    {isActive ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 flex items-center">
                            <ShieldCheck size={12} className="mr-1"/> فعال
                        </span>
                    ) : (
                        <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">غیرفعال</span>
                    )}
                </div>

                {isPremium ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center text-gray-300">
                                <Calendar size={16} className="mr-2 text-blue-400"/>
                                <span>اعتبار تا:</span>
                            </div>
                            <div className="font-mono font-bold text-white">
                                {profile.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString('fa-IR') : 'N/A'}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className={`text-sm ${isExpiringSoon ? 'text-red-400 animate-pulse font-bold' : 'text-gray-400'}`}>
                                {daysRemaining} روز باقی‌مانده
                            </span>
                            {isExpiringSoon && (
                                <button 
                                    onClick={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)}
                                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
                                >
                                    تمدید فوری
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex items-start gap-2 bg-blue-900/20 p-3 rounded-lg border border-blue-500/30 mb-4">
                            <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5"/>
                            <p className="text-xs text-blue-200 leading-relaxed">
                                برای دسترسی به برنامه تمرینی اختصاصی، آنالیز پیشرفته و مربی هوشمند، حساب خود را ارتقا دهید.
                            </p>
                        </div>
                        <button 
                            onClick={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)}
                            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-3 rounded-xl transition flex items-center justify-center text-sm"
                        >
                            ارتقا به نسخه حرفه‌ای <ChevronLeft size={16} className="mr-1"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionCard;
