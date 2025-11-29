
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, DailyLog, AppView } from '../types';
import { analyzeWeightTrend } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Scale, Droplets, Target, Sparkles, Loader2, Edit, Award, Plus, Minus, Lock, Battery, Crown, Moon } from 'lucide-react';

interface HealthHubProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  logs: DailyLog[];
  setCurrentView?: (view: AppView) => void;
}

const WeightGoalSetter: React.FC<{ profile: UserProfile; updateProfile: (p: UserProfile) => void; onCancel: () => void; }> = ({ profile, updateProfile, onCancel }) => {
    const [target, setTarget] = useState(profile.weightGoal?.target || profile.currentWeight);
    const [deadline, setDeadline] = useState(profile.weightGoal?.deadline || '');

    const handleSave = () => {
        const newGoal = {
            target: Number(target),
            deadline,
            startWeight: profile.currentWeight,
        };
        updateProfile({ ...profile, weightGoal: newGoal });
        onCancel(); // Close setter
    };

    return (
        <div className="bg-black/30 p-4 rounded-lg border border-white/10 space-y-3">
            <h4 className="font-bold text-white">تنظیم / ویرایش هدف وزنی</h4>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400">وزن هدف (kg)</label>
                    <input type="number" value={target} onChange={e => setTarget(parseFloat(e.target.value))} className="w-full input-styled p-2" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">تاریخ هدف</label>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full input-styled p-2" />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm">لغو</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">ذخیره هدف</button>
            </div>
        </div>
    );
};


