
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ProgressPhoto, Goal, DailyLog, AppView, AppTheme } from '../types';
import { User, Target, Scale, Camera, Sparkles, Edit, Save, Plus, Trash2, X, AlertTriangle, CheckCircleIcon, Link, Award, BarChart, Activity, Brain, Palette, Crown, Shield, Loader2, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyzeStrengthsAndWeaknesses, analyzeBodyProgress } from '../services/geminiService';
import { LevelInfo } from '../services/levelCalculator';
import { supabase } from '../lib/supabaseClient';

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  logs: DailyLog[];
  setCurrentView: (view: AppView) => void;
  athleteLevelInfo: LevelInfo;
}

// Reusable Card Component
const ProfileCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; onEdit?: () => void; isEditing?: boolean; onSave?: () => void; onCancel?: () => void; className?: string }> = React.memo(({ title, icon: Icon, children, onEdit, isEditing, onSave, onCancel, className='' }) => {
  return (
    <div className={`energetic-card p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Icon className="w-5 h-5 ml-3 text-blue-400" />
          {title}
        </h3>
        {onEdit && !isEditing && (
          <button onClick={onEdit} className="flex items-center text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition">
            <Edit size={14} className="ml-2" /> ویرایش
          </button>
        )}
        {isEditing && (
          <div className="flex space-x-2 space-x-reverse">
            <button onClick={onSave} className="flex items-center text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition">
              <Save size={14} className="ml-2" /> ذخیره
            </button>
            <button onClick={onCancel} className="flex items-center text-sm bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg transition">
              <X size={14} className="ml-2" /> لغو
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
});

const Profile: React.FC<ProfileProps> = ({ profile, updateProfile, logs, setCurrentView, athleteLevelInfo }) => {
  // Editing States
  const [isInfoEditing, setIsInfoEditing] = useState(false);
  const [isGoalsEditing, setIsGoalsEditing] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  // Form Data States
  const [infoFormData, setInfoFormData] = useState({
    name: profile.name,
    age: profile.age,
    height: profile.height,
    gender: profile.gender || 'male',
    sportsHistory: profile.sportsHistory || '',
    injuries: profile.injuries || ''
  });
  const [goalsFormData, setGoalsFormData] = useState<Goal[]>(profile.goals);
  
  // Photo Journal State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<string>('');
  const [isComparing, setIsComparing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Smart Suggestions State
  const [suggestions, setSuggestions] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (logs.length > 1) {
      setIsLoadingSuggestions(true);
      analyzeStrengthsAndWeaknesses(logs, profile.metricsHistory)
        .then(res => setSuggestions(res))
        .finally(() => setIsLoadingSuggestions(false));
    }
  }, [logs, profile.metricsHistory]);
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInfoFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveInfo = () => {
    updateProfile({ ...profile, ...infoFormData });
    setIsInfoEditing(false);
  };

  const handleGoalChange = (id: string, field: keyof Goal, value: any) => {
    const numericValue = field === 'progress' ? Number(value) : value;
    setGoalsFormData(prev => prev.map(g => g.id === id ? { ...g, [field]: numericValue } : g));
  };

  const handleAddGoal = () => {
    const newGoal: Goal = { id: `g${Date.now()}`, text: '', type: 'short', progress: 0 };
    setGoalsFormData(prev => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoalsFormData(prev => prev.filter(g => g.id !== id));
  };

  const handleSaveGoals = () => {
    updateProfile({ ...profile, goals: goalsFormData });
    setIsGoalsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: ProgressPhoto = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('fa-IR'),
            imageUrl: reader.result as string,
        };
        updateProfile({ ...profile, photoGallery: [...profile.photoGallery, newPhoto]});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profile State
      updateProfile({ ...profile, avatar: publicUrl });

      // 4. Persist to Auth Metadata (Standard for Avatar)
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("خطا در آپلود تصویر پروفایل.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotoIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : (prev.length < 2 ? [...prev, id] : prev));
  };

  const runComparison = async () => {
      if (selectedPhotoIds.length !== 2) return;
      setIsComparing(true);
      const photo1 = profile.photoGallery.find(p => p.id === selectedPhotoIds[0]);
      const photo2 = profile.photoGallery.find(p => p.id === selectedPhotoIds[1]);
      if (photo1 && photo2) {
          const result = await analyzeBodyProgress(photo1.imageUrl, photo2.imageUrl);
          setComparisonResult(result);
      }
      setIsComparing(false);
  };
  
  const changeTheme = (theme: AppTheme) => {
      if (profile.subscriptionTier === 'free' && theme !== 'Standard') {
          alert("Upgrade to Elite to unlock premium themes!");
          return;
      }
      if (profile.subscriptionTier === 'elite' && theme === 'Neon') {
          alert("Upgrade to Elite Plus to unlock Neon theme!");
          return;
      }
      updateProfile({ ...profile, theme });
  };
  
  const levelStyles: Record<string, { badge: string, text: string }> = {
    Amateur: { badge: 'bg-gray-500', text: 'text-gray-300' },
    Skilled: { badge: 'bg-green-600', text: 'text-green-300' },
    'Semi-Pro': { badge: 'bg-blue-600', text: 'text-blue-300' },
    Advanced: { badge: 'bg-purple-600', text: 'text-purple-300' },
    Pro: { badge: 'bg-red-600', text: 'text-red-300' },
    Elite: { badge: 'bg-yellow-500', text: 'text-yellow-300' },
  };
  const currentLevelStyle = levelStyles[athleteLevelInfo.status];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in pb-10">
        <div className="lg:col-span-1 flex flex-col gap-6">
           {/* Subscription Card */}
           <ProfileCard title="عضویت فعال" icon={Crown} className={profile.subscriptionTier === 'elite_plus' ? 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : profile.subscriptionTier === 'elite' ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : ''}>
              <div className="text-center">
                  <div className="inline-block p-3 rounded-full bg-white/5 mb-2">
                     {profile.subscriptionTier === 'free' ? <Shield size={32} className="text-gray-400"/> : <Crown size={32} className={profile.subscriptionTier === 'elite' ? 'text-yellow-400' : 'text-cyan-400'}/>}
                  </div>
                  <h3 className="text-xl font-black text-white">{profile.subscriptionTier === 'free' ? 'Free Plan' : profile.subscriptionTier === 'elite' ? 'Elite Member' : 'Elite Plus VIP'}</h3>
                  <p className="text-xs text-gray-400 mt-1">{profile.subscriptionTier === 'free' ? 'دسترسی محدود' : 'دسترسی کامل فعال است'}</p>
                  
                  {profile.subscriptionTier === 'free' && (
                     <button onClick={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)} className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg text-sm">
                        ارتقا به نسخه حرفه‌ای
                     </button>
                  )}
              </div>
           </ProfileCard>

           <ProfileCard title="تم ظاهری" icon={Palette}>
               <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => changeTheme('Standard')}
                     className={`p-2 rounded border-2 ${profile.theme === 'Standard' ? 'border-green-500' : 'border-transparent'} bg-[#0D1117] flex flex-col items-center gap-1`}
                   >
                       <div className="w-4 h-4 rounded-full bg-green-500"></div>
                       <span className="text-[10px] text-gray-300">Standard</span>
                   </button>
                   <button 
                     onClick={() => changeTheme('Gold')}
                     className={`p-2 rounded border-2 ${profile.theme === 'Gold' ? 'border-yellow-500' : 'border-gray-700 opacity-50'} bg-[#1c1905] flex flex-col items-center gap-1 relative`}
                   >
                       <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                       <span className="text-[10px] text-gray-300">Gold</span>
                       {profile.subscriptionTier === 'free' && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded"><span className="text-[8px] text-white">Elite</span></div>}
                   </button>
                   <button 
                     onClick={() => changeTheme('Neon')}
                     className={`p-2 rounded border-2 ${profile.theme === 'Neon' ? 'border-cyan-500' : 'border-gray-700 opacity-50'} bg-[#050014] flex flex-col items-center gap-1 relative`}
                   >
                       <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                       <span className="text-[10px] text-gray-300">Neon</span>
                       {profile.subscriptionTier !== 'elite_plus' && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded"><span className="text-[8px] text-white">VIP</span></div>}
                   </button>
               </div>
           </ProfileCard>

          <div data-tour-id="profile-info-card">
              <ProfileCard 
                  title="اطلاعات شخصی" 
                  icon={User} 
                  isEditing={isInfoEditing}
                  onEdit={() => setIsInfoEditing(true)}
                  onSave={handleSaveInfo}
                  onCancel={() => { setIsInfoEditing(false); setInfoFormData(profile); }}
              >
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--fitpro-accent)] bg-black/40 flex items-center justify-center relative">
                            {isUploadingAvatar ? (
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--fitpro-accent)]" />
                            ) : profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-400" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-[#1E293B] shadow-lg group-hover:scale-110 transition flex items-center justify-center">
                            <Camera size={14} className="text-white" />
                        </div>
                    </div>
                    <button 
                        onClick={() => avatarInputRef.current?.click()} 
                        className="mt-4 flex items-center text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-full transition"
                    >
                        <Upload size={14} className="ml-2" />
                        آپلود تصویر پروفایل
                    </button>
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        onChange={handleAvatarUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>

                <div className="space-y-4">
                  {isInfoEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400">نام</label>
                          <input name="name" value={infoFormData.name} onChange={handleInfoChange} className="w-full input-styled p-2" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">سن</label>
                          <input type="number" name="age" value={infoFormData.age} onChange={handleInfoChange} className="w-full input-styled p-2" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">قد (cm)</label>
                          <input type="number" name="height" value={infoFormData.height} onChange={handleInfoChange} className="w-full input-styled p-2" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">جنسیت</label>
                          <select name="gender" value={infoFormData.gender} onChange={handleInfoChange} className="w-full input-styled p-2">
                            <option value="male">مرد</option>
                            <option value="female">زن</option>
                            <option value="other">دیگر</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div className="text-gray-400">نام:</div><div className="text-white font-medium">{profile.name}</div>
                      <div className="text-gray-400">سن:</div><div className="text-white font-medium">{profile.age}</div>
                      <div className="text-gray-400">قد:</div><div className="text-white font-medium">{profile.height} cm</div>
                      <div className="text-gray-400">جنسیت:</div><div className="text-white font-medium">{profile.gender === 'male' ? 'مرد' : 'زن'}</div>
                    </div>
                  )}
                </div>
              </ProfileCard>
          </div>

          <ProfileCard title="سطح ورزشکار" icon={Award}>
              <div className="text-center">
                  <span className={`px-4 py-1.5 rounded-full text-lg font-bold text-white ${currentLevelStyle.badge}`}>
                      {athleteLevelInfo.status}
                  </span>
                  <p className={`mt-2 font-semibold ${currentLevelStyle.text}`}>{athleteLevelInfo.score} Score</p>
              </div>
              <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress to next level</span>
                      <span>{athleteLevelInfo.progressToNext}%</span>
                  </div>
                  <div className="progress-bar-bg h-2.5">
                      <div 
                          className="h-2.5 rounded-full" 
                          style={{
                              width: `${athleteLevelInfo.progressToNext}%`, 
                              background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))'
                          }}
                      ></div>
                  </div>
              </div>
              <button onClick={() => setIsLevelModalOpen(true)} className="w-full text-sm text-center mt-4 text-blue-400 hover:underline">
                  جزئیات محاسبه
              </button>
          </ProfileCard>
          
          <ProfileCard title="پیشنهادهای هوشمند" icon={Sparkles}>
             {isLoadingSuggestions ? (
               <div className="flex justify-center items-center h-24"><Loader2 className="animate-spin text-blue-400"/></div>
             ) : suggestions ? (
               <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{suggestions}</p>
             ) : (
               <div className="text-center text-sm text-gray-500">
                 <p>برای دریافت تحلیل، حداقل ۲ روز فعالیت ثبت کنید.</p>
               </div>
             )}
          </ProfileCard>
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProfileCard 
            title="اهداف" 
            icon={Target}
            isEditing={isGoalsEditing}
            onEdit={() => setIsGoalsEditing(true)}
            onSave={handleSaveGoals}
            onCancel={() => { setIsGoalsEditing(false); setGoalsFormData(profile.goals); }}
          >
            <div className="space-y-4">
              {goalsFormData.length === 0 && !isGoalsEditing ? (
                <div className="text-center text-gray-500 py-4">
                  <p>هنوز هدفی تعیین نکرده‌اید.</p>
                  <button onClick={() => setIsGoalsEditing(true)} className="text-blue-400 text-sm mt-2">اولین هدف خود را اضافه کنید</button>
                </div>
              ) : (
                goalsFormData.map(goal => (
                  isGoalsEditing ? (
                    <div key={goal.id} className="grid grid-cols-12 gap-2 items-center">
                      <input value={goal.text} onChange={e => handleGoalChange(goal.id, 'text', e.target.value)} placeholder="شرح هدف..." className="col-span-6 input-styled p-2 text-sm" />
                      <select value={goal.type} onChange={e => handleGoalChange(goal.id, 'type', e.target.value)} className="col-span-2 input-styled p-2 text-sm">
                        <option value="short">کوتاه مدت</option>
                        <option value="medium">میان مدت</option>
                        <option value="long">بلند مدت</option>
                      </select>
                      <input type="range" min="0" max="100" value={goal.progress} onChange={e => handleGoalChange(goal.id, 'progress', e.target.value)} className="col-span-3 accent-blue-500" />
                      <button onClick={() => handleDeleteGoal(goal.id)} className="col-span-1 text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <div key={goal.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-white">{goal.text}</span>
                        <span className="text-xs font-mono text-blue-300">{goal.progress}%</span>
                      </div>
                      <div className="progress-bar-bg h-2"><div className="progress-bar-fg h-full" style={{width: `${goal.progress}%`, background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))'}}></div></div>
                    </div>
                  )
                ))
              )}
              {isGoalsEditing && <button onClick={handleAddGoal} className="w-full text-sm border-2 border-dashed border-gray-600 hover:border-gray-500 text-gray-400 rounded-lg py-2 transition"><Plus size={16} className="inline ml-2"/> افزودن هدف جدید</button>}
            </div>
          </ProfileCard>

          <ProfileCard title="شاخص‌های بدنی" icon={Scale}>
            <div className="h-48 mb-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profile.metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10}/>
                  <YAxis stroke="var(--text-secondary)" domain={['auto', 'auto']} fontSize={10}/>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }} />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Line type="monotone" dataKey="weight" name="وزن (kg)" stroke="var(--accent-blue)" strokeWidth={2} />
                  <Line type="monotone" dataKey="bodyFat" name="چربی (%)" stroke="var(--accent-red)" strokeWidth={2} />
                  <Line type="monotone" dataKey="bmi" name="BMI" stroke="var(--accent-orange)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <button onClick={() => setCurrentView(AppView.HEALTH_HUB)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition flex items-center justify-center">
              <Link size={16} className="ml-2" />
              برو به مرکز مدیریت وزن
            </button>
          </ProfileCard>
          
          <ProfileCard title="ژورنال تصویری" icon={Camera}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               {profile.photoGallery.map(photo => (
                  <div key={photo.id} onClick={() => togglePhotoSelection(photo.id)} className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition ${selectedPhotoIds.includes(photo.id) ? 'border-pink-500' : 'border-transparent'}`}>
                     <img src={photo.imageUrl} alt={photo.date} className="w-full h-32 object-cover" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition"></div>
                     <div className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">{photo.date}</div>
                     {selectedPhotoIds.includes(photo.id) && <div className="absolute top-1 left-1"><CheckCircleIcon className="w-5 h-5 text-pink-500 bg-white rounded-full"/></div>}
                  </div>
               ))}
               <button onClick={() => fileInputRef.current?.click()} className="flex flex-col justify-center items-center h-32 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl text-gray-500 hover:text-blue-400 transition">
                  <Plus />
                  <span className="text-xs mt-1">آپلود عکس</span>
               </button>
               <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden"/>
            </div>
            {selectedPhotoIds.length === 2 && (
               <button onClick={runComparison} disabled={isComparing} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded-lg flex items-center justify-center">
                 {isComparing ? <Loader2 className="animate-spin" /> : <><Activity size={16} className="ml-2"/> تحلیل تغییرات</>}
               </button>
            )}
            {comparisonResult && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{comparisonResult}</p>
              </div>
            )}
          </ProfileCard>
        </div>
      </div>
      {isLevelModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsLevelModalOpen(false)}>
          <div className="bg-gray-800 rounded-xl border border-gray-600 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Athlete Level Breakdown</h3>
              <button onClick={() => setIsLevelModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            <p className="text-sm text-gray-400 mb-6">Your level is calculated from three key areas of your performance. Improve these areas to level up.</p>
            <div className="space-y-4">
                {[
                  { icon: BarChart, title: 'Consistency', score: athleteLevelInfo.breakdown.consistency.score, max: 500, detail: athleteLevelInfo.breakdown.consistency.detail, color: 'bg-blue-500' },
                  { icon: Activity, title: 'Performance', score: athleteLevelInfo.breakdown.performance.score, max: 500, detail: athleteLevelInfo.breakdown.performance.detail, color: 'bg-green-500' },
                  { icon: Brain, title: 'Advanced Metrics', score: athleteLevelInfo.breakdown.advanced.score, max: 300, detail: athleteLevelInfo.breakdown.advanced.detail, color: 'bg-purple-500' },
                ].map(item => (
                  <div key={item.title} className="bg-black/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-2 text-gray-300" />
                        <span className="font-semibold text-white">{item.title}</span>
                      </div>
                      <span className="font-mono text-gray-300">{item.score} / {item.max} pts</span>
                    </div>
                    <div className="progress-bar-bg h-2 mb-2">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.min((item.score/item.max)*100, 100)}%`}}></div>
                    </div>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Profile);
