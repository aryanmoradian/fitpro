
import React from 'react';
import { DailyLog, UserProfile } from '../types';
import Logo from './Logo';
import { Bell, Zap, Home } from 'lucide-react';

interface DashboardHeaderProps {
  logs: DailyLog[];
  profile: UserProfile;
}

const MiniProgressBar: React.FC<{ percentage: number; gradient: string }> = ({ percentage, gradient }) => (
    <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
        <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%`, background: gradient }}
        ></div>
    </div>
);


const DashboardHeader: React.FC<DashboardHeaderProps> = ({ logs, profile }) => {
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const workoutProgress = lastLog?.workoutScore || 0;
    const nutritionProgress = lastLog?.nutritionScore || 0;

    return (
        <header className="h-20 flex items-center justify-between px-6 shrink-0 bg-black/30 border-b border-white/10">
            {/* Right side (in RTL) */}
            <div className="flex items-center gap-6">
                <Logo textClassName="hidden lg:block" />
                <nav className="hidden md:flex items-center gap-6">
                    <a href="https://fit-pro.ir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white transition font-semibold">
                        <Home size={18} />
                        <span>بازگشت به سایت اصلی</span>
                    </a>
                    <a href="https://mokamelfitpro.ir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white transition font-semibold">
                        <span>مکمل‌های Fit Pro</span>
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold">پیشنهادی</span>
                    </a>
                </nav>
            </div>

            {/* Left side (in RTL) */}
            <div className="flex items-center gap-6">
                {/* User Status */}
                <div className="hidden lg:flex items-center gap-4 w-56">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-blue-400">تمرین</span>
                            <span className="text-xs font-mono text-gray-400">{workoutProgress}%</span>
                        </div>
                        <MiniProgressBar percentage={workoutProgress} gradient="linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))" />
                    </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-green-400">تغذیه</span>
                            <span className="text-xs font-mono text-gray-400">{nutritionProgress}%</span>
                        </div>
                        <MiniProgressBar percentage={nutritionProgress} gradient="linear-gradient(90deg, var(--accent-green), var(--accent-yellow))" />
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative text-gray-400 hover:text-white transition">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
                </button>

                {/* Coach CTA */}
                <a href="https://fit-pro.ir/coach/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 btn-coach-glow text-sm" title="با مربی شخصی خود ملاقات کنید - پیشرفت را تسریع کنید">
                    <Zap size={18} />
                    <span className="hidden sm:block">دسترسی به مربی</span>
                </a>
            </div>
        </header>
    );
};

export default DashboardHeader;
