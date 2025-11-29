
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  Activity, Calendar, CheckCircle2, ChevronDown, ChevronUp, Clock, Flame, 
  Heart, LineChart as IconLineChart, Medal, Moon, Plus, Share2, Smile, Trophy, Zap, AlertCircle, Droplets, Minus, Award
} from 'lucide-react';
import { DailyLog, Exercise, NutritionItem, UserProfile, Habit, Mood, BodyMetricLog } from '../types';
import { LevelInfo } from '../services/levelCalculator';

interface WidgetProps {
  logs: DailyLog[];
  workoutPlan: Exercise[];
  nutritionPlan: NutritionItem[];
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
  metrics: BodyMetricLog[];
  updateTodaysLog: (partialLog: Partial<DailyLog>) => void;
  athleteLevelInfo: LevelInfo;
  highlightCharts?: boolean;
}

const WidgetCard: React.FC<{ title: string; icon: any; children: React.ReactNode; color?: string; className?: string }> = React.memo(({ title, icon: Icon, children, color = "blue", className = '' }) => {
  const [isOpen, setIsOpen] = useState(true);

  const colorVariants: { [key: string]: { text: string; border: string; } } = {
    blue: { text: 'text-blue-400', border: 'hover:border-blue-500' },
    orange: { text: 'text-orange-400', border: 'hover:border-orange-500' },
    green: { text: 'text-green-400', border: 'hover:border-green-500' },
    purple: { text: 'text-purple-400', border: 'hover:border-purple-500' },
    yellow: { text: 'text-yellow-400', border: 'hover:border-yellow-500' },
    pink: { text: 'text-pink-400', border: 'hover:border-pink-500' },
    indigo: { text: 'text-indigo-400', border: 'hover:border-indigo-500' },
    cyan: { text: 'text-cyan-400', border: 'hover:border-cyan-500' },
  };

  const selectedColor = colorVariants[color as keyof typeof colorVariants] || colorVariants.blue;
  
  return (
    <div className={`energetic-card overflow-hidden transition-all duration-300 ${selectedColor.border} ${className}`}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className={`font-bold text-lg flex items-center ${selectedColor.text}`}>
          <Icon className="w-5 h-5 ml-2" />
          {title}
        </h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white transition">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
});

const HydrationWidget: React.FC<{ 
  profile: UserProfile; 
  updateProfile: (p: UserProfile) => void; 
  lastLog: DailyLog | null; // This will be today's log, or null
  updateTodaysLog: (partialLog: Partial<DailyLog>) => void; 
}> = ({ profile, updateProfile, lastLog, updateTodaysLog }) => {
  
  const goal = useMemo(() => {
    // Personalized goal: 35ml per kg. Fallback to profile goal or 2500ml.
    return profile.currentWeight > 0 
      ? Math.round(profile.currentWeight * 35) 
      : (profile.hydrationGoal || 2500);
  }, [profile.currentWeight, profile.hydrationGoal]);

  const currentIntake = (lastLog?.waterIntake || 0) * 250; // glasses to ml
  const progress = goal > 0 ? Math.min((currentIntake / goal) * 100, 100) : 0;

  const adjustWater = (amountInMl: number) => {
    const currentGlasses = lastLog?.waterIntake || 0;
    const glassesToAdd = amountInMl / 250;
    const newTotalGlasses = currentGlasses + glassesToAdd;
    updateTodaysLog({ waterIntake: Math.max(0, newTotalGlasses) });
  };

  return (
    <WidgetCard title="آبرسانی" icon={Droplets} color="cyan">
       <div className="flex flex-col items-center text-center">
        <div className="relative w-24 h-40 border-2 border-gray-600 rounded-t-3xl rounded-b-xl p-1 bg-black/20 mb-3">
          <div className="absolute bottom-0 left-0 right-0 rounded-b-lg rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-500 transition-all duration-500" style={{ height: `${progress}%` }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-400">{currentIntake.toLocaleString('fa-IR')} / {goal.toLocaleString('fa-IR')} میلی‌لیتر</p>
        <div className="flex space-x-2 space-x-reverse mt-4">
           <button onClick={() => adjustWater(250)} className="bg-white/10 hover:bg-white/20 text-white font-bold w-12 h-10 rounded-lg text-sm">+۲۵۰</button>
           <button onClick={() => adjustWater(500)} className="bg-white/10 hover:bg-white/20 text-white font-bold w-12 h-10 rounded-lg text-sm">+۵۰۰</button>
           <button onClick={() => adjustWater(-250)} className="bg-white/10 hover:bg-white/20 text-white font-bold w-12 h-10 rounded-lg"><Minus size={16} className="mx-auto" /></button>
        </div>
       </div>
    </WidgetCard>
  );
};

const AthleteLevelWidget: React.FC<{ athleteLevelInfo: LevelInfo }> = ({ athleteLevelInfo }) => {
  const { status, progressToNext } = athleteLevelInfo;
  const levelStyles: Record<string, { badge: string; text: string; insight: string }> = {
    Amateur: { badge: 'bg-gray-500', text: 'text-gray-300', insight: 'Focus on consistency to level up!' },
    'Semi-Pro': { badge: 'bg-blue-500', text: 'text-blue-300', insight: 'Dial in your nutrition and recovery.' },
    Professional: { badge: 'bg-yellow-500', text: 'text-yellow-300', insight: 'Push your advanced metrics to the limit.' },
  };
  const currentStyle = levelStyles[status];

  return (
    <WidgetCard title="Athlete Level" icon={Award} color="yellow">
      <div className="flex flex-col items-center text-center h-full justify-around">
          <span className={`px-4 py-1.5 rounded-full text-lg font-bold text-white ${currentStyle.badge}`}>
            {status}
          </span>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress to next level</span>
                <span>{progressToNext}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full progress-bar-bg">
                <div 
                    className="h-2.5 rounded-full" 
                    style={{
                        width: `${progressToNext}%`, 
                        background: 'linear-gradient(90deg, var(--accent-yellow), var(--accent-orange))'
                    }}
                ></div>
            </div>
          </div>
          <div className="text-sm bg-yellow-900/30 text-yellow-300 p-2 rounded w-full">
            {currentStyle.insight}
          </div>
      </div>
    </WidgetCard>
  );
};


export const DashboardWidgetsGrid: React.FC<WidgetProps> = React.memo(({ logs, workoutPlan, nutritionPlan, profile, updateProfile, metrics, updateTodaysLog, athleteLevelInfo, highlightCharts }) => {
  const todayStr = new Date().toLocaleDateString('fa-IR');
  const todayLog = logs.find(l => l.date === todayStr) || null;
  const lastAvailableLog = todayLog || (logs.length > 0 ? logs[logs.length-1] : null) || { workoutScore: 0, nutritionScore: 0, mood: 'neutral' as Mood, sleepHours: 0, restingHeartRate: 0 };
  
  const lastMetric = metrics[metrics.length - 1] || { weight: 0, bodyFat: 0, muscleMass: 0 };
  const prevMetric = metrics[metrics.length - 2] || { weight: 0, bodyFat: 0, muscleMass: 0 };

  // Helper for Habits
  const toggleHabit = (id: string) => {
    const updatedHabits = profile.habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completedToday: !h.completedToday,
          streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    });
    updateProfile({ ...profile, habits: updatedHabits });
  };

  const addHabit = () => {
    const title = prompt("عنوان عادت جدید:");
    if (title) {
      const newHabit: Habit = { id: Date.now().toString(), title, streak: 0, completedToday: false };
      updateProfile({ ...profile, habits: [...profile.habits, newHabit] });
    }
  };

  // Mock Forecast Data
  const forecastData = [
    { day: 'امروز', progress: lastAvailableLog.workoutScore },
    { day: 'فردا', progress: lastAvailableLog.workoutScore + 2 },
    { day: '+2', progress: lastAvailableLog.workoutScore + 5 },
    { day: '+3', progress: lastAvailableLog.workoutScore + 4 },
    { day: '+4', progress: lastAvailableLog.workoutScore + 8 },
  ];

  return (
    <div data-tour-id="dashboard-widgets" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      
      {/* Block 1: Daily Snapshot Widget */}
      <WidgetCard title="نمای روزانه" icon={Activity} color="blue" className={highlightCharts ? 'chart-highlight-animation' : ''}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1 text-gray-400">
              <span>تکمیل تمرین</span>
              <span>{lastAvailableLog.workoutScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full progress-bar-bg">
              <div className="progress-bar-fg h-2 rounded-full" style={{ width: `${lastAvailableLog.workoutScore}%`, background: 'linear-gradient(90deg, #58a6ff, #a371f7)' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-gray-400">
              <span>تغذیه</span>
              <span>{lastAvailableLog.nutritionScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full progress-bar-bg">
              <div className="progress-bar-fg h-2 rounded-full" style={{ width: `${lastAvailableLog.nutritionScore}%`, background: 'linear-gradient(90deg, #3fb950, #facc15)' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-sm text-gray-300">حال امروز:</span>
            <div className="flex space-x-2 space-x-reverse">
               <Smile className={`w-6 h-6 cursor-pointer ${lastAvailableLog.mood === 'happy' ? 'text-yellow-400' : 'text-gray-600'}`} />
               <Zap className={`w-6 h-6 cursor-pointer ${lastAvailableLog.mood === 'energetic' ? 'text-blue-400' : 'text-gray-600'}`} />
            </div>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-700/50 p-2 rounded text-sm text-yellow-200 flex items-center">
            <AlertCircle className="w-4 h-4 ml-1" />
            یادآور: آب کافی بنوشید!
          </div>
        </div>
      </WidgetCard>

      {/* NEW Hydration Widget */}
      <HydrationWidget profile={profile} updateProfile={updateProfile} lastLog={todayLog} updateTodaysLog={updateTodaysLog} />
      
      <WidgetCard title="برنامه تغذیه" icon={Flame} color="green" className={highlightCharts ? 'chart-highlight-animation' : ''}>
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold">میزان مصرف امروز</span>
              <button className="text-xs text-green-400 hover:text-green-300">ویرایش برنامه</button>
           </div>
           
           <div className="flex justify-around text-center">
             <div>
               <div className="text-sm text-gray-500">پروتئین</div>
               <div className="font-bold text-blue-400 text-lg">120g</div>
             </div>
             <div>
               <div className="text-sm text-gray-500">کربوهیدرات</div>
               <div className="font-bold text-green-400 text-lg">250g</div>
             </div>
             <div>
               <div className="text-sm text-gray-500">چربی</div>
               <div className="font-bold text-yellow-400 text-lg">60g</div>
             </div>
           </div>

           <div className="bg-white/5 p-2 rounded mt-2">
             <div className="text-sm text-gray-300 mb-1">پیشنهاد وعده بعدی:</div>
             <div className="text-md font-medium text-white">سینه مرغ گریل شده + برنج قهوه‌ای</div>
           </div>
        </div>
      </WidgetCard>
      
      <WidgetCard title="آنالیز بدن" icon={Activity} color="purple" className={highlightCharts ? 'chart-highlight-animation' : ''}>
         <div className="flex justify-between items-end mb-2">
            <div>
               <div className="text-3xl font-bold text-white">{lastMetric.weight} <span className="text-sm text-gray-500">kg</span></div>
               <div className={`text-sm ${lastMetric.weight < prevMetric.weight ? 'text-green-400' : 'text-red-400'}`}>
                 {lastMetric.weight < prevMetric.weight ? '▼ کاهش' : '▲ افزایش'} نسبت به ماه قبل
               </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">چربی: {lastMetric.bodyFat}%</div>
              <div className="text-sm text-gray-400">ماهیچه: {lastMetric.muscleMass}%</div>
            </div>
         </div>
         <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={metrics.slice(-5)}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a371f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a371f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="weight" stroke="#a371f7" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-2 text-sm bg-purple-900/30 text-purple-300 p-2 rounded">
            پیشنهاد: افزایش کاردیو برای کاهش درصد چربی.
         </div>
      </WidgetCard>

      <WidgetCard title="عادات و انگیزه" icon={Trophy} color="yellow">
         <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
               <span className="text-sm text-gray-300">چک‌لیست روزانه</span>
               <button onClick={addHabit} className="text-yellow-500 hover:text-yellow-400"><Plus size={16}/></button>
            </div>
            {profile.habits.length === 0 ? (
               <div className="text-center text-sm text-gray-500 py-4">عادتی ثبت نشده است</div>
            ) : (
               profile.habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10" onClick={() => toggleHabit(habit.id)}>
                     <div className="flex items-center">
                        <CheckCircle2 className={`w-4 h-4 ml-2 ${habit.completedToday ? 'text-green-500' : 'text-gray-600'}`} />
                        <span className={`text-sm ${habit.completedToday ? 'line-through text-gray-500' : 'text-white'}`}>{habit.title}</span>
                     </div>
                     <div className="flex items-center text-sm text-orange-400">
                        <Flame className="w-3 h-3 ml-1" />
                        {habit.streak}
                     </div>
                  </div>
               ))
            )}
            <div className="mt-3 pt-2 border-t border-white/10">
               <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">ماموریت امروز:</span>
                  <span className="text-sm font-bold text-white">۱۰۰۰ قدم پیاده‌روی</span>
               </div>
            </div>
         </div>
      </WidgetCard>
      
      <WidgetCard title="اهداف و پیش‌بینی" icon={IconLineChart} color="pink" className={highlightCharts ? 'chart-highlight-animation' : ''}>
         <div className="mb-3">
            <h4 className="text-sm text-gray-400 mb-1">هدف اصلی:</h4>
            <div className="bg-pink-900/20 text-pink-200 p-2 rounded text-sm font-medium truncate">
               {profile.goals.length > 0 ? profile.goals[0].text : "هنوز هدفی تعیین نشده"}
            </div>
         </div>
         <div className="h-32 w-full relative">
            <span className="absolute top-0 right-0 text-[10px] text-gray-500">پیش‌بینی عملکرد</span>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={forecastData}>
                  <XAxis dataKey="day" hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#ec4899" strokeWidth={2} dot={{r:3}} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </WidgetCard>
      
      <WidgetCard title="ریکاوری و استرس" icon={Moon} color="indigo" className={highlightCharts ? 'chart-highlight-animation' : ''}>
         <div className="flex items-center justify-between mb-4">
            <div className="text-center">
               <div className="text-2xl font-bold text-indigo-300">{lastAvailableLog.sleepHours || 0}h</div>
               <div className="text-sm text-gray-500">خواب دیشب</div>
            </div>
            <div className="text-center">
               <div className="text-2xl font-bold text-green-300">{lastAvailableLog.restingHeartRate || '--'}</div>
               <div className="text-sm text-gray-500">HRV (تخمینی)</div>
            </div>
         </div>
         <div className="bg-indigo-900/20 rounded p-3">
            <div className="flex justify-between items-center mb-1">
               <span className="text-sm text-gray-300">سطح استرس بدنی</span>
               <span className="text-sm text-indigo-400">متوسط</span>
            </div>
            <div className="w-full h-1.5 rounded-full progress-bar-bg">
               <div className="h-1.5 rounded-full w-[60%]" style={{background: 'linear-gradient(90deg, #818cf8, #c084fc)'}}></div>
            </div>
         </div>
         <div className="mt-3 text-sm text-gray-400">
            پیشنهاد: امروز تمرین سبک یا یوگا انجام دهید.
         </div>
      </WidgetCard>

      <AthleteLevelWidget athleteLevelInfo={athleteLevelInfo} />
    </div>
  );
});
