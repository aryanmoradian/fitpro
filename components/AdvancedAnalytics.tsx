
import React, { useState, useEffect } from 'react';
import { UserProfile, AdvancedHealthData, HormonePanel, GeneticTrait, PostureScan, DailyLog, NutritionItem, AppView } from '../types';
import { 
  Dna, Activity, HeartPulse, BrainCircuit, ScanLine, FileText, 
  TrendingUp, AlertTriangle, Battery, Gauge, Wind, ChevronDown, ChevronUp, Edit, Save, Plus, Trash2, X, BarChart2, PieChart, Sparkles, Loader2, Link2, Info
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  AreaChart, Area, Pie, ComposedChart
} from 'recharts';
import { analyzeStrengthsAndWeaknesses } from '../services/geminiService';

// --- NEW: Reusable Tooltip Component ---
const InfoTooltip: React.FC<{ info: string }> = ({ info }) => {
  return (
    <div className="relative group flex items-center">
      <Info size={14} className="text-gray-400 cursor-pointer" />
      <div className="absolute bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-600 shadow-lg z-10" style={{ transform: 'translateX(-50%)', left: '50%' }}>
        {info}
      </div>
    </div>
  );
};

const AdvancedAnalyticsForm: React.FC<{
  initialData: AdvancedHealthData;
  onSave: (data: AdvancedHealthData) => void;
  onCancel: () => void;
}> = React.memo(({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleMetricChange = (field: 'vo2Max' | 'metabolicAge' | 'recoveryIndex', value: string) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleGeneticChange = (id: string, field: 'trait' | 'result' | 'impact', value: string) => {
    setFormData(prev => ({
      ...prev,
      geneticProfile: prev.geneticProfile.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addGeneticTrait = () => {
    const newTrait: GeneticTrait = { id: Date.now().toString(), trait: '', result: '', impact: 'Medium' };
    setFormData(prev => ({ ...prev, geneticProfile: [...prev.geneticProfile, newTrait] }));
  };

  const removeGeneticTrait = (id: string) => {
    setFormData(prev => ({ ...prev, geneticProfile: prev.geneticProfile.filter(item => item.id !== id) }));
  };

  const handleHormoneChange = (id: string, field: 'date' | 'testosterone' | 'cortisol' | 'thyroidTSH', value: string) => {
     setFormData(prev => ({
      ...prev,
      hormonalHistory: prev.hormonalHistory.map(item =>
        item.id === id ? { ...item, [field]: field === 'date' ? value : Number(value) } : item
      ),
    }));
  };

  const addHormoneEntry = () => {
    const newEntry: HormonePanel = { id: Date.now().toString(), date: new Date().toLocaleDateString('fa-IR', {year: 'numeric', month: '2-digit'}), testosterone: 0, cortisol: 0, thyroidTSH: 0 };
    setFormData(prev => ({ ...prev, hormonalHistory: [...prev.hormonalHistory, newEntry] }));
  };

  const removeHormoneEntry = (id: string) => {
     setFormData(prev => ({ ...prev, hormonalHistory: prev.hormonalHistory.filter(item => item.id !== id) }));
  };


  return (
    <div className="energetic-card p-6 space-y-6 animate-in fade-in">
        <h2 className="text-xl font-bold text-white flex justify-between items-center">
            مدیریت داده‌های پیشرفته
            <button onClick={onCancel} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </h2>

        {/* Performance Metrics */}
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold mb-3 text-blue-300">شاخص‌های کلیدی عملکرد</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                        VO2 Max (ml/kg/min)
                        <InfoTooltip info="حداکثر اکسیژن مصرفی بدن حین ورزش. نشان‌دهنده استقامت قلبی-عروقی است." />
                    </label>
                    <input type="number" value={formData.vo2Max} onChange={e => handleMetricChange('vo2Max', e.target.value)} className="w-full input-styled p-2"/>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                        سن متابولیک
                        <InfoTooltip info="مقایسه نرخ متابولیسم پایه شما با میانگین سن گروه شما. عدد پایین‌تر بهتر است." />
                    </label>
                    <input type="number" value={formData.metabolicAge} onChange={e => handleMetricChange('metabolicAge', e.target.value)} className="w-full input-styled p-2"/>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                        شاخص ریکاوری (۱-۱۰۰)
                        <InfoTooltip info="یک امتیاز کلی بر اساس کیفیت خواب، HRV و ضربان قلب استراحت برای ارزیابی آمادگی بدن برای تمرین." />
                    </label>
                    <input type="number" value={formData.recoveryIndex} onChange={e => handleMetricChange('recoveryIndex', e.target.value)} className="w-full input-styled p-2"/>
                </div>
            </div>
        </div>
        
        {/* Genetic Profile */}
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-purple-300 flex items-center gap-2">پروفایل ژنتیکی <InfoTooltip info="نتایج تست ژنتیک ورزشی خود را وارد کنید تا توصیه‌های شخصی‌سازی شده دریافت کنید."/></h3>
                <button onClick={addGeneticTrait} className="text-xs bg-purple-600/50 text-white px-2 py-1 rounded flex items-center"><Plus size={14} className="ml-1"/> افزودن</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.geneticProfile.map(item => (
                    <div key={item.id} className="grid grid-cols-8 gap-2 items-center">
                        <input placeholder="ویژگی (مثلا: نوع تار ماهیچه‌ای)" value={item.trait} onChange={e => handleGeneticChange(item.id, 'trait', e.target.value)} className="col-span-3 input-styled p-1 text-xs"/>
                        <input placeholder="نتیجه (مثلا: تند انقباض)" value={item.result} onChange={e => handleGeneticChange(item.id, 'result', e.target.value)} className="col-span-3 input-styled p-1 text-xs"/>
                        <select value={item.impact} onChange={e => handleGeneticChange(item.id, 'impact', e.target.value)} className="col-span-1 input-styled p-1 text-xs">
                            <option>High</option><option>Medium</option><option>Low</option>
                        </select>
                        <button onClick={() => removeGeneticTrait(item.id)} className="text-red-500"><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
        </div>

        {/* Hormonal History */}
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
             <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-red-300 flex items-center gap-2">تاریخچه هورمونی <InfoTooltip info="نتایج آزمایش خون خود را برای رصد هورمون‌های کلیدی مؤثر بر عملکرد ورزشی وارد کنید."/></h3>
                <button onClick={addHormoneEntry} className="text-xs bg-red-600/50 text-white px-2 py-1 rounded flex items-center"><Plus size={14} className="ml-1"/> افزودن</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.hormonalHistory.map(item => (
                    <div key={item.id} className="grid grid-cols-10 gap-2 items-center">
                         <input placeholder="تاریخ" value={item.date} onChange={e => handleHormoneChange(item.id, 'date', e.target.value)} className="col-span-2 input-styled p-1 text-xs"/>
                         <input placeholder="تستوسترون" type="number" value={item.testosterone} onChange={e => handleHormoneChange(item.id, 'testosterone', e.target.value)} className="col-span-2 input-styled p-1 text-xs"/>
                         <input placeholder="کورتیزول" type="number" value={item.cortisol} onChange={e => handleHormoneChange(item.id, 'cortisol', e.target.value)} className="col-span-2 input-styled p-1 text-xs"/>
                         <input placeholder="TSH" type="number" value={item.thyroidTSH} onChange={e => handleHormoneChange(item.id, 'thyroidTSH', e.target.value)} className="col-span-2 input-styled p-1 text-xs"/>
                         <button onClick={() => removeHormoneEntry(item.id)} className="text-red-500"><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
        </div>


        <div className="flex justify-end pt-4 border-t border-white/10">
            <button onClick={() => onSave(formData)} className="btn-primary py-2 px-6 flex items-center">
                <Save size={16} className="ml-2"/> ذخیره پروفایل
            </button>
        </div>
    </div>
  );
});

const WidgetCard: React.FC<{
  title: string;
  icon: React.ElementType;
  hasData: boolean;
  emptyState: { message: string; ctaText: string; onCtaClick: () => void; };
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = React.memo(({ title, icon: Icon, hasData, emptyState, children, className = '', color = 'blue' }) => {
  const colorVariants: { [key: string]: string } = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
  };
  
  const bgColorVariants: { [key: string]: string } = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    green: 'bg-green-600 hover:bg-green-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-500',
    purple: 'bg-purple-600 hover:bg-purple-500',
    red: 'bg-red-600 hover:bg-red-500',
    orange: 'bg-orange-600 hover:bg-orange-500',
    yellow: 'bg-yellow-600 hover:bg-yellow-500',
    cyan: 'bg-cyan-600 hover:bg-cyan-500',
  };
  
  return (
    <div className={`energetic-card p-5 flex flex-col min-h-[300px] ${!hasData ? 'bg-opacity-50' : ''} ${className}`}>
      <h3 className={`text-base font-bold text-white mb-4 flex items-center justify-between`}>
        <div className='flex items-center'>
          <Icon className={`w-5 h-5 ml-2 ${hasData ? colorVariants[color] : 'text-gray-500'}`} />
          {title}
        </div>
        {!hasData && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
      </h3>
      <div className="flex-1 flex flex-col justify-center">
        {hasData ? (
          <div className="w-full h-full animate-in fade-in">
            {children}
          </div>
        ) : (
          <div className="text-center animate-in fade-in">
            <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-3">
               <Icon className="w-6 h-6 text-gray-500"/>
            </div>
            <p className="text-xs text-gray-400 mb-4">{emptyState.message}</p>
            <button onClick={emptyState.onCtaClick} className={`${bgColorVariants[color]} text-white text-xs font-bold py-2 px-4 rounded-lg transition`}>
              {emptyState.ctaText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});


const AdvancedAnalyticsDashboard: React.FC<{
  profile: UserProfile;
  logs: DailyLog[];
  nutritionPlan: NutritionItem[];
  onEdit: () => void;
  setCurrentView: (view: AppView) => void;
}> = React.memo(({ profile, logs, onEdit, setCurrentView }) => {
    const [coachAnalysis, setCoachAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (logs.length > 1) { // Need at least 2 logs for a trend
            setIsAnalyzing(true);
            analyzeStrengthsAndWeaknesses(logs, profile.metricsHistory)
                .then(setCoachAnalysis)
                .catch(err => setCoachAnalysis("خطا در دریافت تحلیل."))
                .finally(() => setIsAnalyzing(false));
        }
    }, [logs, profile.metricsHistory]);


  const hasTrainingData = logs.length > 0;
  const hasNutritionData = logs.some(l => l.consumedMacros && l.consumedMacros.calories > 0);
  const hasBodyCompData = profile.metricsHistory.length > 1;
  const hasRecoveryData = logs.some(l => l.sleepHours && l.sleepHours > 0);
  const hasKpiData = profile.advancedHealth && profile.advancedHealth.vo2Max > 0;
  const hasBioData = !!profile.advancedHealth && (profile.advancedHealth.geneticProfile.length > 0 || profile.advancedHealth.hormonalHistory.length > 0);
  const hasSynergyData = hasTrainingData && hasNutritionData;

  const lastLog = logs[logs.length-1];
  const macroData = [
    { name: 'پروتئین', value: lastLog?.consumedMacros?.protein || 0, fill: '#60a5fa' },
    { name: 'کربوهیدرات', value: lastLog?.consumedMacros?.carbs || 0, fill: '#4ade80' },
    { name: 'چربی', value: lastLog?.consumedMacros?.fats || 0, fill: '#facc15' },
  ];
  
  const recoveryScoreData = [
      { subject: 'خواب', A: (lastLog?.sleepQuality || 0) * 10, fullMark: 100 },
      { subject: 'انرژی', A: (lastLog?.energyLevel || 0) * 10, fullMark: 100 },
      { subject: 'استرس', A: 100 - ((lastLog?.stressIndex || 50)), fullMark: 100 },
      { subject: 'RHR', A: 100 - ((lastLog?.restingHeartRate || 70)-40), fullMark: 100 },
  ];

  return (
      <div data-tour-id="advanced-analytics-dashboard" className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900 p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <BrainCircuit className="text-blue-400"/>
                      داشبورد تحلیلی پیشرفته
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm">عملکرد خود را از تمام زوایا بررسی کنید.</p>
                </div>
                <button onClick={onEdit} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg flex items-center">
                  <Edit size={18} className="ml-2"/> ویرایش پروفایل بیومتریک
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <WidgetCard title="شاخص‌های کلیدی عملکرد" icon={Gauge} hasData={hasKpiData} emptyState={{ message: "برای آنالیز دقیق‌تر، شاخص‌های عملکردی مانند VO2 Max و سن متابولیک را وارد کنید.", ctaText: "افزودن داده‌ها", onCtaClick: onEdit }} color="cyan">
                <div className="grid grid-cols-3 gap-2 text-center h-full content-around">
                    <div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">VO2 Max <InfoTooltip info="حداکثر اکسیژن مصرفی بدن حین ورزش (ml/kg/min). بالاتر بهتر است." /></div>
                        <div className="text-3xl font-bold text-cyan-300 mt-1">{profile.advancedHealth?.vo2Max}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">سن متابولیک <InfoTooltip info="نرخ متابولیسم پایه شما در مقایسه با میانگین سنی. پایین‌تر بهتر است." /></div>
                        <div className="text-3xl font-bold text-cyan-300 mt-1">{profile.advancedHealth?.metabolicAge}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">ریکاوری <InfoTooltip info="امتیاز کلی آمادگی بدن برای تمرین (۱-۱۰۰)." /></div>
                        <div className="text-3xl font-bold text-cyan-300 mt-1">{profile.advancedHealth?.recoveryIndex}%</div>
                    </div>
                </div>
                <div className="mt-4 text-sm bg-cyan-900/30 text-cyan-300 p-2 rounded text-center">
                    پیشنهاد: برای بهبود VO2 Max، تمرینات HIIT را به برنامه خود اضافه کنید.
                </div>
            </WidgetCard>

            <WidgetCard title="شاخص پیشرفت تمرینی" icon={TrendingUp} hasData={hasTrainingData} emptyState={{ message: "برای فعال‌سازی این شاخص، تمرینات خود را ثبت کنید.", ctaText: "ثبت تمرین امروز", onCtaClick: () => setCurrentView(AppView.TRACKER) }} color="blue">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={logs} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs><linearGradient id="cT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10}/>
                        <Tooltip/>
                        <Area type="monotone" dataKey="workoutScore" stroke="#3b82f6" strokeWidth={2} fill="url(#cT)" name="امتیاز تمرین" />
                    </AreaChart>
                </ResponsiveContainer>
            </WidgetCard>
            
            <WidgetCard title="امتیاز تغذیه و سلامت" icon={PieChart} hasData={hasNutritionData} emptyState={{ message: "وعده‌های تغذیه خود را ثبت کنید تا این نمودار فعال شود.", ctaText: "ثبت تغذیه امروز", onCtaClick: () => setCurrentView(AppView.TRACKER) }} color="green">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} className="text-xs" />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </WidgetCard>

            <WidgetCard title="امتیاز ریکاوری و خواب" icon={HeartPulse} hasData={hasRecoveryData} emptyState={{ message: "اطلاعات خواب و ریکاوری خود را ثبت کنید تا این بخش فعال شود.", ctaText: "ثبت وضعیت امروز", onCtaClick: () => setCurrentView(AppView.TRACKER) }} color="indigo">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={recoveryScoreData}>
                        <PolarGrid stroke="#4b5563" />
                        <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={12} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="امتیاز" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </WidgetCard>
            
            <WidgetCard title="تحلیل ترکیب بدنی" icon={BarChart2} hasData={hasBodyCompData} emptyState={{ message: "برای مشاهده روند، حداقل دو بار اطلاعات بدن خود را ثبت کنید.", ctaText: "ثبت وضعیت جدید", onCtaClick: () => setCurrentView(AppView.BODY_ANALYSIS) }} color="purple">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profile.metricsHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={10}/>
                        <YAxis stroke="#9ca3af" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']}/>
                        <Tooltip />
                        <Legend wrapperStyle={{fontSize: "10px"}} />
                        <Line type="monotone" dataKey="weight" stroke="#c084fc" name="وزن" strokeWidth={2} />
                        <Line type="monotone" dataKey="bodyFat" stroke="#f472b6" name="چربی %" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </WidgetCard>
            
            <WidgetCard title="پروفایل بیولوژیک و ژنتیک" icon={Dna} hasData={hasBioData} emptyState={{ message: "پروفایل ژنتیکی و هورمونی خود را برای دریافت توصیه‌های شخصی‌سازی‌شده تکمیل کنید.", ctaText: "تکمیل پروفایل", onCtaClick: onEdit }} color="red">
                <div className="space-y-3 overflow-y-auto max-h-52 custom-scrollbar">
                    {profile.advancedHealth?.geneticProfile.slice(0, 4).map(g => (
                        <div key={g.id} className="text-sm bg-white/5 p-2 rounded flex justify-between">
                            <span className="text-gray-300">{g.trait}</span>
                            <span className="font-bold text-white">{g.result}</span>
                        </div>
                    ))}
                     {profile.advancedHealth && profile.advancedHealth?.geneticProfile.length > 4 && <p className="text-xs text-center text-gray-500">و موارد دیگر...</p>}
                </div>
            </WidgetCard>
            
            <WidgetCard title="هم‌افزایی تمرین و تغذیه" icon={Link2} hasData={hasSynergyData} emptyState={{ message: "برای فعال‌سازی، تمرین و تغذیه خود را ثبت کنید.", ctaText: "برو به ثبت روزانه", onCtaClick: () => setCurrentView(AppView.TRACKER) }} color="orange">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={logs}>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={10}/>
                      <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10}/>
                      <Tooltip />
                      <Legend wrapperStyle={{fontSize: "10px"}} />
                      <Area yAxisId="left" type="monotone" dataKey="workoutScore" fill="#3b82f6" stroke="#3b82f6" name="تمرین" fillOpacity={0.2}/>
                      <Line yAxisId="right" type="monotone" dataKey="nutritionScore" stroke="#10b981" name="تغذیه" strokeWidth={2}/>
                   </ComposedChart>
                </ResponsiveContainer>
            </WidgetCard>
            
            <WidgetCard title="توصیه‌های مربی هوشمند" icon={Sparkles} hasData={!!coachAnalysis} emptyState={{ message: "حداقل دو روز را ثبت کنید تا مربی بتواند به شما بازخورد دهد.", ctaText: "ثبت فعالیت", onCtaClick: () => setCurrentView(AppView.TRACKER) }} className="md:col-span-2 xl:col-span-3" color="yellow">
                {isAnalyzing ? (
                    <div className="flex items-center justify-center h-full text-gray-400"><Loader2 className="animate-spin w-6 h-6"/></div>
                ) : (
                    <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-52 custom-scrollbar" dangerouslySetInnerHTML={{__html: coachAnalysis.replace(/\n/g, '<br />').replace(/(\d\.)/g, '<br/><strong>$1</strong>')}}></div>
                )}
            </WidgetCard>
        </div>
        
        {/* Monthly Reminder */}
        <div className="mt-6 energetic-card p-4 flex items-center justify-between">
            <p className="text-sm text-gray-300">یادآوری ماهانه برای بروزرسانی داده‌ها</p>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" onChange={(e) => alert(e.target.checked ? 'یادآوری ماهانه فعال شد.' : 'یادآوری ماهانه غیرفعال شد.')} />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    </div>
  );
});

const AdvancedAnalyticsGuide: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const GuideCard: React.FC<{ title: string; icon: React.ElementType; description: string; howTo: string[]; }> = ({ title, icon: Icon, description, howTo }) => (
    <div className="energetic-card p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <Icon className="w-8 h-8 text-blue-400 mr-3" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4 flex-grow">{description}</p>
      <div className="border-t border-white/10 pt-4 mt-auto">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">چگونه این داده‌ها را بدست آوریم؟</h4>
        <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
          {howTo.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="h-full flex items-center justify-center animate-in fade-in p-4">
      <div className="text-center bg-black/30 p-8 rounded-2xl border border-white/10 shadow-xl max-w-5xl">
        <BrainCircuit className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-3">راهنمای جامع تحلیل پیشرفته</h2>
        <p className="text-gray-400 mb-8 max-w-3xl mx-auto">
          برای باز کردن قفل تحلیل‌های هوشمند و شخصی‌سازی شده، اطلاعات زیر را تکمیل کنید. این راهنما به شما کمک می‌کند تا داده‌های مورد نیاز را بدست آورید.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-right">
          <GuideCard 
            title="شاخص‌های عملکردی" 
            icon={Gauge}
            description="این شاخص‌ها وضعیت هوازی و متابولیک بدن شما را نشان می‌دهند و برای سنجش استقامت ضروری هستند."
            howTo={[
              "آزمایش در آزمایشگاه ورزشی (دقیق‌ترین روش).",
              "استفاده از ساعت‌های ورزشی پیشرفته (مانند Garmin, Polar).",
              "انجام تست‌های میدانی مانند تست کوپر (Cooper Test)."
            ]}
          />
          <GuideCard 
            title="پنل هورمونی" 
            icon={FileText}
            description="سطح هورمون‌های کلیدی مانند تستوسترون و کورتیزول بر ریکاوری و قدرت شما تاثیر مستقیم دارند."
            howTo={[
              "مراجعه به پزشک و درخواست آزمایش خون.",
              "استفاده از کیت‌های آزمایش خانگی معتبر.",
              "رصد نتایج در طول زمان برای مشاهده روند تغییرات."
            ]}
          />
          <GuideCard 
            title="پروفایل ژنتیکی" 
            icon={Dna}
            description="ویژگی‌های ژنتیکی شما (مانند نوع تارهای ماهیچه‌ای) می‌تواند به شخصی‌سازی برنامه تمرینی‌تان کمک کند."
            howTo={[
              "سفارش کیت‌ تست ژنتیک ورزشی آنلاین (مانند 23andMe).",
              "دریافت نتایج و وارد کردن داده‌های مرتبط با ورزش.",
              "مشاوره با متخصص ژنتیک ورزشی برای تحلیل عمیق‌تر."
            ]}
          />
        </div>

        <button 
          onClick={onStart}
          className="btn-primary py-3 px-8 text-lg"
        >
          شروع ورود داده‌ها
        </button>
      </div>
    </div>
  );
};

interface AdvancedAnalyticsProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  logs: DailyLog[];
  nutritionPlan: NutritionItem[];
  setCurrentView: (view: AppView) => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ profile, updateProfile, logs, nutritionPlan, setCurrentView }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = (data: AdvancedHealthData) => {
    updateProfile({ ...profile, advancedHealth: data });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
      if (profile.advancedHealth) {
          setIsEditing(false);
      }
  };

  // If user is editing, show the form.
  if (isEditing) {
    return (
        <AdvancedAnalyticsForm 
            initialData={profile.advancedHealth || {
                geneticProfile: [], hormonalHistory: [], vo2Max: 0, 
                metabolicAge: profile.age, postureScans: [], recoveryIndex: 0
            }}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
  }

  // If there's no advanced data yet, show the guide.
  if (!profile.advancedHealth) {
    return <AdvancedAnalyticsGuide onStart={() => setIsEditing(true)} />;
  }
  
  // Otherwise, show the main dashboard.
  return (
    <AdvancedAnalyticsDashboard 
      profile={profile}
      logs={logs}
      nutritionPlan={nutritionPlan}
      onEdit={() => setIsEditing(true)}
      setCurrentView={setCurrentView}
    />
  );
};

export default React.memo(AdvancedAnalytics);