const HealthHub: React.FC<HealthHubProps> = ({ profile, updateProfile, logs, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'hydration' | 'recovery'>('weight');
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const lastLog = logs[logs.length-1];
  const [waterIntake, setWaterIntake] = useState((lastLog?.waterIntake || 0) * 250);
  const isPremium = profile.subscriptionTier !== 'free';

  useEffect(() => {
    if (activeTab === 'weight' && profile.weightGoal && profile.metricsHistory.length > 1) {
      setIsAnalyzing(true);
      analyzeWeightTrend(profile.metricsHistory, profile)
        .then(setAnalysis)
        .finally(() => setIsAnalyzing(false));
    }
  }, [activeTab, profile.weightGoal, profile.metricsHistory, profile]);

  const weightProgress = useMemo(() => {
    if (!profile.weightGoal) return 0;
    const { startWeight, target, deadline } = profile.weightGoal;
    const totalChangeNeeded = Math.abs(startWeight - target);
    if (totalChangeNeeded === 0) return 100;
    const changeAchieved = startWeight - profile.currentWeight;
    if ((target < startWeight && changeAchieved < 0) || (target > startWeight && changeAchieved > 0)) return 0;
    return Math.min(Math.abs(changeAchieved / totalChangeNeeded) * 100, 100);
  }, [profile.weightGoal, profile.currentWeight]);

  const daysRemaining = useMemo(() => {
    if (!profile.weightGoal?.deadline) return null;
    const diff = new Date(profile.weightGoal.deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [profile.weightGoal?.deadline]);

  // Hydration Logic
  const hydrationGoal = useMemo(() => {
    return profile.currentWeight > 0 ? Math.round(profile.currentWeight * 35) : 2500;
  }, [profile.currentWeight]);
  
  const hydrationProgress = Math.min((waterIntake / hydrationGoal) * 100, 100);

  const adjustWater = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };
  
  // Weekly Hydration Data
  const weeklyHydrationData = useMemo(() => {
      return logs.slice(-7).map(log => ({
          name: log.date.split('/')[2] || log.date, // Just the day part
          intake: (log.waterIntake || 0) * 250,
          goal: hydrationGoal
      }));
  }, [logs, hydrationGoal]);
  
  const hydrationPerformanceData = useMemo(() => {
    return logs.map(log => ({
      date: log.date,
      hydration: ((log.waterIntake || 0) * 250 / hydrationGoal) * 100,
      energy: (log.energyLevel || 0) * 10,
    }));
  }, [logs, hydrationGoal]);

  // Recovery Logic (Elite Only)
  const recoveryData = useMemo(() => [
      { subject: 'Sleep', A: (lastLog?.sleepQuality || 0) * 10, fullMark: 100 },
      { subject: 'Strain', A: (lastLog?.workoutScore || 0), fullMark: 100 },
      { subject: 'Stress', A: 100 - (lastLog?.stressIndex || 50), fullMark: 100 },
      { subject: 'Hydration', A: Math.min(((lastLog?.waterIntake || 0) * 250 / hydrationGoal) * 100, 100), fullMark: 100 },
      { subject: 'Nutrition', A: lastLog?.nutritionScore || 0, fullMark: 100 },
  ], [lastLog, hydrationGoal]);

  const recoveryScore = useMemo(() => {
      if(!lastLog) return 0;
      const scores = recoveryData.map(d => d.A);
      return Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
  }, [recoveryData]);


  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Navigation */}
      <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 shrink-0">
        <button 
            onClick={() => setActiveTab('weight')} 
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center transition-all ${activeTab === 'weight' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
            <Scale className="w-5 h-5 ml-2" /> مدیریت وزن
        </button>
        <button 
            onClick={() => setActiveTab('hydration')} 
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center transition-all ${activeTab === 'hydration' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
            <Droplets className="w-5 h-5 ml-2" /> آبرسانی هوشمند
        </button>
        <button 
            onClick={() => setActiveTab('recovery')} 
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center transition-all relative ${activeTab === 'recovery' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
            <Battery className="w-5 h-5 ml-2" /> ریکاوری
            {!isPremium && <Lock size={12} className="absolute top-2 left-2 text-yellow-500" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {activeTab === 'weight' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
             {/* Goal Card */}
             <div className="lg:col-span-1 energetic-card p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-lg text-white flex items-center"><Target className="ml-2 text-red-500"/> هدف وزنی</h3>
                    <button onClick={() => setIsGoalEditing(!isGoalEditing)} className="text-gray-400 hover:text-white"><Edit size={16}/></button>
                </div>
                
                {isGoalEditing ? (
                    <WeightGoalSetter profile={profile} updateProfile={updateProfile} onCancel={() => setIsGoalEditing(false)} />
                ) : profile.weightGoal ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-4xl font-black text-white">{profile.currentWeight}</span>
                            <span className="text-gray-400 text-sm mx-2">➔</span>
                            <span className="text-4xl font-black text-green-400">{profile.weightGoal.target}</span>
                            <span className="text-xs text-gray-500 block mt-1">کیلوگرم</span>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>پیشرفت کلی</span>
                                <span>{Math.round(weightProgress)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000" style={{width: `${weightProgress}%`}}></div>
                            </div>
                        </div>
                        {daysRemaining !== null && (
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <span className="block text-2xl font-bold text-white">{daysRemaining}</span>
                                <span className="text-xs text-gray-400">روز باقی‌مانده تا هدف</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm mb-4">هنوز هدفی تعیین نکرده‌اید.</p>
                        <button onClick={() => setIsGoalEditing(true)} className="btn-primary py-2 px-6 text-sm">تعیین هدف جدید</button>
                    </div>
                )}
             </div>

             {/* Chart Card */}
             <div className="lg:col-span-2 energetic-card p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center"><Scale className="ml-2 text-purple-500"/> روند تغییرات وزن</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={profile.metricsHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={10}/>
                            <YAxis stroke="#9ca3af" domain={['dataMin - 2', 'dataMax + 2']} fontSize={10}/>
                            <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} />
                            <Line type="monotone" dataKey="weight" stroke="#c084fc" strokeWidth={3} dot={{r:4}} />
                            {profile.weightGoal && (
                                <Line type="monotone" dataKey={() => profile.weightGoal?.target} stroke="#4ade80" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* AI Analysis */}
                <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="font-bold text-purple-300 mb-2 flex items-center"><Sparkles size={16} className="ml-2"/> تحلیل هوشمند روند</h4>
                    {isAnalyzing ? (
                        <div className="flex items-center text-purple-200 text-sm"><Loader2 className="animate-spin ml-2 h-4 w-4"/> در حال تحلیل داده‌های شما...</div>
                    ) : (
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {analysis || "برای دریافت تحلیل، حداقل دو وزن ثبت کنید و هدف خود را مشخص نمایید."}
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'hydration' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
                 {/* Daily Tracker */}
                 <div className="energetic-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-cyan-900/10 z-0"></div>
                     <div className="relative z-10">
                         <h3 className="font-bold text-lg text-white mb-6">مصرف آب امروز</h3>
                         <div className="relative w-40 h-64 border-4 border-gray-600 rounded-b-3xl rounded-t-lg bg-gray-900 overflow-hidden mx-auto mb-6">
                            <div 
                                className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-700 ease-out" 
                                style={{ height: `${hydrationProgress}%`, opacity: 0.8 }}
                            >
                                <div className="w-full h-full animate-pulse bg-cyan-400 opacity-50"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <span className="text-3xl font-black text-white drop-shadow-md">{Math.round(hydrationProgress)}%</span>
                            </div>
                         </div>
                         
                         <p className="text-gray-300 mb-4 font-mono text-lg">{waterIntake} / {hydrationGoal} ml</p>
                         
                         <div className="flex gap-4 justify-center">
                             <button onClick={() => adjustWater(-250)} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"><Minus size={20} /></button>
                             <button onClick={() => adjustWater(250)} className="p-3 bg-cyan-600 rounded-full hover:bg-cyan-500 transition shadow-lg shadow-cyan-500/30"><Plus size={20} /></button>
                         </div>
                     </div>
                 </div>

                 {/* Charts */}
                 <div className="space-y-6">
                     <div className="energetic-card p-6">
                        <h3 className="font-bold text-lg text-white mb-4">عملکرد هفتگی</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyHydrationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10}/>
                                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} />
                                    <Bar dataKey="intake" fill="#06b6d4" radius={[4, 4, 0, 0]} name="مصرف (ml)" />
                                    <Line type="monotone" dataKey="goal" stroke="#facc15" strokeDasharray="5 5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="energetic-card p-6">
                        <h3 className="font-bold text-lg text-white mb-4">تاثیر بر انرژی</h3>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hydrationPerformanceData}>
                                    <XAxis dataKey="date" hide />
                                    <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} />
                                    <Legend wrapperStyle={{fontSize: '10px'}}/>
                                    <Line type="monotone" dataKey="hydration" stroke="#06b6d4" strokeWidth={2} dot={false} name="هیدراتاسیون %" />
                                    <Line type="monotone" dataKey="energy" stroke="#eab308" strokeWidth={2} dot={false} name="انرژی (۰-۱۰۰)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                 </div>
             </div>
        )}

        {activeTab === 'recovery' && (
             <div className="relative min-h-[500px] animate-in fade-in">
                 {!isPremium && (
                     <div className="absolute inset-0 z-20 backdrop-blur-sm bg-black/60 flex flex-col items-center justify-center rounded-2xl border border-yellow-500/30">
                         <Crown size={64} className="text-yellow-500 mb-4 animate-bounce" />
                         <h3 className="text-2xl font-black text-white mb-2">قفل شده برای اعضای Elite</h3>
                         <p className="text-gray-300 mb-6 max-w-md text-center px-4">
                             تحلیل پیشرفته ریکاوری، امتیاز خواب و مدیریت استرس تنها بخشی از امکانات نسخه حرفه‌ای است.
                         </p>
                         <button 
                             onClick={() => setCurrentView && setCurrentView(AppView.SUBSCRIPTION_LANDING)}
                             className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition"
                         >
                             ارتقا به عضویت Elite
                         </button>
                     </div>
                 )}

                 <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!isPremium ? 'opacity-20 pointer-events-none' : ''}`}>
                      <div className="energetic-card p-6 flex flex-col items-center justify-center">
                          <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                              <Battery className={recoveryScore > 70 ? 'text-green-500' : 'text-yellow-500'} />
                              امتیاز آمادگی روزانه
                          </h3>
                          <div className="relative w-48 h-48 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={recoveryData}>
                                      <PolarGrid stroke="#4b5563" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                      <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                      <Tooltip />
                                  </RadarChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-3xl font-black text-white">{recoveryScore}</span>
                              </div>
                          </div>
                          <div className="mt-4 text-center">
                              <p className="text-sm text-gray-400">بر اساس خواب، استرس و بار تمرینی</p>
                              <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold inline-block ${recoveryScore > 70 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                  {recoveryScore > 70 ? 'آماده برای فشار بالا' : 'نیاز به ریکاوری فعال'}
                              </div>
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div className="energetic-card p-6">
                              <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><Moon className="text-indigo-400"/> تحلیل خواب</h3>
                              <div className="flex justify-between items-center mb-4">
                                  <div className="text-center">
                                      <span className="block text-2xl font-bold text-white">{lastLog?.sleepHours || 0}h</span>
                                      <span className="text-xs text-gray-500">مدت زمان</span>
                                  </div>
                                  <div className="text-center">
                                      <span className="block text-2xl font-bold text-indigo-400">{lastLog?.sleepQuality || 0}/10</span>
                                      <span className="text-xs text-gray-500">کیفیت</span>
                                  </div>
                                  <div className="text-center">
                                      <span className="block text-2xl font-bold text-pink-400">{lastLog?.restingHeartRate || '--'}</span>
                                      <span className="text-xs text-gray-500">ضربان استراحت</span>
                                  </div>
                              </div>
                              <div className="bg-indigo-900/20 p-3 rounded-lg text-sm text-indigo-200">
                                  <p>خواب دیشب شما کافی بود، اما کیفیت آن می‌تواند بهتر باشد. سعی کنید ۱ ساعت قبل خواب از نور آبی پرهیز کنید.</p>
                              </div>
                          </div>

                          <div className="energetic-card p-6">
                              <h3 className="font-bold text-lg text-white mb-2">توصیه هوشمند امروز</h3>
                              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                                  <li>تمرینات کششی سبک انجام دهید.</li>
                                  <li>مصرف منیزیم قبل از خواب پیشنهاد می‌شود.</li>
                                  <li>حمام آب سرد برای کاهش التهاب.</li>
                              </ul>
                          </div>
                      </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default HealthHub;
