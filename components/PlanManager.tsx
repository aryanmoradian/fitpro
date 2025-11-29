
import React, { useState, useMemo } from 'react';
import { generateWorkoutJSON, generateNutritionJSON } from '../services/geminiService';
import { NutritionItem, Exercise, WeeklyWorkoutPlan, WeeklyNutritionPlan, UserProfile, TrainingSession, DailyMealPlan, MealEntry } from '../types';
import { Sparkles, Plus, Trash2, Dumbbell, Utensils, Clock, Repeat, Wrench, Bot, Calendar, Save, Loader2, Activity, Zap, Flame } from 'lucide-react';
import TrainingBuilder from './TrainingBuilder';
import NutritionBuilder from './NutritionBuilder';
import { LevelInfo } from '../services/levelCalculator';

interface PlanManagerProps {
  nutritionPlan: NutritionItem[];
  setNutritionPlan: React.Dispatch<React.SetStateAction<NutritionItem[]>>;
  workoutPlan: Exercise[];
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Exercise[]>>;
  weeklyWorkoutPlan?: WeeklyWorkoutPlan;
  setWeeklyWorkoutPlan?: React.Dispatch<React.SetStateAction<WeeklyWorkoutPlan>>;
  weeklyNutritionPlan?: WeeklyNutritionPlan;
  setWeeklyNutritionPlan?: React.Dispatch<React.SetStateAction<WeeklyNutritionPlan>>;
  profile?: UserProfile;
  updateProfile?: (profile: UserProfile) => void;
  athleteLevelInfo: LevelInfo;
}

