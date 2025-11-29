
import React, { useEffect, useState } from 'react';
import { Crown, CheckCircle, Zap, ArrowRight, Star, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface OnboardingSuccessModalProps {
  tier: SubscriptionTier;
  onClose: () => void;
}

const Confetti: React.FC = () => {
    // Simple CSS confetti implementation
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animDelay: Math.random() * 2 + 's',
        bg: ['#FFD166', '#22C1C3', '#FF6B35'][Math.floor(Math.random() * 3)]
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {pieces.map(p => (
                <div 
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full animate-ping opacity-75"
                    style={{ 
                        left: p.left, 
                        top: '-10px',
                        backgroundColor: p.bg,
                        animation: `fall 3s linear infinite ${p.animDelay}`
                    }} 
                />
            ))}
            <style>{`
                @keyframes fall {
                    to { transform: translateY(100vh) rotate(720deg); }
                }
            `}</style>
        </div>
    );
};

const OnboardingSuccessModal: React.FC<OnboardingSuccessModalProps> = ({ tier, onClose }) => {
  const isElitePlus = tier === 'elite_plus';
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className={`bg-[#0F172A] border-2 rounded-2xl max-w-lg w-full p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isElitePlus ? 'border-cyan-500 shadow-cyan-500/20' : 'border-yellow-500 shadow-yellow-500/20'}`}>
        <Confetti />
        
        {/* Background Effects */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isElitePlus ? 'bg-cyan-500/20' : 'bg-yellow-500/20'}`}></div>
        
        <div className="relative z-10">
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce ${isElitePlus ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-gradient-to-br from-yellow-400 to-orange-500'}`}>
            <Crown size={48} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">تبریک! اشتراک فعال شد</h2>
          <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-6">
             <span className={`${isElitePlus ? 'text-cyan-400' : 'text-yellow-400'} font-bold text-sm tracking-widest uppercase flex items-center gap-2`}>
                <Sparkles size={14} /> PREMIUM ACTIVE
             </span>
          </div>
          
          <p className="text-gray-300 mb-8">
            شما اکنون یک عضو <span className={`${isElitePlus ? 'text-cyan-400' : 'text-yellow-400'} font-bold text-xl`}>{tier === 'elite_plus' ? 'Elite Plus' : 'Elite'}</span> هستید.
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 text-right mb-8 border border-white/10">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">دسترسی‌های جدید شما:</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-white">
                <CheckCircle className="text-green-500 ml-3 shrink-0" size={20} />
                <span>اسکنر هوشمند خوراکی (AI Meal Scan)</span>
              </li>
              <li className="flex items-center text-white">
                <CheckCircle className="text-green-500 ml-3 shrink-0" size={20} />
                <span>تحلیل پیشرفته ریکاوری و خواب</span>
              </li>
              <li className="flex items-center text-white">
                <CheckCircle className="text-green-500 ml-3 shrink-0" size={20} />
                <span>تم اختصاصی {isElitePlus ? 'نئون (Neon)' : 'طلایی (Gold)'}</span>
              </li>
              {isElitePlus && (
                <>
                    <li className="flex items-center text-white">
                        <Zap className="text-cyan-400 ml-3 shrink-0" size={20} />
                        <span>اولویت در پاسخگویی مربی</span>
                    </li>
                    <li className="flex items-center text-white">
                        <Star className="text-cyan-400 ml-3 shrink-0" size={20} />
                        <span>برنامه تمرینی ۹۰ روزه اختصاصی</span>
                    </li>
                </>
              )}
            </ul>
          </div>
          
          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition hover:scale-105 ${isElitePlus ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}
          >
            ورود به داشبورد حرفه‌ای <ArrowRight size={20} className="mr-2"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccessModal;
