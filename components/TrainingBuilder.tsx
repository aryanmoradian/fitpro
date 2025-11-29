import React, { useState } from 'react';
import { Exercise, ExerciseLibItem, TrainingSession, WeeklyWorkoutPlan, UserProfile } from '../types';
import { Plus, Trash2, Search, Filter, PlayCircle, GripVertical, Save, Copy, ChevronDown, ChevronUp, Dumbbell, Clock, X, CheckSquare, Square, Check, User } from 'lucide-react';

// --- INITIAL COMPLETE DATABASE ---
const INITIAL_EXERCISE_LIBRARY: ExerciseLibItem[] = [
  // Chest
  { id: 'c1', name: 'پرس سینه هالتر', muscle: 'سینه', equipment: 'هالتر', difficulty: 'Intermediate', description: 'حرکت مادر برای رشد ماهیچه‌های سینه.', category: 'Chest' },
  { id: 'c2', name: 'پرس بالا سینه دمبل', muscle: 'سینه', equipment: 'دمبل', difficulty: 'Intermediate', description: 'تمرکز بر بخش بالایی سینه.', category: 'Chest' },
  { id: 'c3', name: 'قفسه سینه دمبل', muscle: 'سینه', equipment: 'دمبل', difficulty: 'Beginner', description: 'حرکت کششی عالی برای سینه.', category: 'Chest' },
  { id: 'c4', name: 'شنا سوئدی', muscle: 'سینه', equipment: 'وزن بدن', difficulty: 'Beginner', description: 'حرکت کلاسیک تقویت سینه و تنه.', category: 'Chest' },
  { id: 'c5', name: 'پارالل (دیپ)', muscle: 'سینه', equipment: 'وزن بدن', difficulty: 'Advanced', description: 'عالی برای بخش پایینی سینه و پشت بازو.', category: 'Chest' },
  
  // Back
  { id: 'b1', name: 'ددلیفت', muscle: 'پشت', equipment: 'هالتر', difficulty: 'Advanced', description: 'تقویت زنجیره پشتی بدن.', category: 'Back' },
  { id: 'b2', name: 'زیربغل دمبل تک خم', muscle: 'پشت', equipment: 'دمبل', difficulty: 'Intermediate', description: 'تمرکز بر ماهیچه‌های لاتیسموس.', category: 'Back' },
  { id: 'b3', name: 'بارفیکس', muscle: 'پشت', equipment: 'وزن بدن', difficulty: 'Intermediate', description: 'بهترین حرکت وزن بدن برای پهنای پشت.', category: 'Back' },
  { id: 'b4', name: 'زیربغل سیم‌کش', muscle: 'پشت', equipment: 'سیم‌کش', difficulty: 'Beginner', description: 'جایگزین عالی برای بارفیکس.', category: 'Back' },
  { id: 'b5', name: 'پلاور سیم‌کش', muscle: 'پشت', equipment: 'سیم‌کش', difficulty: 'Intermediate', description: 'کشش عالی برای ماهیچه‌های زیربغل.', category: 'Back' },

  // Legs
  { id: 'l1', name: 'اسکات پا هالتر', muscle: 'پا', equipment: 'هالتر', difficulty: 'Advanced', description: 'پادشاه تمرینات پایین تنه.', category: 'Legs' },
  { id: 'l2', name: 'لانگز راه رفتنی', muscle: 'پا', equipment: 'دمبل', difficulty: 'Intermediate', description: 'عالی برای چهارسر و باسن.', category: 'Legs' },
  { id: 'l3', name: 'پرس پا دستگاه', muscle: 'پا', equipment: 'دستگاه', difficulty: 'Beginner', description: 'حجم ساز عالی برای پا.', category: 'Legs' },
  { id: 'l4', name: 'پشت ران دستگاه', muscle: 'پا', equipment: 'دستگاه', difficulty: 'Beginner', description: 'ایزوله کردن همسترینگ.', category: 'Legs' },
  { id: 'l5', name: 'ساق پا ایستاده', muscle: 'پا', equipment: 'دستگاه', difficulty: 'Beginner', description: 'تقویت ماهیچه‌های دوقلو.', category: 'Legs' },

  // Shoulders
  { id: 's1', name: 'پرس سرشانه هالتر', muscle: 'شانه', equipment: 'هالتر', difficulty: 'Intermediate', description: 'حرکت قدرتی برای کل شانه.', category: 'Shoulders' },
  { id: 's2', name: 'نشر جانب دمبل', muscle: 'شانه', equipment: 'دمبل', difficulty: 'Intermediate', description: 'برای گرد کردن و پهن کردن سرشانه.', category: 'Shoulders' },
  { id: 's3', name: 'فیس پول', muscle: 'شانه', equipment: 'سیم‌کش', difficulty: 'Beginner', description: 'عالی برای سلامت شانه و دلتوئید خلفی.', category: 'Shoulders' },

  // Arms
  { id: 'a1', name: 'جلوبازو هالتر ایستاده', muscle: 'بازو', equipment: 'هالتر', difficulty: 'Beginner', description: 'پایه ترین حرکت برای جلو بازو.', category: 'Biceps' },
  { id: 'a2', name: 'جلوبازو دمبل چکشی', muscle: 'بازو', equipment: 'دمبل', difficulty: 'Beginner', description: 'تقویت بازو و ساعد.', category: 'Biceps' },
  { id: 'a3', name: 'پشت بازو سیم‌کش', muscle: 'بازو', equipment: 'سیم‌کش', difficulty: 'Beginner', description: 'فشار عالی بر سر جانبی پشت بازو.', category: 'Triceps' },
  { id: 'a4', name: 'پشت بازو هالتر خوابیده', muscle: 'بازو', equipment: 'هالتر', difficulty: 'Intermediate', description: 'معروف به جمجمه شکن.', category: 'Triceps' },

  // Core
  { id: 'co1', name: 'پلانک', muscle: 'شکم', equipment: 'وزن بدن', difficulty: 'Beginner', description: 'تقویت هسته مرکزی بدن.', category: 'Abs / Core' },
  { id: 'co2', name: 'کرانچ سیم‌کش', muscle: 'شکم', equipment: 'سیم‌کش', difficulty: 'Intermediate', description: 'فشار عالی بر ماهیچه‌های شکم.', category: 'Abs / Core' },
  { id: 'co3', name: 'زیرشکم خلبانی', muscle: 'شکم', equipment: 'وزن بدن', difficulty: 'Intermediate', description: 'تمرکز بر بخش پایینی شکم.', category: 'Abs / Core' },

  // Cardio / HIIT / Yoga
  { id: 'ca1', name: 'دویدن روی تردمیل', muscle: 'فول بادی', equipment: 'دستگاه', difficulty: 'Beginner', description: 'تمرین هوازی.', category: 'Cardio' },
  { id: 'ca2', name: 'برپی', muscle: 'فول بادی', equipment: 'وزن بدن', difficulty: 'Advanced', description: 'حرکت انفجاری فول بادی.', category: 'CrossFit / HIIT' },
  { id: 'yo1', name: 'سگ رو به پایین', muscle: 'فول بادی', equipment: 'وزن بدن', difficulty: 'Beginner', description: 'حرکت کششی یوگا.', category: 'Yoga' },
];

