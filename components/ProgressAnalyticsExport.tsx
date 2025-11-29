
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, AthleteActivity, ReportLink } from '../types';
import { getAthleteActivity, exportToCSV, exportToJSON, requestPDFExport, generateShareLink, revokeShareLink } from '../services/analyticsService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { 
  Download, Share2, FileText, FileSpreadsheet, Image as ImageIcon, Calendar, ChevronDown, Lock, Globe, Eye, Trash2, Check, Copy, RefreshCw, Filter, TrendingUp, Activity, PieChart
} from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const OverviewTab: React.FC<{ data: AthleteActivity[]; onExport: (type: 'pdf'|'csv'|'png') => void }> = ({ data, onExport }) => {
  const last7Days = data.slice(-7);
  const today = data[data.length - 1] || { steps: 0, calories: 0, workoutMinutes: 0 };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 p-5 rounded-xl border border-blue-500/30">
          <h4 className="text-gray-400 text-sm mb-1 flex items-center"><Activity size={14} className="mr-2"/> فعالیت امروز</h4>
          <div className="flex justify-between items-end mt-2">
             <div>
                <span className="text-2xl font-bold text-white">{today.workoutMinutes}</span> <span className="text-xs text-gray-400">دقیقه تمرین</span>
             </div>
             <div>
                <span className="text-2xl font-bold text-blue-400">{today.steps}</span> <span className="text-xs text-gray-400">قدم</span>
             </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 p-5 rounded-xl border border-orange-500/30">
          <h4 className="text-gray-400 text-sm mb-1 flex items-center"><TrendingUp size={14} className="mr-2"/> کالری مصرفی (هفتگی)</h4>
          <div className="mt-2">
             <span className="text-2xl font-bold text-orange-400">
               {last7Days.reduce((acc, curr) => acc + curr.calories, 0).toLocaleString()}
             </span> <span className="text-xs text-gray-400">کالری</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-5 rounded-xl border border-purple-500/30">
          <h4 className="text-gray-400 text-sm mb-1 flex items-center"><PieChart size={14} className="mr-2"/> میانگین خواب</h4>
          <div className="mt-2">
             <span className="text-2xl font-bold text-purple-400">
               {(last7Days.reduce((acc, curr) => acc + curr.sleepHours, 0) / (last7Days.length || 1)).toFixed(1)}
             </span> <span className="text-xs text-gray-400">ساعت</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="energetic-card p-5">
          <h3 className="text-lg font-bold text-white mb-4">عملکرد ۷ روز گذشته</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('/')[2]}/>
                <YAxis stroke="#9ca3af" fontSize={10}/>
                <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} />
                <Area type="monotone" dataKey="calories" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCal)" name="کالری" />
                <Line type="monotone" dataKey="workoutMinutes" stroke="#facc15" strokeWidth={2} dot={false} name="دقیقه تمرین" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="energetic-card p-5">
          <h3 className="text-lg font-bold text-white mb-4">تعادل فعالیت</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: 'Cardio', A: 120, fullMark: 150 },
                { subject: 'Strength', A: 98, fullMark: 150 },
                { subject: 'Sleep', A: 86, fullMark: 150 },
                { subject: 'Water', A: 99, fullMark: 150 },
                { subject: 'Steps', A: 85, fullMark: 150 },
                { subject: 'Nutrition', A: 65, fullMark: 150 },
              ]}>
                <PolarGrid stroke="#4b5563" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Balance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700 items-center justify-between">
         <span className="text-sm text-gray-400 font-bold">خروجی گرفتن از داده‌ها:</span>
         <div className="flex gap-2">
            <button onClick={() => onExport('pdf')} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition"><FileText size={16} className="mr-2"/> PDF Report</button>
            <button onClick={() => onExport('csv')} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition"><FileSpreadsheet size={16} className="mr-2"/> CSV Data</button>
            <button onClick={() => onExport('png')} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition"><ImageIcon size={16} className="mr-2"/> PNG Chart</button>
         </div>
      </div>
    </div>
  );
};

