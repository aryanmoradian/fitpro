import React from 'react';
import { AppView, GuidanceState } from '../types';
import { CheckCircle2, User, Dumbbell, Utensils, CheckSquare, Sparkles } from 'lucide-react';

interface GuidanceTrackerProps {
  guidanceState: GuidanceState;
  setCurrentView: (view: AppView) => void;
}

const GuidanceTracker: React.FC<GuidanceTrackerProps> = ({ guidanceState, setCurrentView }) => {
  const steps = [
    { key: 'photoUploaded', title: 'پروفایل بدن', icon: User, view: AppView.BODY_ANALYSIS },
    { key: 'workoutCreated', title: 'ساخت تمرین', icon: Dumbbell, view: AppView.PLANNER },
    { key: 'nutritionCreated', title: 'ساخت تغذیه', icon: Utensils, view: AppView.PLANNER },
    { key: 'firstLogCompleted', title: 'اولین ثبت', icon: CheckSquare, view: AppView.TRACKER },
  ];

  const completedCount = Object.values(guidanceState).filter(Boolean).length;
  const progress = (completedCount / steps.length) * 100;
  
  const nextStep = steps.find(step => !guidanceState[step.key as keyof GuidanceState]);

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">نقشه راه شما برای موفقیت</h2>
          <p className="text-sm text-gray-400">این مراحل را برای فعال‌سازی کامل هوش مصنوعی و امکانات برنامه تکمیل کنید.</p>
        </div>
        <div className="text-center">
            <span className="font-bold text-2xl text-blue-400">{completedCount}/{steps.length}</span>
            <span className="text-xs text-gray-500 block">مراحل تکمیل شده</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5 my-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          {steps.map(step => {
            const isCompleted = guidanceState[step.key as keyof GuidanceState];
            return (
              <div key={step.key} className="flex flex-col items-center text-center group" title={step.title}>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${isCompleted ? 'bg-green-500/20 border-green-500' : 'bg-gray-700 border-gray-600'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <step.icon className="w-5 h-5 text-gray-500" />}
                </div>
                <span className={`text-xs mt-2 transition ${isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>{step.title}</span>
              </div>
            );
          })}
        </div>

        {nextStep && (
            <div className="text-center md:text-right">
                <div className="flex items-center text-sm text-yellow-400 mb-2 justify-center md:justify-start">
                    <Sparkles size={16} className="ml-2"/>
                    <span>گام بعدی پیشنهادی:</span>
                </div>
                <button 
                    onClick={() => setCurrentView(nextStep.view)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    {nextStep.title}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default GuidanceTracker;