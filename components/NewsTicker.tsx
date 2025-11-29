import React, { useMemo } from 'react';
import { AppView, DailyLog, UserProfile, BodyMetricLog } from '../types';
import { Dumbbell, Utensils, TrendingUp, TrendingDown, AlertCircle, Sparkles, Footprints, HeartPulse, Gauge, Scale, Flame } from 'lucide-react';

interface TickerProps {
  logs: DailyLog[];
  profile: UserProfile;
  metrics: BodyMetricLog[];
  setCurrentView: (view: AppView) => void;
}

const MiniProgressCircle: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
      <circle
        className="text-gray-700"
        strokeWidth="3"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
      />
      <circle
        className={color}
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
      />
    </svg>
  );
};

const TickerItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  const baseClasses = "flex items-center space-x-2 space-x-reverse whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer";
  const hoverClasses = onClick ? "hover:bg-white/20 hover:scale-105" : "";
  
  return (
    <div onClick={onClick} className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

const NewsTicker: React.FC<TickerProps> = ({ logs, profile, metrics, setCurrentView }) => {
  const tickerItems = useMemo(() => {
    const items = [];
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const lastMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
    const prevMetric = metrics.length > 1 ? metrics[metrics.length - 2] : null;
    
    const motivationalQuotes = [
      "قدرت در ذهن توست!", "استمرار کلید موفقیت است.", "امروز یک قدم به هدفت نزدیک‌تر شو.", "هر تکرار مهم است."
    ];
    
    // 1. Welcome / Motivational Quote
    items.push(
      <TickerItem key="quote" className="bg-transparent text-gray-400 italic">
        <Sparkles size={16} className="text-yellow-400" />
        <span>{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</span>
      </TickerItem>
    );

    // 2. Workout Score
    if (lastLog) {
      const isTopPerf = lastLog.workoutScore >= 90;
      items.push(
        <TickerItem key="workout" onClick={() => setCurrentView(AppView.TRACKER)} className={`bg-blue-900/50 text-blue-300 ${isTopPerf ? 'glowing-blue' : ''}`}>
          <Dumbbell size={16} />
          <span>تمرین: {lastLog.workoutScore}%</span>
          <MiniProgressCircle percentage={lastLog.workoutScore} color="text-blue-500" />
        </TickerItem>
      );
    } else {
      items.push(
        <TickerItem key="workout-alert" onClick={() => setCurrentView(AppView.TRACKER)} className="bg-red-900/50 text-red-300">
          <AlertCircle size={16} />
          <span>تمرین امروز را ثبت کن!</span>
        </TickerItem>
      );
    }

    // 3. Nutrition Score
    if (lastLog) {
       items.push(
        <TickerItem key="nutrition" onClick={() => setCurrentView(AppView.TRACKER)} className="bg-green-900/50 text-green-300">
          <Utensils size={16} />
          <span>تغذیه: {lastLog.nutritionScore}%</span>
          <MiniProgressCircle percentage={lastLog.nutritionScore} color="text-green-500" />
        </TickerItem>
      );
    }

    // 4. Weight Trend
    if (lastMetric) {
      let trendIcon = null;
      if (prevMetric) {
          const change = lastMetric.weight - prevMetric.weight;
          if (change > 0) trendIcon = <TrendingUp size={16} className="text-red-400"/>;
          if (change < 0) trendIcon = <TrendingDown size={16} className="text-green-400"/>;
      }
      items.push(
        <TickerItem key="weight" onClick={() => setCurrentView(AppView.BODY_ANALYSIS)} className="bg-purple-900/50 text-purple-300">
            <Scale size={16} />
            <span>وزن: {lastMetric.weight} کیلوگرم</span>
            {trendIcon}
        </TickerItem>
      );
    }

    // 5. Steps
    if (lastLog?.steps) {
        const isGoalMet = lastLog.steps >= 10000;
        items.push(
            <TickerItem key="steps" onClick={() => setCurrentView(AppView.TRACKER)} className={`bg-gray-700/50 text-gray-300 ${isGoalMet ? 'glowing-green' : ''}`}>
                <Footprints size={16} />
                <span>{lastLog.steps.toLocaleString('fa-IR')} قدم</span>
            </TickerItem>
        );
    }

    // 6. Recovery Index
    if (profile.advancedHealth?.recoveryIndex) {
        const recovery = profile.advancedHealth.recoveryIndex;
        const colorClass = recovery > 75 ? 'text-green-400' : recovery > 50 ? 'text-yellow-400' : 'text-red-400';
         items.push(
            <TickerItem key="recovery" onClick={() => setCurrentView(AppView.ADVANCED_ANALYTICS)} className="bg-indigo-900/50 text-indigo-300">
                <HeartPulse size={16} />
                <span>شاخص ریکاوری: <span className={`font-bold ${colorClass}`}>{recovery}%</span></span>
            </TickerItem>
        );
    }
    
    // 7. VO2 Max
    if (profile.advancedHealth?.vo2Max) {
         items.push(
            <TickerItem key="vo2max" onClick={() => setCurrentView(AppView.ADVANCED_ANALYTICS)} className="bg-cyan-900/50 text-cyan-300">
                <Gauge size={16} />
                <span>VO2 Max: {profile.advancedHealth.vo2Max}</span>
            </TickerItem>
        );
    }
    
    // 8. Calories
    if (lastLog?.consumedMacros?.calories) {
         items.push(
            <TickerItem key="calories" onClick={() => setCurrentView(AppView.TRACKER)} className="bg-orange-900/50 text-orange-300">
                <Flame size={16} />
                <span>{lastLog.consumedMacros.calories.toLocaleString('fa-IR')} کالری</span>
            </TickerItem>
        );
    }

    return items;
  }, [logs, profile, metrics, setCurrentView]);

  if (tickerItems.length <= 1) return null;

  return (
    <div className="w-full bg-black/30 border-y border-white/10 overflow-hidden relative h-14 flex items-center ticker-container">
      <div className="ticker-move flex items-center space-x-4 space-x-reverse px-4">
        {tickerItems}
        {/* Duplicate for seamless loop */}
        {tickerItems}
      </div>
    </div>
  );
};

export default React.memo(NewsTicker);