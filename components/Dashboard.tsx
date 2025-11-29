
import React from 'react';
import { AppView, BodyMetricLog, DailyLog, Exercise, NutritionItem, UserProfile, WeeklyWorkoutPlan, GuidanceState } from '../types';
import { Check, Dumbbell, Utensils, Scale, Activity, Play, Trophy, Lock, Zap, Brain, Heart, Moon, Droplets, UserCheck, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, XAxis, YAxis, Bar } from 'recharts';
import GuidanceTracker from './GuidanceTracker';
import { DashboardWidgetsGrid } from './DashboardWidgets';
import NewsTicker from './NewsTicker';
import SubscriptionCard from './SubscriptionCard';
import { LevelInfo } from '../services/levelCalculator';

interface DashboardProps {
  logs: DailyLog[];
  bodyMetrics: BodyMetricLog[];
  workoutPlan: Exercise[];
  nutritionPlan: NutritionItem[];
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  guidanceState: GuidanceState;
  setCurrentView: (view: AppView) => void;
  weeklyWorkoutPlan: WeeklyWorkoutPlan;
  updateTodaysLog: (partialLog: Partial<DailyLog>) => void;
  athleteLevelInfo: LevelInfo;
  highlightCharts: boolean;
}

const PremiumModulesGrid: React.FC<{ isPremium: boolean, setCurrentView: (view: AppView) => void }> = ({ isPremium, setCurrentView }) => {
    const modules = [
        { name: 'Advanced Workout Generator', icon: Dumbbell, unlocked: true },
        { name: 'خوراکی / تغذیه AI Planner', icon: Utensils, unlocked: true },
        { name: 'Anatomy Video Library', icon: UserCheck, unlocked: isPremium },
        { name: 'AI Performance Tracker', icon: Brain, unlocked: isPremium },
        { name: 'Injury Prevention Guide', icon: Activity, unlocked: isPremium },
        { name: 'Sleep Optimization AI', icon: Moon, unlocked: isPremium },
        { name: 'Hydration Assistant', icon: Droplets, unlocked: isPremium },
        { name: 'Progress PDF Export', icon: FileText, unlocked: isPremium },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {modules.map((mod, idx) => (
                <div key={idx} className={`relative bg-[#1E293B] border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center group transition hover:border-[#00B894] ${!mod.unlocked ? 'opacity-70' : 'cursor-pointer'}`}
                     onClick={() => !mod.unlocked && setCurrentView(AppView.SUBSCRIPTION_LANDING)}>
                    <div className={`p-3 rounded-full mb-3 ${mod.unlocked ? 'bg-[#00B894]/20 text-[#00B894]' : 'bg-gray-700 text-gray-500'}`}>
                        <mod.icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-white mb-1">{mod.name}</span>
                    {!mod.unlocked && (
                        <div className="absolute top-2 right-2 bg-yellow-500/20 p-1 rounded">
                            <Lock size={12} className="text-yellow-500"/>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { logs, guidanceState, setCurrentView, profile, bodyMetrics } = props;
  const isPremium = profile.subscriptionTier !== 'free';

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-black text-white">سلام، {profile.name} 👋</h1>
              <p className="text-gray-400 text-sm">امروز روز خوبی برای شکستن رکوردهاست!</p>
          </div>
          {isPremium && (
              <div className="hidden md:flex items-center gap-2 bg-[#00B894]/10 border border-[#00B894]/30 px-4 py-2 rounded-lg text-[#00B894] text-sm font-bold">
                  <Zap size={16} /> اشتراک ویژه فعال است
              </div>
          )}
      </div>

      {/* Subscription Status Card */}
      <SubscriptionCard profile={profile} setCurrentView={setCurrentView} />

      {/* Guidance */}
      <GuidanceTracker guidanceState={guidanceState} setCurrentView={setCurrentView} />

      <NewsTicker logs={logs} profile={profile} metrics={bodyMetrics} setCurrentView={setCurrentView} />

      {/* Premium Modules Grid */}
      <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Brain className="text-[#00B894]"/> ابزارهای هوشمند</h2>
          <PremiumModulesGrid isPremium={isPremium} setCurrentView={setCurrentView} />
      </div>

      <DashboardWidgetsGrid {...props} />
    </div>
  );
};

export default React.memo(Dashboard);
