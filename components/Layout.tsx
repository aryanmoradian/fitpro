
import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, MessageSquare, Camera, UserCircle, BrainCircuit, CheckCircle2, Palette, Users, Instagram, HeartPulse, Crown, LogOut, Video, Mail, TrendingUp } from 'lucide-react';
import { AppView, GuidanceState, DailyLog, UserProfile } from '../types';
import Logo from './Logo';
import DashboardHeader from './DashboardHeader';
import { LevelInfo } from '../services/levelCalculator';
import SubscriptionCountdown from './SubscriptionCountdown';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  guidanceState: GuidanceState;
  logs: DailyLog[];
  profile: UserProfile;
  athleteLevelInfo: LevelInfo;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children, guidanceState, logs, profile, athleteLevelInfo, onLogout }) => {
  const isAdmin = profile.role === 'admin';

  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'داشبورد اصلی' },
    { view: AppView.BODY_ANALYSIS, icon: UserCircle, label: 'پروفایل و بدن' },
    { view: AppView.HEALTH_HUB, icon: HeartPulse, label: 'مرکز سلامت' },
    { view: AppView.PLANNER, icon: Calendar, label: 'طراحی برنامه' },
    { view: AppView.TRACKER, icon: CheckSquare, label: 'ثبت روزانه' },
    { view: AppView.COACH, icon: MessageSquare, label: 'مربی هوشمند' },
    { view: AppView.VIDEO_LIBRARY, icon: Video, label: 'ویدیوهای آموزشی' },
    { view: AppView.MEAL_SCAN, icon: Camera, label: 'اسکن غذا' },
    { view: AppView.ADVANCED_ANALYTICS, icon: BrainCircuit, label: 'تحلیل پیشرفته' },
    { view: AppView.PROGRESS_EXPORT, icon: TrendingUp, label: 'گزارش و تحلیل' }, // ADDED HERE
    { view: AppView.USER_INBOX, icon: Mail, label: 'پیام‌ها' },
    { view: AppView.SUBSCRIPTION_LANDING, icon: Crown, label: 'عضویت Elite' },
    { view: AppView.BRAND_GUIDE, icon: Palette, label: 'راهنمای برند' },
  ];

  const externalLinks = [
    { href: 'https://chat.whatsapp.com/JkWkKSmtesJ1QID0bgNry7', icon: Users, label: 'گروه آموزشی واتساپ' },
    { href: 'https://instagram.com/mokamel_fitpro', icon: Instagram, label: 'پیج اینستاگرام' },
  ];

  const { photoUploaded, workoutCreated, nutritionCreated, firstLogCompleted } = guidanceState;
  const stepsStatus = {
    [AppView.BODY_ANALYSIS]: photoUploaded,
    [AppView.PLANNER]: workoutCreated && nutritionCreated,
    [AppView.TRACKER]: firstLogCompleted,
  };

  const coreStepsOrder: AppView[] = [AppView.BODY_ANALYSIS, AppView.PLANNER, AppView.TRACKER];
  const nextStepView = coreStepsOrder.find(view => !stepsStatus[view as keyof typeof stepsStatus]);
  
  const levelGlowClass = React.useMemo(() => {
    switch(athleteLevelInfo.status) {
      case 'Semi-Pro': return 'level-glow-semi-pro';
      case 'Pro': return 'level-glow-semi-pro';
      case 'Elite': return 'level-glow-professional';
      default: return '';
    }
  }, [athleteLevelInfo.status]);

  if (isAdmin) {
      return (
          <div className="flex h-full text-gray-100 p-4 gap-4">
              <aside className="w-64 bg-gray-900 border border-white/10 rounded-2xl flex flex-col p-4">
                  <Logo />
                  <div className="flex-1 mt-10">Admin Mode Active</div>
                  <button onClick={onLogout} className="text-red-400 flex items-center mt-auto"><LogOut className="mr-2"/> خروج</button>
              </aside>
              <main className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-6">{children}</main>
          </div>
      );
  }

  return (
    <div className="flex h-full text-gray-100 p-4 gap-4">
      {/* Sidebar */}
      <aside data-tour-id="sidebar" className="w-20 md:w-64 flex-shrink-0 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col transition-all duration-300">
        <div className="h-20 flex items-center justify-center border-b border-white/10 px-4">
          <Logo textClassName="hidden md:block" />
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {profile.subscriptionTier === 'free' && (
            <div className="px-4 mb-4 hidden md:block">
              <button 
                onClick={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 rounded-lg flex items-center justify-center text-sm shadow-lg hover:scale-105 transition"
              >
                <Crown size={16} className="ml-2" /> ارتقا به Elite
              </button>
            </div>
          )}

          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const isCore = coreStepsOrder.includes(item.view);
              const isCompleted = isCore && stepsStatus[item.view as keyof typeof stepsStatus];
              const isNext = item.view === nextStepView;
              const isActive = currentView === item.view || (item.view === AppView.SUBSCRIPTION_LANDING && currentView === AppView.PAYMENT);

              let stateClasses = isActive ? 'bg-blue-600/80 text-white shadow-[0_0_15px_rgba(88,166,255,0.6)]' : 'text-gray-400 hover:bg-white/10 hover:text-white';
              if (isNext && !isActive) stateClasses = 'text-white bg-blue-500/10 border border-blue-500/50 animate-pulse';
              if (item.view === AppView.SUBSCRIPTION_LANDING && profile.subscriptionTier !== 'free') return null;

              return (
                <li key={item.view}>
                  <button onClick={() => setCurrentView(item.view)} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group ${stateClasses}`}>
                    <div className="flex items-center">
                      <item.icon className={`w-6 h-6 flex-shrink-0 ${item.view === AppView.SUBSCRIPTION_LANDING ? 'text-yellow-400' : ''}`} />
                      <span className="mr-4 font-bold hidden md:block">{item.label}</span>
                    </div>
                    {isCompleted && currentView !== item.view && <CheckCircle2 className="w-5 h-5 text-green-400 hidden md:block" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="px-4 my-4"><hr className="border-white/10" /></div>

          <ul className="space-y-2 px-2">
            {externalLinks.map((link) => (
                <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white">
                        <link.icon className="w-6 h-6 flex-shrink-0" />
                        <span className="mr-4 font-bold hidden md:block">{link.label}</span>
                    </a>
                </li>
            ))}
            <li>
                <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/10 hover:text-red-300 transition">
                    <LogOut className="w-6 h-6 flex-shrink-0" />
                    <span className="mr-4 font-bold hidden md:block">خروج از حساب</span>
                </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <SubscriptionCountdown profile={profile} />
          <div className="flex items-center mt-3">
             <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 border-2 border-white/20"></div>
                {profile.subscriptionTier !== 'free' && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full p-0.5 border border-black"><Crown size={10} fill="black" /></div>
                )}
             </div>
            <div className="mr-3 hidden md:block text-right flex-1">
              <p className="text-sm font-bold text-white truncate">{profile.name}</p>
              <div className="flex justify-between items-center mt-1">
                 <span className="text-[10px] text-gray-400">{athleteLevelInfo.status}</span>
                 <span className="text-[10px] border px-1 rounded border-gray-600 text-gray-400 uppercase">{profile.subscriptionTier}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden flex flex-col relative bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl transition-all duration-500 ${levelGlowClass}`}>
        <DashboardHeader logs={logs} profile={profile} />
        <div className="flex-1 overflow-auto p-6 pt-2">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