const PlanManager: React.FC<PlanManagerProps> = ({ 
  nutritionPlan, 
  setNutritionPlan, 
  workoutPlan, 
  setWorkoutPlan,
  weeklyWorkoutPlan,
  setWeeklyWorkoutPlan,
  weeklyNutritionPlan,
  setWeeklyNutritionPlan,
  profile,
  updateProfile,
  athleteLevelInfo
}) => {
  const [mode, setMode] = useState<'ai' | 'pro'>('ai'); 
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetDay, setTargetDay] = useState<number>(1);

  // Manual Entry States
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '', sets: 3, reps: '8-12', rest: 60
  });
  
  const [newNutritionItem, setNewNutritionItem] = useState<Partial<NutritionItem>>({ 
    title: '', details: '', macros: { protein: 0, carbs: 0, fats: 0, calories: 0 } 
  });

  // --- STATS CALCULATION ---
  const workoutStats = useMemo(() => {
    const totalSets = workoutPlan.reduce((acc, ex) => acc + (ex.sets || 0), 0);
    const totalExercises = workoutPlan.length;
    const estimatedTime = Math.round((totalSets * 2) + (totalSets * 1.5)); // Roughly 3.5 mins per set including rest
    const muscles = Array.from(new Set(workoutPlan.map(ex => ex.muscleGroup).filter(Boolean)));
    return { totalSets, totalExercises, estimatedTime, muscles };
  }, [workoutPlan]);

  const nutritionStats = useMemo(() => {
    const total = nutritionPlan.reduce((acc, item) => ({
        calories: acc.calories + (item.macros?.calories || 0),
        protein: acc.protein + (item.macros?.protein || 0),
        carbs: acc.carbs + (item.macros?.carbs || 0),
        fats: acc.fats + (item.macros?.fats || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    return total;
  }, [nutritionPlan]);

  const handleGenerate = async () => {
    if (!goal) return;
    setIsGenerating(true);
    
    try {
        if (activeTab === 'workout') {
          const exercises = await generateWorkoutJSON(goal, athleteLevelInfo.status);
          setWorkoutPlan(exercises || []);
        } else {
          const meals = await generateNutritionJSON(goal, athleteLevelInfo.status);
          setNutritionPlan(meals || []);
        }
    } catch (e) {
        console.error("Generation failed", e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleImportToWeekly = () => {
    if (activeTab === 'workout') {
        if (!weeklyWorkoutPlan || !setWeeklyWorkoutPlan) {
            alert("قابلیت برنامه هفتگی فعال نیست.");
            return;
        }
        
        const newSession: TrainingSession = {
            id: Date.now().toString(),
            name: `AI: ${goal.substring(0, 15)}...`,
            dayOfWeek: targetDay,
            exercises: workoutPlan.map(ex => ({...ex, id: Date.now() + Math.random().toString()}))
        };

        setWeeklyWorkoutPlan(prev => {
            const sessions = (prev.sessions || []).filter(s => s.dayOfWeek !== targetDay);
            return { ...prev, sessions: [...sessions, newSession].sort((a,b) => a.dayOfWeek - b.dayOfWeek) };
        });
        
        alert(`تمرین با موفقیت به روز ${targetDay} اضافه شد.`);
    } else {
        if (!weeklyNutritionPlan || !setWeeklyNutritionPlan) {
             alert("قابلیت برنامه هفتگی فعال نیست.");
             return;
        }

        const newDayPlan: DailyMealPlan = {
            dayOfWeek: targetDay,
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };

        nutritionPlan.forEach(item => {
            const entry: MealEntry = {
                id: Date.now() + Math.random().toString(),
                foodId: 'ai-gen',
                name: item.title,
                amount: 1,
                macros: item.macros
            };

            const lowerTitle = item.title.toLowerCase();
            if (lowerTitle.includes('صبحانه') || lowerTitle.includes('breakfast')) {
                newDayPlan.breakfast.push(entry);
            } else if (lowerTitle.includes('ناهار') || lowerTitle.includes('lunch')) {
                newDayPlan.lunch.push(entry);
            } else if (lowerTitle.includes('شام') || lowerTitle.includes('dinner')) {
                newDayPlan.dinner.push(entry);
            } else {
                newDayPlan.snacks.push(entry);
            }
        });

        setWeeklyNutritionPlan(prev => {
            const days = (prev.days || []).filter(d => d.dayOfWeek !== targetDay);
            return { ...prev, days: [...days, newDayPlan].sort((a,b) => a.dayOfWeek - b.dayOfWeek) };
        });
        
        alert(`رژیم تغذیه با موفقیت به روز ${targetDay} اضافه شد.`);
    }
  };

  const addManualExercise = () => {
    if(!newExercise.name) return;
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name!,
      sets: newExercise.sets || 3,
      reps: String(newExercise.reps) || '10',
      rest: newExercise.rest || 60,
      notes: newExercise.notes || ''
    };
    setWorkoutPlan(prev => [...prev, exercise]);
    setNewExercise({ name: '', sets: 3, reps: '8-12', rest: 60, notes: '' });
  };

  const addManualNutrition = () => {
    if(!newNutritionItem.title) return;
    const item: NutritionItem = {
      id: Date.now().toString(),
      title: newNutritionItem.title!,
      details: newNutritionItem.details || '',
      macros: newNutritionItem.macros || { protein: 0, carbs: 0, fats: 0, calories: 0 },
      completed: false
    };
    setNutritionPlan(prev => [...prev, item]);
    setNewNutritionItem({ 
      title: '', details: '', 
      macros: { protein: 0, carbs: 0, fats: 0, calories: 0 } 
    });
  };

  const deleteExercise = (id: string) => {
    setWorkoutPlan(prev => prev.filter(e => e.id !== id));
  };

  const deleteNutrition = (id: string) => {
    setNutritionPlan(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in">
      {/* Top Mode Switcher */}
      <div className="bg-black/20 p-2 rounded-lg flex space-x-2 space-x-reverse border border-white/10 shrink-0">
         <button 
           onClick={() => setMode('ai')}
           className={`flex-1 py-3 rounded-md font-bold flex items-center justify-center transition-all duration-300 ${mode === 'ai' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_var(--glow-blue)]' : 'text-gray-400 hover:text-white'}`}
         >
           <Bot className="w-5 h-5 ml-2" /> تولید هوشمند (AI)
         </button>
         <button 
           onClick={() => setMode('pro')}
           className={`flex-1 py-3 rounded-md font-bold flex items-center justify-center transition-all duration-300 ${mode === 'pro' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_15px_var(--glow-orange)]' : 'text-gray-400 hover:text-white'}`}
         >
           <Wrench className="w-5 h-5 ml-2" /> طراحی دستی پیشرفته (Pro)
         </button>
      </div>

      {mode === 'pro' && weeklyWorkoutPlan && weeklyNutritionPlan ? (
        // --- PROFESSIONAL BUILDER MODE ---
        <div className="flex-1 energetic-card p-6 shadow-lg overflow-hidden flex flex-col">
           <div className="flex space-x-4 space-x-reverse mb-6 shrink-0">
            <button 
              onClick={() => setActiveTab('workout')}
              className={`px-6 py-2 rounded-lg font-bold transition flex items-center ${activeTab === 'workout' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <Dumbbell className="w-5 h-5 ml-2" /> برنامه تمرینی هفتگی
            </button>
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-2 rounded-lg font-bold transition flex items-center ${activeTab === 'nutrition' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <Utensils className="w-5 h-5 ml-2" /> برنامه تغذیه هفتگی
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
             {activeTab === 'workout' ? (
               <TrainingBuilder 
                currentPlan={weeklyWorkoutPlan} 
                updatePlan={setWeeklyWorkoutPlan!} 
                profile={profile}
                updateProfile={updateProfile}
              />
             ) : (
               <NutritionBuilder 
                currentPlan={weeklyNutritionPlan} 
                updatePlan={setWeeklyNutritionPlan!} 
                profile={profile}
                updateProfile={updateProfile}
              />
             )}
          </div>
        </div>
      ) : (
        // --- AI MODE ---
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left: AI Generator */}
          <div className="energetic-card p-6 flex flex-col h-full shadow-lg overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center text-white">
                <Sparkles className="w-6 h-6 text-yellow-400 ml-2" />
                طراحی هوشمند برنامه
              </h2>
              <p className="text-gray-400 text-sm">
                Plans tailored for <span className="font-bold text-blue-300">{athleteLevelInfo.status}</span> level.
              </p>
            </div>

            <div className="flex space-x-4 mb-6 space-x-reverse">
              <button 
                onClick={() => setActiveTab('workout')}
                className={`flex-1 py-3 rounded-lg font-bold transition flex items-center justify-center ${activeTab === 'workout' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                <Dumbbell className="w-5 h-5 ml-2" /> تمرین
              </button>
              <button 
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 py-3 rounded-lg font-bold transition flex items-center justify-center ${activeTab === 'nutrition' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                <Utensils className="w-5 h-5 ml-2" /> تغذیه
              </button>
            </div>

            <textarea
              className="w-full input-styled p-4 text-white resize-none h-32 mb-4"
              placeholder={activeTab === 'workout' ? "مثلا: برنامه ۴ روزه برای افزایش حجم سینه و زیربغل..." : "مثلا: رژیم با پروتئین بالا و کربوهیدرات کم برای کاهش چربی..."}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !goal}
              className="w-full py-3 btn-primary flex items-center justify-center mb-6 shadow-lg shadow-green-900/20"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin ml-2" /> در حال طراحی...</>
              ) : (
                <><Sparkles className="w-4 h-4 ml-2" /> تولید برنامه {activeTab === 'workout' ? 'تمرینی' : 'تغذیه'}</>
              )}
            </button>
            
            {/* --- Stats Summary Card (New Feature) --- */}
            {((activeTab === 'workout' && workoutPlan.length > 0) || (activeTab === 'nutrition' && nutritionPlan.length > 0)) && (
                <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-white mb-3 flex items-center">
                        <Activity className="w-4 h-4 ml-2 text-blue-400" />
                        خلاصه برنامه پیشنهادی
                    </h3>
                    
                    {activeTab === 'workout' ? (
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-white/5 rounded p-2">
                                <span className="text-xs text-gray-400 block">حجم تمرین</span>
                                <span className="text-xl font-bold text-white">{workoutStats.totalSets} <span className="text-xs font-normal">ست</span></span>
                            </div>
                            <div className="bg-white/5 rounded p-2">
                                <span className="text-xs text-gray-400 block">زمان تخمینی</span>
                                <span className="text-xl font-bold text-white">{Math.round(workoutStats.estimatedTime)} <span className="text-xs font-normal">دقیقه</span></span>
                            </div>
                            <div className="col-span-2 bg-white/5 rounded p-2 text-right">
                                <span className="text-xs text-gray-400 block mb-1">تمرکز عضلانی</span>
                                <div className="flex flex-wrap gap-1">
                                    {workoutStats.muscles.map(m => (
                                        <span key={m} className="text-[10px] bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/30">{m}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-gray-400">کالری کل</span>
                                <span className="text-2xl font-bold text-white">{nutritionStats.calories} <span className="text-sm font-normal text-gray-500">kcal</span></span>
                            </div>
                            
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-blue-300">پروتئین ({nutritionStats.protein}g)</span>
                                        <span className="text-gray-500">30%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{width: '30%'}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-green-300">کربوهیدرات ({nutritionStats.carbs}g)</span>
                                        <span className="text-gray-500">50%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{width: '50%'}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-yellow-300">چربی ({nutritionStats.fats}g)</span>
                                        <span className="text-gray-500">20%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500" style={{width: '20%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- Save to Weekly Plan Section --- */}
            <div className="mt-auto p-4 bg-gray-800/50 border border-white/10 rounded-xl">
                 <div className="flex items-center text-white mb-3">
                    <Calendar className="w-5 h-5 ml-2 text-purple-400" />
                    <span className="font-bold text-sm">ذخیره در برنامه هفتگی</span>
                 </div>
                 <div className="flex space-x-2 space-x-reverse">
                    <select 
                      value={targetDay}
                      onChange={(e) => setTargetDay(Number(e.target.value))}
                      className="bg-black/30 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none w-28 text-center"
                    >
                        {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>روز {d}</option>)}
                    </select>
                    <button 
                      onClick={handleImportToWeekly}
                      disabled={isGenerating || (activeTab === 'workout' ? workoutPlan.length === 0 : nutritionPlan.length === 0)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm transition shadow-lg shadow-purple-900/20"
                    >
                        <Save className="w-4 h-4 ml-2" /> افزودن به برنامه
                    </button>
                 </div>
                 <p className="text-[10px] text-gray-500 mt-2 text-right">
                    نکته: با ذخیره، آیتم‌های فعلی برای روز {targetDay} جایگزین خواهند شد.
                 </p>
            </div>
          </div>

          {/* Right: Active Plan Manager (Simple View) */}
          <div className="energetic-card p-6 flex flex-col h-full shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between items-center">
                <span>پیش‌نمایش {activeTab === 'workout' ? 'تمرین' : 'تغذیه'}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 font-normal">قابلیت ویرایش</span>
            </h2>
            <div className="w-full h-px bg-white/10 mb-4"></div>

            {activeTab === 'workout' ? (
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-4 gap-2 mb-4 bg-black/20 p-2 rounded-lg border border-white/5">
                   <input placeholder="نام حرکت" className="col-span-1 input-styled p-2 text-xs" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} />
                   <input type="number" placeholder="ست" className="col-span-1 input-styled p-2 text-xs" value={newExercise.sets} onChange={e => setNewExercise({...newExercise, sets: parseInt(e.target.value)})} />
                   <input placeholder="تکرار" className="col-span-1 input-styled p-2 text-xs" value={newExercise.reps} onChange={e => setNewExercise({...newExercise, reps: e.target.value})} />
                   <button onClick={addManualExercise} className="bg-blue-600 rounded p-2 text-white hover:bg-blue-500 flex items-center justify-center"><Plus size={16} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pl-2 custom-scrollbar">
                  {workoutPlan.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                        <Dumbbell className="w-12 h-12 mb-2 opacity-20"/>
                        لیست خالی است.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workoutPlan.map((ex, idx) => (
                        <div key={ex.id} className="bg-black/20 p-4 rounded-lg border border-white/10 flex justify-between items-center group hover:border-blue-500/30 transition">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <span className="text-blue-500 font-bold text-lg w-6 text-center">{idx + 1}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                              <div className="flex space-x-3 space-x-reverse text-[10px] text-gray-400 mt-1">
                                <span className="flex items-center ml-2 bg-white/5 px-1.5 py-0.5 rounded"><Repeat className="w-3 h-3 ml-1" /> {ex.sets} ست</span>
                                <span className="flex items-center ml-2 bg-white/5 px-1.5 py-0.5 rounded"><Dumbbell className="w-3 h-3 ml-1" /> {ex.reps} تکرار</span>
                                <span className="flex items-center bg-white/5 px-1.5 py-0.5 rounded"><Clock className="w-3 h-3 ml-1" /> {ex.rest}s</span>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => deleteExercise(ex.id)} className="text-gray-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                 <div className="bg-black/20 p-2 rounded-lg border border-white/5 mb-4">
                     <div className="grid grid-cols-2 gap-2 mb-2">
                        <input placeholder="نام وعده" className="col-span-2 input-styled p-2 text-xs" value={newNutritionItem.title} onChange={e => setNewNutritionItem({...newNutritionItem, title: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-5 gap-2">
                       <input type="number" placeholder="کالری" className="input-styled p-2 text-[10px] text-center" value={newNutritionItem.macros?.calories || ''} onChange={e => setNewNutritionItem({...newNutritionItem, macros: {...newNutritionItem.macros!, calories: Number(e.target.value)}})} />
                       <input type="number" placeholder="P" className="input-styled p-2 text-[10px] text-center" value={newNutritionItem.macros?.protein || ''} onChange={e => setNewNutritionItem({...newNutritionItem, macros: {...newNutritionItem.macros!, protein: Number(e.target.value)}})} />
                       <input type="number" placeholder="C" className="input-styled p-2 text-[10px] text-center" value={newNutritionItem.macros?.carbs || ''} onChange={e => setNewNutritionItem({...newNutritionItem, macros: {...newNutritionItem.macros!, carbs: Number(e.target.value)}})} />
                       <input type="number" placeholder="F" className="input-styled p-2 text-[10px] text-center" value={newNutritionItem.macros?.fats || ''} onChange={e => setNewNutritionItem({...newNutritionItem, macros: {...newNutritionItem.macros!, fats: Number(e.target.value)}})} />
                       <button onClick={addManualNutrition} className="bg-green-600 rounded p-1 text-white hover:bg-green-500 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                     </div>
                 </div>

                 <div className="flex-1 overflow-y-auto pl-2 space-y-2 custom-scrollbar">
                   {nutritionPlan.length === 0 ? (
                      <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                          <Utensils className="w-12 h-12 mb-2 opacity-20"/>
                          لیست خالی است.
                      </div>
                   ) : (
                      nutritionPlan.map(item => (
                        <div key={item.id} className="bg-black/20 p-3 rounded-lg border border-white/10 group hover:border-green-500/30 transition flex justify-between items-center">
                           <div>
                                <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                                <div className="flex space-x-2 space-x-reverse text-[10px] text-gray-500 font-mono mt-1">
                                    <span className="text-orange-400">{item.macros?.calories} kcal</span>
                                    <span className="text-blue-400">P:{item.macros?.protein}</span>
                                    <span className="text-green-400">C:{item.macros?.carbs}</span>
                                    <span className="text-yellow-400">F:{item.macros?.fats}</span>
                                </div>
                           </div>
                           <button onClick={() => deleteNutrition(item.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))
                   )}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManager;