interface TrainingBuilderProps {
  currentPlan: WeeklyWorkoutPlan;
  updatePlan: (plan: WeeklyWorkoutPlan) => void;
  profile?: UserProfile;
  updateProfile?: (profile: UserProfile) => void;
}

const TrainingBuilder: React.FC<TrainingBuilderProps> = ({ currentPlan, updatePlan, profile, updateProfile }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal State
  const [activeModalTab, setActiveModalTab] = useState<'library' | 'custom'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterEquipment, setFilterEquipment] = useState(''); // New state for equipment filter
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  
  // Custom Exercise State
  const [customExerciseForm, setCustomExerciseForm] = useState<Partial<ExerciseLibItem>>({
    name: '', muscle: 'سینه', equipment: 'وزن بدن', difficulty: 'Beginner', description: ''
  });

  // Derived Data
  const fullLibrary = [
    ...(profile?.customExercises || []),
    ...INITIAL_EXERCISE_LIBRARY,
  ];

  const filteredLibrary = fullLibrary.filter(ex => 
    ex.name.includes(searchTerm) && 
    (filterCategory ? ex.category === filterCategory || ex.muscle === filterCategory : true) &&
    (filterEquipment ? ex.equipment === filterEquipment : true) && // Added equipment filter logic
    (filterDifficulty ? ex.difficulty === filterDifficulty : true)
  );

  // Helpers
  const getSession = (day: number) => currentPlan.sessions.find(s => s.dayOfWeek === day);
  
  const addSession = (day: number) => {
    if (getSession(day)) return;
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      name: `جلسه تمرینی ${day}`,
      dayOfWeek: day,
      exercises: []
    };
    updatePlan({ ...currentPlan, sessions: [...currentPlan.sessions, newSession] });
  };

  const updateSessionName = (day: number, name: string) => {
    const updatedSessions = currentPlan.sessions.map(s => 
      s.dayOfWeek === day ? { ...s, name } : s
    );
    updatePlan({ ...currentPlan, sessions: updatedSessions });
  };

  const removeSession = (day: number) => {
    updatePlan({ ...currentPlan, sessions: currentPlan.sessions.filter(s => s.dayOfWeek !== day) });
  };

  const toggleExerciseSelection = (id: string) => {
    setSelectedExerciseIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addSelectedExercisesToSession = () => {
    const session = getSession(activeDay);
    if (!session) {
      alert("لطفا ابتدا یک جلسه تمرینی برای این روز ایجاد کنید.");
      return;
    }

    const newExercises: Exercise[] = selectedExerciseIds.map(id => {
      const libItem = fullLibrary.find(i => i.id === id);
      if (!libItem) return null;
      return {
        id: Date.now().toString() + Math.random(),
        name: libItem.name,
        sets: 3,
        reps: '10-12',
        rest: 60,
        muscleGroup: libItem.muscle,
        notes: ''
      };
    }).filter(Boolean) as Exercise[];

    const updatedSessions = currentPlan.sessions.map(s => 
      s.dayOfWeek === activeDay ? { ...s, exercises: [...s.exercises, ...newExercises] } : s
    );
    updatePlan({ ...currentPlan, sessions: updatedSessions });
    
    // Reset and Close
    setSelectedExerciseIds([]);
    setIsModalOpen(false);
  };

  const saveCustomExercise = () => {
    if (!customExerciseForm.name || !profile || !updateProfile) return;
    const newCustom: ExerciseLibItem = {
      id: `cust_${Date.now()}`,
      name: customExerciseForm.name,
      muscle: customExerciseForm.muscle || 'Full Body',
      equipment: customExerciseForm.equipment || 'وزن بدن',
      difficulty: customExerciseForm.difficulty || 'Beginner',
      description: customExerciseForm.description || '',
      category: customExerciseForm.muscle,
      isCustom: true
    };
    
    updateProfile({
      ...profile,
      customExercises: [...(profile.customExercises || []), newCustom]
    });
    
    // Switch back to library and select it
    setCustomExerciseForm({ name: '', muscle: 'سینه', equipment: 'وزن بدن', difficulty: 'Beginner', description: '' });
    setActiveModalTab('library');
    setSearchTerm(newCustom.name); // Help user find it
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    const updatedSessions = currentPlan.sessions.map(s => 
      s.dayOfWeek === activeDay ? {
        ...s,
        exercises: s.exercises.map(ex => ex.id === exerciseId ? { ...ex, [field]: value } : ex)
      } : s
    );
    updatePlan({ ...currentPlan, sessions: updatedSessions });
  };

  const removeExercise = (exerciseId: string) => {
    const updatedSessions = currentPlan.sessions.map(s => 
      s.dayOfWeek === activeDay ? {
        ...s,
        exercises: s.exercises.filter(ex => ex.id !== exerciseId)
      } : s
    );
    updatePlan({ ...currentPlan, sessions: updatedSessions });
  };
  
  const copySessionToNextDay = () => {
    const currentSession = getSession(activeDay);
    const nextDay = activeDay + 1;
    if (!currentSession || nextDay > 7) return;

    let targetSession = getSession(nextDay);
    const sessions = [...currentPlan.sessions];
    
    if (targetSession) {
        // Overwrite existing session
        const index = sessions.findIndex(s => s.dayOfWeek === nextDay);
        sessions[index] = { ...currentSession, dayOfWeek: nextDay, id: Date.now().toString() };
    } else {
        // Create new session
        sessions.push({ ...currentSession, dayOfWeek: nextDay, id: Date.now().toString() });
    }
    
    updatePlan({ ...currentPlan, sessions });
    setActiveDay(nextDay);
    alert(`برنامه روز ${activeDay} به روز ${nextDay} کپی شد.`);
  };

  const exportPlanAsPDF = () => {
      alert("قابلیت خروجی PDF به زودی اضافه خواهد شد!");
      // Placeholder for future PDF generation logic
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const session = getSession(activeDay);
    if (!session) return;
    
    const newExercises = [...session.exercises];
    if (direction === 'up' && index > 0) {
      [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    }

    const updatedSessions = currentPlan.sessions.map(s => 
      s.dayOfWeek === activeDay ? { ...s, exercises: newExercises } : s
    );
    updatePlan({ ...currentPlan, sessions: updatedSessions });
  };

  const activeSession = getSession(activeDay);

  // Stats
  const totalSets = activeSession?.exercises.reduce((acc, curr) => acc + curr.sets, 0) || 0;
  const estimatedDuration = (totalSets * 2) + (totalSets * (activeSession?.exercises[0]?.rest || 60) / 60);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 1. Schedule Bar */}
      <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-2 border-b border-white/10">
        {[1, 2, 3, 4, 5, 6, 7].map(day => {
          const session = getSession(day);
          return (
            <div 
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 w-32 p-3 rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                activeDay === day 
                  ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_var(--glow-blue)]' 
                  : session 
                    ? 'bg-black/20 border-white/10 hover:bg-white/20' 
                    : 'bg-black/10 border-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">روز {day}</div>
              {session ? (
                <div className="font-bold text-white text-md truncate">{session.name}</div>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); addSession(day); }} className="text-sm text-blue-400 flex items-center justify-center w-full mt-1">
                  <Plus size={14} className="ml-1"/> ایجاد
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 energetic-card p-4 flex flex-col overflow-hidden relative">
           {activeSession ? (
             <>
               <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                 <div className="flex items-center flex-1">
                   <input 
                     value={activeSession.name}
                     onChange={(e) => updateSessionName(activeDay, e.target.value)}
                     className="bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-gray-500 focus:border-blue-500 outline-none px-2 py-1 transition w-1/2"
                   />
                   <span className="text-sm text-gray-500 mr-2">(روز {activeDay})</span>
                 </div>
                 <div className="flex space-x-2 space-x-reverse items-center">
                    <div className="bg-black/20 px-3 py-1 rounded text-sm text-gray-300 flex items-center" title="زمان تخمینی">
                       <Clock size={14} className="ml-1" /> ~{Math.round(estimatedDuration)} دقیقه
                    </div>
                    {/* Add Exercise Button */}
                    <button 
                       onClick={() => setIsModalOpen(true)}
                       className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center text-sm"
                    >
                       <Plus size={16} className="ml-2" /> افزودن حرکت
                    </button>
                    <button onClick={() => removeSession(activeDay)} className="text-red-400 hover:text-red-300 p-2">
                       <Trash2 size={18} />
                    </button>
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                 {activeSession.exercises.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                      <Dumbbell className="w-12 h-12 mb-2 opacity-50" />
                      <p>حرکتی اضافه نشده است</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:underline mt-2">افزودن از کتابخانه</button>
                   </div>
                 ) : (
                   activeSession.exercises.map((ex, idx) => (
                     <div key={ex.id} className="bg-black/20 p-3 rounded-lg border border-white/10 flex flex-col md:flex-row items-center gap-4 group hover:border-blue-500/50 transition">
                       <div className="flex flex-col items-center justify-center space-y-1 text-gray-500">
                          <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="hover:text-blue-400 disabled:opacity-30"><ChevronUp size={16}/></button>
                          <GripVertical size={16} className="cursor-grab" />
                          <button onClick={() => moveExercise(idx, 'down')} disabled={idx === activeSession.exercises.length - 1} className="hover:text-blue-400 disabled:opacity-30"><ChevronDown size={16}/></button>
                       </div>
                       
                       <div className="flex-1 w-full">
                         <div className="flex justify-between mb-2">
                            <span className="font-bold text-white flex items-center">
                              {ex.name}
                            </span>
                            <button onClick={() => removeExercise(ex.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                            <div>
                               <label className="text-[10px] text-gray-500 block">ست</label>
                               <input type="number" value={ex.sets} onChange={(e) => updateExercise(ex.id, 'sets', Number(e.target.value))} className="w-full input-styled px-2 py-1 text-xs text-center" />
                            </div>
                            <div>
                               <label className="text-[10px] text-gray-500 block">تکرار</label>
                               <input value={ex.reps} onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)} className="w-full input-styled px-2 py-1 text-xs text-center" />
                            </div>
                            <div>
                               <label className="text-[10px] text-gray-500 block">استراحت (ثانیه)</label>
                               <input type="number" value={ex.rest} onChange={(e) => updateExercise(ex.id, 'rest', Number(e.target.value))} className="w-full input-styled px-2 py-1 text-xs text-center" />
                            </div>
                         </div>
                         <textarea 
                           placeholder="یادداشت (تمپو، فشار، نکات اجرایی...)" 
                           value={ex.notes || ''} 
                           onChange={(e) => updateExercise(ex.id, 'notes', e.target.value)}
                           rows={2}
                           className="w-full input-styled mt-2 px-2 py-1 text-xs text-gray-300 resize-y"
                         />
                       </div>
                     </div>
                   ))
                 )}
               </div>

               <div className="mt-4 pt-4 border-t border-white/10 flex justify-end space-x-3 space-x-reverse">
                  <button onClick={copySessionToNextDay} className="flex items-center text-sm text-gray-400 hover:text-white transition">
                     <Copy size={16} className="ml-1" /> کپی برای فردا
                  </button>
                  <button onClick={exportPlanAsPDF} className="flex items-center text-sm text-gray-400 hover:text-white transition">
                     <Save size={16} className="ml-1" /> دانلود نسخه اصلی (PDF)
                  </button>
               </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
               <p>برای شروع، روی "ایجاد" در نوار بالا کلیک کنید.</p>
             </div>
           )}
      </div>

      {/* --- EXERCISE LIBRARY MODAL --- */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-4xl h-[90%] rounded-2xl border border-gray-600 shadow-2xl flex flex-col overflow-hidden">
             {/* Modal Header */}
             <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex space-x-4 space-x-reverse">
                   <button 
                     onClick={() => setActiveModalTab('library')}
                     className={`px-4 py-2 rounded-lg font-bold transition ${activeModalTab === 'library' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                   >
                     بانک حرکات
                   </button>
                   <button 
                     onClick={() => setActiveModalTab('custom')}
                     className={`px-4 py-2 rounded-lg font-bold transition ${activeModalTab === 'custom' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                   >
                     ساخت حرکت جدید
                   </button>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
             </div>

             {/* Modal Content */}
             <div className="flex-1 overflow-hidden p-4">
               {activeModalTab === 'library' ? (
                 <div className="flex flex-col h-full">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                       <div className="md:col-span-1 relative">
                          <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
                          <input 
                            placeholder="جستجو..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full input-styled pl-3 pr-10 py-2 text-sm"
                          />
                       </div>
                       <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-styled p-2 text-sm">
                          <option value="">همه ماهیچه‌ها</option>
                          <option value="Chest">سینه</option>
                          <option value="Back">پشت</option>
                          <option value="Legs">پا</option>
                          <option value="Shoulders">شانه</option>
                          <option value="Biceps">جلو بازو</option>
                          <option value="Triceps">پشت بازو</option>
                          <option value="Abs / Core">شکم</option>
                          <option value="Cardio">هوازی</option>
                       </select>
                       <select value={filterEquipment} onChange={e => setFilterEquipment(e.target.value)} className="input-styled p-2 text-sm">
                          <option value="">همه تجهیزات</option>
                          <option value="هالتر">هالتر</option>
                          <option value="دمبل">دمبل</option>
                          <option value="وزن بدن">وزن بدن</option>
                          <option value="سیم‌کش">سیم‌کش</option>
                          <option value="دستگاه">دستگاه</option>
                       </select>
                       <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="input-styled p-2 text-sm">
                          <option value="">همه سطوح</option>
                          <option value="Beginner">مبتدی</option>
                          <option value="Intermediate">متوسط</option>
                          <option value="Advanced">پیشرفته</option>
                       </select>
                    </div>

                    {/* Exercise Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredLibrary.map(ex => (
                             <div 
                               key={ex.id} 
                               onClick={() => toggleExerciseSelection(ex.id)}
                               className={`p-3 rounded-xl border cursor-pointer transition relative group ${
                                 selectedExerciseIds.includes(ex.id) 
                                   ? 'bg-blue-900/30 border-blue-500' 
                                   : 'bg-black/20 border-white/10 hover:border-white/30'
                               }`}
                             >
                                <div className="flex justify-between items-start mb-2">
                                   <div>
                                      <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                                      <span className="text-xs text-gray-400">{ex.muscle} • {ex.equipment}</span>
                                   </div>
                                   {ex.isCustom && <User className="w-4 h-4 text-purple-400" />}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2">{ex.description}</p>
                                
                                <div className="absolute top-3 left-3">
                                   {selectedExerciseIds.includes(ex.id) ? (
                                      <CheckSquare className="text-blue-500 w-5 h-5" />
                                   ) : (
                                      <Square className="text-gray-600 w-5 h-5 group-hover:text-gray-400" />
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                       <span className="text-sm text-gray-400">{selectedExerciseIds.length} مورد انتخاب شده</span>
                       <button 
                         onClick={addSelectedExercisesToSession}
                         disabled={selectedExerciseIds.length === 0}
                         className="btn-primary px-6 py-2 flex items-center"
                       >
                         <Plus size={18} className="ml-2" /> افزودن به برنامه
                       </button>
                    </div>
                 </div>
               ) : (
                 // --- CUSTOM EXERCISE FORM ---
                 <div className="max-w-xl mx-auto h-full flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">تعریف حرکت اختصاصی</h3>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm text-gray-400 mb-1">نام حرکت</label>
                          <input 
                             value={customExerciseForm.name}
                             onChange={e => setCustomExerciseForm({...customExerciseForm, name: e.target.value})}
                             className="w-full input-styled p-3"
                             placeholder="مثلا: شنا سوئدی یک دست"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-sm text-gray-400 mb-1">ماهیچه هدف</label>
                             <select 
                                value={customExerciseForm.muscle}
                                onChange={e => setCustomExerciseForm({...customExerciseForm, muscle: e.target.value})}
                                className="w-full input-styled p-3"
                             >
                                <option value="Chest">سینه</option>
                                <option value="Back">پشت</option>
                                <option value="Legs">پا</option>
                                <option value="Shoulders">شانه</option>
                                <option value="Biceps">جلو بازو</option>
                                <option value="Triceps">پشت بازو</option>
                                <option value="Abs / Core">شکم</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-sm text-gray-400 mb-1">تجهیزات</label>
                             <select 
                                value={customExerciseForm.equipment}
                                onChange={e => setCustomExerciseForm({...customExerciseForm, equipment: e.target.value})}
                                className="w-full input-styled p-3"
                             >
                                <option value="وزن بدن">وزن بدن</option>
                                <option value="دمبل">دمبل</option>
                                <option value="هالتر">هالتر</option>
                                <option value="دستگاه">دستگاه</option>
                                <option value="سیم‌کش">سیم‌کش</option>
                             </select>
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm text-gray-400 mb-1">توضیحات / نکات</label>
                          <textarea 
                             value={customExerciseForm.description}
                             onChange={e => setCustomExerciseForm({...customExerciseForm, description: e.target.value})}
                             className="w-full input-styled p-3 h-32 resize-none"
                             placeholder="نحوه اجرا..."
                          />
                       </div>
                       
                       <button 
                         onClick={saveCustomExercise}
                         disabled={!customExerciseForm.name}
                         className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center mt-4"
                       >
                         <Save size={18} className="ml-2" /> ذخیره و افزودن به لیست
                       </button>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingBuilder;