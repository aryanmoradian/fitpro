
import React, { useState } from 'react';
import { FoodItem, WeeklyNutritionPlan, DailyMealPlan, MealEntry, UserProfile } from '../types';
import { Plus, Trash2, Search, PieChart, ChevronLeft, ChevronRight, Save, Coffee, Sun, Moon, Apple, X, User } from 'lucide-react';

// --- EXPANDED FOOD DATABASE ---
const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // Breakfast
  { id: 'bf1', name: 'تخم مرغ (آبپز)', calories: 155, protein: 13, carbs: 1.1, fats: 11, unit: 'عدد', defaultPortion: 2, category: 'Breakfast' },
  { id: 'bf2', name: 'جو دوسر (پخته)', calories: 150, protein: 5, carbs: 27, fats: 3, unit: 'پیمانه پخته', defaultPortion: 1, category: 'Breakfast' },
  { id: 'bf3', name: 'نان تست سبوس‌دار', calories: 80, protein: 4, carbs: 14, fats: 1, unit: 'برش', defaultPortion: 2, category: 'Breakfast' },
  { id: 'bf4', name: 'پنیر فتا', calories: 75, protein: 4, carbs: 1, fats: 6, unit: 'قوطی کبریت', defaultPortion: 1, category: 'Breakfast' },
  { id: 'bf5', name: 'املت گوجه', calories: 200, protein: 14, carbs: 5, fats: 15, unit: 'پرس', defaultPortion: 1, category: 'Breakfast' },
  
  // Proteins (Lunch/Dinner)
  { id: 'pr1', name: 'سینه مرغ (گریل)', calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: '100g', defaultPortion: 150, category: 'Lunch/Dinner' },
  { id: 'pr2', name: 'ماهی سالمون', calories: 208, protein: 20, carbs: 0, fats: 13, unit: '100g', defaultPortion: 150, category: 'Lunch/Dinner' },
  { id: 'pr3', name: 'استیک گوساله', calories: 250, protein: 26, carbs: 0, fats: 15, unit: '100g', defaultPortion: 150, category: 'Lunch/Dinner' },
  { id: 'pr4', name: 'تن ماهی (در آب)', calories: 116, protein: 26, carbs: 0, fats: 1, unit: '100g', defaultPortion: 100, category: 'Lunch/Dinner' },
  { id: 'pr5', name: 'توفو', calories: 76, protein: 8, carbs: 2, fats: 4, unit: '100g', defaultPortion: 100, category: 'Lunch/Dinner' },

  // Carbs
  { id: 'cb1', name: 'برنج سفید (کته)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: '100g', defaultPortion: 200, category: 'Lunch/Dinner' },
  { id: 'cb2', name: 'سیب زمینی (آبپز)', calories: 87, protein: 1.9, carbs: 20, fats: 0.1, unit: '100g', defaultPortion: 200, category: 'Lunch/Dinner' },
  { id: 'cb3', name: 'ماکارونی', calories: 131, protein: 5, carbs: 25, fats: 1, unit: '100g', defaultPortion: 150, category: 'Lunch/Dinner' },
  { id: 'cb4', name: 'عدسی', calories: 116, protein: 9, carbs: 20, fats: 0.4, unit: 'کاسه', defaultPortion: 1, category: 'Lunch/Dinner' },

  // Snacks
  { id: 'sn1', name: 'موز', calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3, unit: 'عدد متوسط', defaultPortion: 1, category: 'Snack' },
  { id: 'sn2', name: 'سیب', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, unit: 'عدد متوسط', defaultPortion: 1, category: 'Snack' },
  { id: 'sn3', name: 'بادام درختی', calories: 579, protein: 21, carbs: 22, fats: 50, unit: '100g', defaultPortion: 30, category: 'Snack' },
  { id: 'sn4', name: 'پروتئین بار', calories: 200, protein: 20, carbs: 20, fats: 8, unit: 'عدد', defaultPortion: 1, category: 'Snack' },
  { id: 'sn5', name: 'ماست یونانی', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, unit: '100g', defaultPortion: 150, category: 'Snack' },
];

interface NutritionBuilderProps {
  currentPlan: WeeklyNutritionPlan;
  updatePlan: (plan: WeeklyNutritionPlan) => void;
  profile?: UserProfile;
  updateProfile?: (profile: UserProfile) => void;
}

const NutritionBuilder: React.FC<NutritionBuilderProps> = ({ currentPlan, updatePlan, profile, updateProfile }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast'|'lunch'|'dinner'|'snacks' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'database' | 'custom'>('database');
  const [searchTerm, setSearchTerm] = useState('');

  // Custom Food Form State
  const [customFood, setCustomFood] = useState<Partial<FoodItem>>({
    name: '', calories: 0, protein: 0, carbs: 0, fats: 0, unit: 'g', defaultPortion: 100
  });

  const fullFoodDatabase = [
    ...(profile?.customFoods || []),
    ...INITIAL_FOOD_DATABASE
  ];

  const filteredFood = fullFoodDatabase.filter(f => f.name.includes(searchTerm));

  // Helpers
  const getDailyPlan = (day: number) => {
    let dayPlan = currentPlan.days.find(d => d.dayOfWeek === day);
    if (!dayPlan) {
      dayPlan = { dayOfWeek: day, breakfast: [], lunch: [], dinner: [], snacks: [] };
    }
    return dayPlan;
  };

  const updateDailyPlan = (updatedDay: DailyMealPlan) => {
    const existingIndex = currentPlan.days.findIndex(d => d.dayOfWeek === updatedDay.dayOfWeek);
    let newDays = [...currentPlan.days];
    if (existingIndex >= 0) {
      newDays[existingIndex] = updatedDay;
    } else {
      newDays.push(updatedDay);
    }
    updatePlan({ ...currentPlan, days: newDays });
  };

  const addFoodToMeal = (food: FoodItem) => {
    if (!selectedMealType) return;
    const dayPlan = getDailyPlan(activeDay);
    
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      name: food.name,
      amount: food.defaultPortion,
      macros: {
        calories: Math.round((food.calories * food.defaultPortion) / (food.unit.includes('g') ? 100 : 1)),
        protein: Math.round((food.protein * food.defaultPortion) / (food.unit.includes('g') ? 100 : 1)),
        carbs: Math.round((food.carbs * food.defaultPortion) / (food.unit.includes('g') ? 100 : 1)),
        fats: Math.round((food.fats * food.defaultPortion) / (food.unit.includes('g') ? 100 : 1)),
      }
    };

    const updatedDay = {
      ...dayPlan,
      [selectedMealType]: [...dayPlan[selectedMealType], newEntry]
    };
    updateDailyPlan(updatedDay);
    setIsModalOpen(false);
  };

  const saveCustomFood = () => {
    if (!customFood.name || !profile || !updateProfile) return;
    const newFood: FoodItem = {
      id: `cf_${Date.now()}`,
      name: customFood.name,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein),
      carbs: Number(customFood.carbs),
      fats: Number(customFood.fats),
      unit: customFood.unit || 'g',
      defaultPortion: Number(customFood.defaultPortion),
      isCustom: true
    };

    updateProfile({
      ...profile,
      customFoods: [...(profile.customFoods || []), newFood]
    });
    
    setCustomFood({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, unit: 'g', defaultPortion: 100 });
    setActiveModalTab('database');
    setSearchTerm(newFood.name);
  };

  const removeFoodFromMeal = (mealType: 'breakfast'|'lunch'|'dinner'|'snacks', entryId: string) => {
    const dayPlan = getDailyPlan(activeDay);
    const updatedDay = {
      ...dayPlan,
      [mealType]: dayPlan[mealType].filter(e => e.id !== entryId)
    };
    updateDailyPlan(updatedDay);
  };

  const calculateTotalMacros = (dayPlan: DailyMealPlan) => {
    let total = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const meals: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
    meals.forEach(meal => {
      dayPlan[meal].forEach((entry: MealEntry) => { 
        total.calories += entry.macros.calories;
        total.protein += entry.macros.protein;
        total.carbs += entry.macros.carbs;
        total.fats += entry.macros.fats;
      });
    });
    return total;
  };

  const dayPlan = getDailyPlan(activeDay);
  const totals = calculateTotalMacros(dayPlan);

  const MealSection = ({ title, type, items, icon: Icon }: any) => (
    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <h4 className="font-bold text-white flex items-center text-sm">
          <Icon className="w-4 h-4 ml-2 opacity-70" /> {title}
        </h4>
        <button 
          onClick={() => { setSelectedMealType(type); setIsModalOpen(true); }}
          className="bg-green-600/20 text-green-400 hover:bg-green-600/40 p-1 rounded transition"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
           <div className="text-xs text-gray-600 text-center py-2">خالی</div>
        ) : (
           items.map((item: MealEntry) => (
             <div key={item.id} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded">
               <div>
                 <span className="text-gray-200">{item.name}</span>
                 <span className="text-gray-500 mr-2">({item.amount} {item.amount > 20 ? 'g' : 'unit'})</span>
               </div>
               <div className="flex items-center">
                 <span className="text-orange-300 ml-3">{item.macros.calories} kcal</span>
                 <button onClick={() => removeFoodFromMeal(type, item.id)} className="text-red-400 hover:text-red-300">
                   <Trash2 size={12} />
                 </button>
               </div>
             </div>
           ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4 relative">
      {/* 1. Day Navigation */}
      <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/10">
        <button 
          onClick={() => setActiveDay(prev => Math.max(1, prev - 1))}
          disabled={activeDay === 1}
          className="p-2 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronRight />
        </button>
        <span className="font-bold text-white">برنامه روز {activeDay}</span>
        <button 
          onClick={() => setActiveDay(prev => Math.min(7, prev + 1))}
          disabled={activeDay === 7}
          className="p-2 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
         <MealSection title="صبحانه" type="breakfast" items={dayPlan.breakfast} icon={Coffee} />
         <MealSection title="ناهار" type="lunch" items={dayPlan.lunch} icon={Sun} />
         <MealSection title="شام" type="dinner" items={dayPlan.dinner} icon={Moon} />
         <MealSection title="میان وعده" type="snacks" items={dayPlan.snacks} icon={Apple} />
      </div>

      {/* 2. Macro Summary Footer */}
      <div className="energetic-card p-4 flex justify-between items-center shadow-lg mt-auto">
         <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-center px-4 border-l border-white/10">
               <div className="text-sm text-gray-400">کالری کل</div>
               <div className="text-2xl font-bold text-white">{totals.calories}</div>
            </div>
            <div className="text-center">
               <div className="text-sm text-blue-400">پروتئین</div>
               <div className="text-lg font-bold text-white">{totals.protein}g</div>
            </div>
            <div className="text-center">
               <div className="text-sm text-green-400">کربوهیدرات</div>
               <div className="text-lg font-bold text-white">{totals.carbs}g</div>
            </div>
            <div className="text-center">
               <div className="text-sm text-yellow-400">چربی</div>
               <div className="text-lg font-bold text-white">{totals.fats}g</div>
            </div>
         </div>
         <button className="flex items-center btn-primary shadow transition">
            <Save size={18} className="ml-2" /> ذخیره برنامه
         </button>
      </div>

      {/* 3. Add Food Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-lg rounded-xl border border-gray-600 shadow-2xl flex flex-col max-h-[90%] overflow-hidden">
             {/* Header */}
             <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                <div className="flex space-x-3 space-x-reverse">
                   <button 
                      onClick={() => setActiveModalTab('database')}
                      className={`px-3 py-1 rounded text-sm font-bold transition ${activeModalTab === 'database' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
                   >
                     جستجو در لیست
                   </button>
                   <button 
                      onClick={() => setActiveModalTab('custom')}
                      className={`px-3 py-1 rounded text-sm font-bold transition ${activeModalTab === 'custom' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
                   >
                     خوراکی اختصاصی
                   </button>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
             </div>
             
             <div className="p-4 flex-1 overflow-hidden">
                {activeModalTab === 'database' ? (
                   <div className="flex flex-col h-full">
                      <input 
                        autoFocus
                        placeholder="جستجوی خوراکی..." 
                        className="w-full input-styled p-3 mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
                         {filteredFood.map(food => (
                           <div key={food.id} onClick={() => addFoodToMeal(food)} className="bg-white/5 p-3 rounded flex justify-between items-center cursor-pointer hover:bg-blue-600/20 hover:border-blue-500 border border-transparent transition group">
                              <div>
                                 <div className="text-white font-medium flex items-center">
                                    {food.name}
                                    {food.isCustom && <User className="w-3 h-3 text-purple-400 mr-2" />}
                                 </div>
                                 <div className="text-xs text-gray-400">{food.calories} کالری / {food.defaultPortion}{food.unit}</div>
                              </div>
                              <Plus size={18} className="text-green-400 opacity-0 group-hover:opacity-100 transition" />
                           </div>
                         ))}
                      </div>
                   </div>
                ) : (
                   // --- Custom Food Form ---
                   <div className="space-y-4 overflow-y-auto h-full">
                      <div>
                         <label className="text-xs text-gray-400 block mb-1">نام خوراکی</label>
                         <input value={customFood.name} onChange={e => setCustomFood({...customFood, name: e.target.value})} className="w-full input-styled p-2"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">واحد (گرم/عدد)</label>
                            <input value={customFood.unit} onChange={e => setCustomFood({...customFood, unit: e.target.value})} className="w-full input-styled p-2"/>
                         </div>
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">مقدار پیش‌فرض</label>
                            <input type="number" value={customFood.defaultPortion} onChange={e => setCustomFood({...customFood, defaultPortion: Number(e.target.value)})} className="w-full input-styled p-2"/>
                         </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                         <div>
                            <label className="text-xs text-gray-400 block mb-1 text-center">کالری</label>
                            <input type="number" value={customFood.calories} onChange={e => setCustomFood({...customFood, calories: Number(e.target.value)})} className="w-full input-styled p-2 text-center"/>
                         </div>
                         <div>
                            <label className="text-xs text-blue-400 block mb-1 text-center">پروتئین</label>
                            <input type="number" value={customFood.protein} onChange={e => setCustomFood({...customFood, protein: Number(e.target.value)})} className="w-full input-styled p-2 text-center"/>
                         </div>
                         <div>
                            <label className="text-xs text-green-400 block mb-1 text-center">کرب</label>
                            <input type="number" value={customFood.carbs} onChange={e => setCustomFood({...customFood, carbs: Number(e.target.value)})} className="w-full input-styled p-2 text-center"/>
                         </div>
                         <div>
                            <label className="text-xs text-yellow-400 block mb-1 text-center">چربی</label>
                            <input type="number" value={customFood.fats} onChange={e => setCustomFood({...customFood, fats: Number(e.target.value)})} className="w-full input-styled p-2 text-center"/>
                         </div>
                      </div>
                      <button 
                        onClick={saveCustomFood}
                        disabled={!customFood.name}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold mt-4"
                      >
                         ذخیره در لیست شخصی
                      </button>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionBuilder;
