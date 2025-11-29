
import React, { useState, useEffect } from 'react';
import { NutritionItem, DailyLog, Exercise, ExerciseLog, SetLog, UserProfile, Habit, Mood } from '../types';
import { 
  Circle, CheckCircle2, Save, Dumbbell, Trophy, Plus, 
  Flame, Droplets, Moon, Activity, Smile, Frown, Meh, Zap, Battery,
  ChevronDown, ChevronUp, Utensils, Footprints, History
} from 'lucide-react';

interface DailyTrackerProps {
  nutritionPlan: NutritionItem[];
  setNutritionPlan: React.Dispatch<React.SetStateAction<NutritionItem[]>>;
  workoutPlan: Exercise[];
  addLog: (log: DailyLog) => void;
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
  logs: DailyLog[]; // Pass previous logs for comparison
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ 
  nutritionPlan, 
  setNutritionPlan, 
  workoutPlan, 
  addLog,
  profile,
  updateProfile,
  logs
}) => {
  // --- STATE ---
  const [workoutLogs, setWorkoutLogs] = useState<ExerciseLog[]>([]);
  const [bodyWeight, setBodyWeight] = useState<number>(profile.currentWeight || 0);
  const [sleepData, setSleepData] = useState({ hours: 7, quality: 7, rhr: 60 });
  const [mood, setMood] = useState<Mood>('neutral');
  const [energyLevel, setEnergyLevel] = useState<number>(5); // 1-10
  const [waterIntake, setWaterIntake] = useState<number>(0); // glasses
  const [steps, setSteps] = useState<number>(0);
  const [quickAddMode, setQuickAddMode] = useState<'none' | 'exercise' | 'food'>('none');

  // Ad-hoc input states
  const [adhocExercise, setAdhocExercise] = useState({ name: '', sets: 3 });
  const [adhocFood, setAdhocFood] = useState({ name: '', calories: 0, protein: 0 });

  // --- INITIALIZATION ---
  useEffect(() => {
    // Sync with workout plan only if logs are empty (first load of the day)
    if (workoutPlan.length > 0 && workoutLogs.length === 0) {
      const initialLogs: ExerciseLog[] = workoutPlan.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: Array.from({ length: ex.sets }).map((_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: 0,
          completed: false
        }))
      }));
      setWorkoutLogs(initialLogs);
    }
  }, [workoutPlan, workoutLogs]);

  // --- HANDLERS ---
  
  const getPreviousPerformance = (exerciseId: string, setNumber: number): { weight: number, reps: number } | null => {
    if (logs.length === 0) return null;
    
    // Find the most recent log that contains this exercise
    const reversedLogs = [...logs].reverse();
    for (const log of reversedLogs) {
      if (log.detailedWorkout) {
        const exerciseLog = log.detailedWorkout.find(ex => ex.exerciseId === exerciseId);
        if (exerciseLog && exerciseLog.sets.length >= setNumber) {
          return exerciseLog.sets[setNumber - 1];
        }
      }
    }
    return null;
  };


  const toggleNutritionComplete = (id: string) => {
    setNutritionPlan(prev => prev.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
  };

  const updateSetLog = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
    const newLogs = [...workoutLogs];
    const setItem = newLogs[exerciseIndex].sets[setIndex];
    if (field === 'weight') setItem.weight = value;
    if (field === 'reps') setItem.reps = value;
    // Auto-complete set if both values entered
    if (setItem.weight > 0 && setItem.reps > 0) setItem.completed = true;
    setWorkoutLogs(newLogs);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newLogs = [...workoutLogs];
    newLogs[exerciseIndex].sets[setIndex].completed = !newLogs[exerciseIndex].sets[setIndex].completed;
    setWorkoutLogs(newLogs);
  };

  const handleQuickAddExercise = () => {
    if (!adhocExercise.name) return;
    const newLog: ExerciseLog = {
      exerciseId: `adhoc_${Date.now()}`,
      name: adhocExercise.name + ' (اضافی)',
      sets: Array.from({ length: adhocExercise.sets }).map((_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: 0,
        completed: false
      }))
    };
    setWorkoutLogs([...workoutLogs, newLog]);
    setAdhocExercise({ name: '', sets: 3 });
    setQuickAddMode('none');
  };

  const handleQuickAddFood = () => {
    if (!adhocFood.name) return;
    const newItem: NutritionItem = {
      id: `adhoc_${Date.now()}`,
      title: adhocFood.name + ' (اضافی)',
      details: 'آیتم سریع',
      macros: {
        calories: Number(adhocFood.calories),
        protein: Number(adhocFood.protein),
        carbs: 0,
        fats: 0
      },
      completed: true, // Auto complete quick adds
      notes: 'اضافه شده دستی'
    };
    setNutritionPlan([...nutritionPlan, newItem]);
    setAdhocFood({ name: '', calories: 0, protein: 0 });
    setQuickAddMode('none');
  };

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

  // --- CALCULATIONS ---

  const calculateNutritionStats = () => {
    const consumed = nutritionPlan.filter(i => i.completed);
    const totalCals = consumed.reduce((acc, curr) => acc + curr.macros.calories, 0);
    const totalProtein = consumed.reduce((acc, curr) => acc + curr.macros.protein, 0);
    const totalCarbs = consumed.reduce((acc, curr) => acc + curr.macros.carbs, 0);
    const totalFats = consumed.reduce((acc, curr) => acc + curr.macros.fats, 0);
    
    // Score
    const score = nutritionPlan.length > 0 
      ? Math.round((consumed.length / nutritionPlan.length) * 100) 
      : 0;

    return { totalCals, totalProtein, totalCarbs, totalFats, score };
  };

  const calculateWorkoutScore = () => {
     if (workoutLogs.length === 0) return 0;
     let totalSets = 0;
     let completedSets = 0;
     workoutLogs.forEach(ex => {
         ex.sets.forEach(s => {
             totalSets++;
             if (s.completed) completedSets++;
         });
     });
     return totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  };

  const nutStats = calculateNutritionStats();
  const woScore = calculateWorkoutScore();

  const handleFinishDay = () => {
    const today = new Date().toLocaleDateString('fa-IR');
    
    // Create Log
    const log: DailyLog = {
      date: today,
      bodyWeight: bodyWeight > 0 ? bodyWeight : undefined,
      workoutScore: woScore,
      nutritionScore: nutStats.score,
      sleepHours: sleepData.hours,
      sleepQuality: sleepData.quality,
      restingHeartRate: sleepData.rhr,
      notes: "ثبت روزانه",
      mood: mood,
      energyLevel: energyLevel,
      waterIntake: waterIntake,
      steps: steps > 0 ? steps : undefined,
      detailedWorkout: workoutLogs,
      detailedNutrition: nutritionPlan,
      consumedMacros: {
        calories: nutStats.totalCals,
        protein: nutStats.totalProtein,
        carbs: nutStats.totalCarbs,
        fats: nutStats.totalFats
      }
    };
    
    addLog(log);
    
    // Sync Weight to Profile if changed
    if (bodyWeight > 0 && bodyWeight !== profile.currentWeight) {
       updateProfile({ ...profile, currentWeight: bodyWeight });
    }

    alert(`روز با موفقیت بسته شد!\nامتیاز عملکرد: ${Math.round((woScore + nutStats.score)/2)}`);
  };

  // Gamification Display
  const level = Math.floor(profile.xp / 1000) + 1;
  const progress = (profile.xp % 1000) / 10;
  const xpForNextLevel = 1000 - (profile.xp % 1000);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* 1. GAMIFICATION & STATUS HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900/30 to-gray-900 rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-gray-400 text-sm">سطح {level}</p>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end">
                <Trophy className="w-5 h-5 text-yellow-400 ml-2"/>
                <span className="text-2xl font-bold text-white">{profile.xp.toLocaleString('fa-IR')}</span>
                <span className="text-sm text-gray-400 mr-1">XP</span>
             </div>
             <p className="text-xs text-gray-500">{xpForNextLevel.toLocaleString('fa-IR')} XP تا سطح بعدی</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full mt-4 progress-bar-bg relative z-10">
          <div className="h-2 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #58a6ff, #a371f7)' }}></div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Log (Left) */}
        <div data-tour-id="tracker-workout-log" className="lg:col-span-2 space-y-6">
          <div className="energetic-card p-6">
            <h2 className="text-lg font-bold flex items-center mb-4"><Dumbbell className="ml-2 text-blue-400"/> ثبت تمرینات</h2>
            <div className="space-y-4">
              {workoutLogs.map((log, exIndex) => (
                <div key={log.exerciseId} className="bg-black/20 p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-3">{log.name}</h3>
                  <div className="space-y-2">
                    {log.sets.map((set, setIndex) => {
                      const prevPerf = getPreviousPerformance(log.exerciseId, set.setNumber);
                      return (
                        <div key={setIndex} className="grid grid-cols-12 gap-2 items-center text-sm">
                          <span className="col-span-1 text-gray-400 text-center">ست {set.setNumber}</span>
                          <input type="number" placeholder="وزنه (kg)" value={set.weight || ''} onChange={e => updateSetLog(exIndex, setIndex, 'weight', +e.target.value)} className="col-span-3 input-styled text-center p-2"/>
                          <input type="number" placeholder="تکرار" value={set.reps || ''} onChange={e => updateSetLog(exIndex, setIndex, 'reps', +e.target.value)} className="col-span-3 input-styled text-center p-2"/>
                          <div className="col-span-4 flex items-center justify-center text-gray-500 text-xs">
                            <History size={12} className="ml-1"/>
                            <span>آخرین: {prevPerf ? `${prevPerf.weight}kg x ${prevPerf.reps}` : '--'}</span>
                          </div>
                          <button onClick={() => toggleSetComplete(exIndex, setIndex)} className="col-span-1 flex justify-center">
                            {set.completed ? <CheckCircle2 className="text-green-500"/> : <Circle className="text-gray-600"/>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {quickAddMode === 'exercise' ? (
                <div className="bg-blue-900/20 p-3 rounded mt-4 flex gap-2">
                    <input autoFocus placeholder="نام حرکت" value={adhocExercise.name} onChange={e => setAdhocExercise({...adhocExercise, name: e.target.value})} className="flex-1 input-styled p-2 text-sm" />
                    <input type="number" placeholder="تعداد ست" value={adhocExercise.sets} onChange={e => setAdhocExercise({...adhocExercise, sets: +e.target.value})} className="w-24 input-styled p-2 text-sm text-center" />
                    <button onClick={handleQuickAddExercise} className="bg-blue-600 p-2 rounded text-white"><Save size={16}/></button>
                    <button onClick={() => setQuickAddMode('none')} className="bg-gray-600 p-2 rounded text-white">لغو</button>
                </div>
            ) : (
                <button onClick={() => setQuickAddMode('exercise')} className="w-full mt-4 text-sm border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 rounded-lg py-2 transition"><Plus size={16} className="inline ml-2"/> افزودن حرکت خارج از برنامه</button>
            )}
          </div>
        </div>

        {/* Nutrition, Vitals (Right) */}
        <div className="space-y-6">
          <div className="energetic-card p-6">
            <h2 className="text-lg font-bold flex items-center mb-4"><Utensils className="ml-2 text-green-400"/> ثبت تغذیه</h2>
            <div className="space-y-2">
              {nutritionPlan.map(item => (
                <div key={item.id} onClick={() => toggleNutritionComplete(item.id)} className="flex items-center bg-black/20 p-3 rounded-lg cursor-pointer hover:bg-white/10">
                  {item.completed ? <CheckCircle2 className="text-green-500 ml-3"/> : <Circle className="text-gray-600 ml-3"/>}
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>{item.title}</span>
                  <span className="text-xs text-gray-400">{item.macros.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>

          <div className="energetic-card p-6">
             <h2 className="text-lg font-bold flex items-center mb-4"><Flame className="ml-2 text-orange-400"/> عادت‌ها</h2>
             <div className="space-y-2">
              {profile.habits.map(h => (
                 <div key={h.id} onClick={() => toggleHabit(h.id)} className="flex items-center justify-between bg-black/20 p-3 rounded-lg cursor-pointer hover:bg-white/10">
                   <div className="flex items-center">
                      {h.completedToday ? <CheckCircle2 className="text-green-500 ml-3"/> : <Circle className="text-gray-600 ml-3"/>}
                      <span className={` ${h.completedToday ? 'line-through text-gray-500' : 'text-white'}`}>{h.title}</span>
                   </div>
                   <div className="flex items-center text-xs text-orange-400"><Flame size={12} className="ml-1"/> {h.streak}</div>
                 </div>
              ))}
             </div>
          </div>
          
          <div className="energetic-card p-6">
             <h2 className="text-lg font-bold flex items-center mb-4"><Activity className="ml-2 text-red-400"/> شاخص‌های حیاتی</h2>
             <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-gray-400 block mb-1">وزن (kg)</label><input type="number" value={bodyWeight || ''} onChange={e => setBodyWeight(+e.target.value)} className="w-full input-styled p-2" /></div>
                   <div><label className="text-gray-400 block mb-1">خواب (h)</label><input type="number" value={sleepData.hours} onChange={e => setSleepData({...sleepData, hours: +e.target.value})} className="w-full input-styled p-2" /></div>
                   <div><label className="text-gray-400 block mb-1">قدم‌ها</label><input type="number" value={steps || ''} onChange={e => setSteps(+e.target.value)} className="w-full input-styled p-2" /></div>
                   <div><label className="text-gray-400 block mb-1">آب (لیوان)</label><input type="number" value={waterIntake} onChange={e => setWaterIntake(+e.target.value)} className="w-full input-styled p-2" /></div>
                </div>
                <div>
                   <label className="text-gray-400 block mb-2">سطح انرژی (۱-۱۰)</label>
                   <input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(+e.target.value)} className="w-full accent-blue-500"/>
                </div>
                 <div>
                   <label className="text-gray-400 block mb-2">حال روحی</label>
                   <div className="flex justify-around bg-black/20 p-2 rounded-lg">
                      <button onClick={() => setMood('sad')} className={`p-2 rounded-full ${mood==='sad' ? 'bg-blue-600' : ''}`}><Frown className="text-gray-400"/></button>
                      <button onClick={() => setMood('neutral')} className={`p-2 rounded-full ${mood==='neutral' ? 'bg-blue-600' : ''}`}><Meh className="text-gray-400"/></button>
                      <button onClick={() => setMood('happy')} className={`p-2 rounded-full ${mood==='happy' ? 'bg-blue-600' : ''}`}><Smile className="text-gray-400"/></button>
                      <button onClick={() => setMood('energetic')} className={`p-2 rounded-full ${mood==='energetic' ? 'bg-blue-600' : ''}`}><Zap className="text-gray-400"/></button>
                      <button onClick={() => setMood('tired')} className={`p-2 rounded-full ${mood==='tired' ? 'bg-blue-600' : ''}`}><Battery className="text-gray-400"/></button>
                   </div>
                </div>
             </div>
          </div>

          <button onClick={handleFinishDay} className="w-full btn-primary py-4 text-lg flex items-center justify-center shadow-lg">
            <Save className="ml-2"/> اتمام و ذخیره روز
          </button>
        </div>
      </div>

    </div>
  );
};

export default DailyTracker;
