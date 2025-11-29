
import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity } from 'lucide-react';

const PredictiveProgress: React.FC = () => {
    const [currentSquat, setCurrentSquat] = useState<number>(60);
    const [adherence, setAdherence] = useState<number>(80);
    const [projectedFitPro, setProjectedFitPro] = useState(0);
    const [projectedNormal, setProjectedNormal] = useState(0);

    useEffect(() => {
        // Simple predictive logic
        const weeks = 24; // 6 months
        const normalGainRate = 1.005; // 0.5% per week
        const fitProGainRate = 1.015; // 1.5% per week (optimized)

        // Adjust by adherence
        const adjNormalRate = 1 + ((normalGainRate - 1) * (adherence / 100));
        const adjFitProRate = 1 + ((fitProGainRate - 1) * (adherence / 100));

        setProjectedNormal(Math.round(currentSquat * Math.pow(adjNormalRate, weeks)));
        setProjectedFitPro(Math.round(currentSquat * Math.pow(adjFitProRate, weeks)));
    }, [currentSquat, adherence]);

    return (
        <div className="energetic-card p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="mr-2 text-[#22C1C3]" />
                پیش‌بینی پیشرفت ۶ ماهه
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">رکورد اسکات فعلی (kg)</label>
                    <input 
                        type="number" 
                        value={currentSquat} 
                        onChange={(e) => setCurrentSquat(Number(e.target.value))}
                        className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white text-center font-bold focus:border-[#FF6B35] outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">تعهد به برنامه (%)</label>
                    <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        value={adherence} 
                        onChange={(e) => setAdherence(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-3"
                    />
                    <div className="text-center text-xs text-[#FF6B35] font-bold">{adherence}%</div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Normal Path */}
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>مسیر عادی</span>
                        <span>{projectedNormal} kg</span>
                    </div>
                    <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gray-500 transition-all duration-1000" 
                            style={{ width: `${(projectedNormal / (projectedFitPro * 1.2)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* FitPro Path */}
                <div>
                    <div className="flex justify-between text-xs text-white mb-1 font-bold">
                        <span className="flex items-center"><Activity size={12} className="mr-1 text-[#FFD166]"/> مسیر FitPro Elite</span>
                        <span className="text-[#22C1C3]">{projectedFitPro} kg</span>
                    </div>
                    <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden shadow-[0_0_15px_rgba(34,193,195,0.3)]">
                        <div 
                            className="h-full bg-gradient-to-r from-[#22C1C3] to-[#FFD166] transition-all duration-1000 relative" 
                            style={{ width: `${(projectedFitPro / (projectedFitPro * 1.2)) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <span className="text-sm text-gray-300">
                    با FitPro شما <span className="text-[#FF6B35] font-bold">+{Math.round(((projectedFitPro - projectedNormal)/projectedNormal)*100)}%</span> سریعتر رشد می‌کنید.
                </span>
            </div>
        </div>
    );
};

export default PredictiveProgress;