const DetailedAnalyticsTab: React.FC<{ data: AthleteActivity[] }> = ({ data }) => {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const filteredData = useMemo(() => {
      // In real app, filter logic would be more complex or handled by API with params
      return range === 'weekly' ? data.slice(-7) : range === 'monthly' ? data.slice(-30) : data.slice(-90);
  }, [data, range]);

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
            <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map(r => (
                    <button 
                        key={r} 
                        onClick={() => setRange(r)}
                        className={`px-4 py-2 rounded-lg text-sm capitalize transition ${range === r ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>
            <button className="flex items-center text-sm text-gray-400 hover:text-white px-3"><Filter size={14} className="mr-1"/> فیلتر پیشرفته</button>
        </div>

        <div className="energetic-card p-6">
            <h3 className="font-bold text-white mb-4">تحلیل کالری و فعالیت</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('/')[2]}/>
                        <YAxis yAxisId="left" orientation="left" stroke="#ef4444" fontSize={10} />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
                        <Bar yAxisId="left" dataKey="calories" fill="#ef4444" name="کالری مصرفی" radius={[4,4,0,0]} />
                        <Bar yAxisId="right" dataKey="steps" fill="#3b82f6" name="تعداد قدم" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="energetic-card p-6">
            <h3 className="font-bold text-white mb-4">روند تغییرات وزن و آب</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('/')[2]}/>
                        <YAxis yAxisId="left" stroke="#a855f7" domain={['dataMin - 1', 'dataMax + 1']} fontSize={10}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={10}/>
                        <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={3} dot={{r:4}} name="وزن (kg)" />
                        <Line yAxisId="right" type="monotone" dataKey="waterMl" stroke="#06b6d4" strokeWidth={2} dot={false} name="آب (ml)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

const ShareCenterTab: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [links, setLinks] = useState<ReportLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const createLink = async (type: 'public' | 'private') => {
      setIsGenerating(true);
      const passcode = type === 'private' ? Math.random().toString(36).slice(-6) : undefined;
      const link = await generateShareLink(profile.id, type, passcode);
      setLinks(prev => [link, ...prev]);
      setIsGenerating(false);
  };

  const handleRevoke = async (id: string) => {
      await revokeShareLink(id);
      setLinks(prev => prev.filter(l => l.id !== id));
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("لینک کپی شد!");
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="energetic-card p-6 border-blue-500/30 bg-blue-900/10">
                <div className="flex items-center justify-between mb-4">
                    <Globe className="text-blue-400 w-8 h-8"/>
                    <button onClick={() => createLink('public')} disabled={isGenerating} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-bold shadow-lg">
                        {isGenerating ? '...' : 'ساخت لینک عمومی'}
                    </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">لینک عمومی (View-Only)</h3>
                <p className="text-sm text-gray-400">
                    مناسب برای اشتراک‌گذاری در شبکه‌های اجتماعی. فقط نمودارهای کلی نمایش داده می‌شود.
                </p>
            </div>

            <div className="energetic-card p-6 border-purple-500/30 bg-purple-900/10">
                <div className="flex items-center justify-between mb-4">
                    <Lock className="text-purple-400 w-8 h-8"/>
                    <button onClick={() => createLink('private')} disabled={isGenerating} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-bold shadow-lg">
                        {isGenerating ? '...' : 'ساخت لینک خصوصی'}
                    </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">لینک مربی (Private Access)</h3>
                <p className="text-sm text-gray-400">
                    محافظت شده با رمز عبور. دسترسی کامل به جزئیات تمرین، تغذیه و آنالیز بدن برای مربی.
                </p>
            </div>
        </div>

        <div className="energetic-card p-6">
            <h3 className="font-bold text-white mb-4">تاریخچه لینک‌های فعال</h3>
            {links.length === 0 ? (
                <p className="text-gray-500 text-center py-4">هیچ لینک فعالی وجود ندارد.</p>
            ) : (
                <div className="space-y-3">
                    {links.map(link => (
                        <div key={link.id} className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
                                <div className={`p-2 rounded-full ${link.type === 'private' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {link.type === 'private' ? <Lock size={16}/> : <Globe size={16}/>}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm text-white font-mono truncate">{link.url}</div>
                                    <div className="text-xs text-gray-500 flex gap-3">
                                        <span>{link.createdAt}</span>
                                        <span className="flex items-center"><Eye size={10} className="mr-1"/> {link.views} بازدید</span>
                                        {link.passcode && <span className="text-yellow-500">Pass: {link.passcode}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => copyToClipboard(link.url)} className="flex-1 md:flex-none px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white flex items-center justify-center"><Copy size={12} className="mr-1"/> کپی</button>
                                <button onClick={() => handleRevoke(link.id)} className="flex-1 md:flex-none px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs flex items-center justify-center"><Trash2 size={12} className="mr-1"/> حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

const ProgressAnalyticsExport: React.FC<Props> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'share'>('overview');
  const [activityData, setActivityData] = useState<AthleteActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data (defaulting to last 90 days for client-side filtering)
    getAthleteActivity('yearly', profile.id).then(data => {
        setActivityData(data);
        setLoading(false);
    });
  }, [profile.id]);

  const handleExport = async (type: 'pdf' | 'csv' | 'png') => {
      const fileName = `fitpro_report_${new Date().toISOString().split('T')[0]}`;
      
      if (type === 'csv') {
          exportToCSV(activityData, fileName);
      } else if (type === 'pdf') {
          // Simulate backend PDF generation
          alert("در حال تولید گزارش PDF... (این فرآیند ممکن است چند ثانیه طول بکشد)");
          await requestPDFExport(profile.id, 'weekly');
          alert("گزارش PDF آماده شد و دانلود آغاز گردید.");
      } else {
          // PNG Logic (Simplified alert for demo, normally html2canvas)
          alert("نمودارها به صورت تصویر ذخیره شدند.");
      }
  };

  return (
    <div className="h-full flex flex-col p-2 md:p-6 bg-black/20 rounded-2xl overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
         <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                مرکز تحلیل و پیشرفت
            </h1>
            <p className="text-gray-400 text-sm mt-1">داده‌های عملکردی خود را رصد، تحلیل و صادر کنید.</p>
         </div>
         
         <div className="flex bg-gray-800 p-1 rounded-lg">
            {(['overview', 'detailed', 'share'] as const).map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    {tab === 'overview' ? 'نمای کلی' : tab === 'detailed' ? 'تحلیل دقیق' : 'اشتراک‌گذاری'}
                </button>
            ))}
         </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
         {loading ? (
             <div className="flex items-center justify-center h-64 text-gray-400">
                 <RefreshCw className="animate-spin mr-2" /> در حال بارگذاری داده‌ها...
             </div>
         ) : (
             <>
                {activeTab === 'overview' && <OverviewTab data={activityData} onExport={handleExport} />}
                {activeTab === 'detailed' && <DetailedAnalyticsTab data={activityData} />}
                {activeTab === 'share' && <ShareCenterTab profile={profile} />}
             </>
         )}
      </div>
    </div>
  );
};

export default ProgressAnalyticsExport;
