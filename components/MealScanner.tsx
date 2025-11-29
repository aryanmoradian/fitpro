
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { Camera, Upload, RefreshCw, Lock, Crown } from 'lucide-react';
import { UserProfile, AppView } from '../types';

interface MealScannerProps {
  profile?: UserProfile;
  setCurrentView?: (view: AppView) => void;
}

const MealScanner: React.FC<MealScannerProps> = ({ profile, setCurrentView }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPremium = profile?.subscriptionTier !== 'free';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setAnalysis('');
        // Immediately analyze upon selection
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    // Remove data URL prefix for API
    const base64Data = base64.split(',')[1];
    const result = await analyzeFoodImage(base64Data);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const triggerUpload = () => {
    if (!isPremium) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center h-full relative">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 tracking-wide flex items-center justify-center">
             <Camera className="ml-3" />
             اسکنر هوشمند خوراکی
             {!isPremium && <Lock className="mr-3 text-yellow-500" size={24} />}
        </h2>
        <p className="text-gray-400">با یک عکس، کالری و ماکروهای خوراکی خود را با هوش مصنوعی تحلیل کنید.</p>
      </div>

      <div className="w-full energetic-card overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        {/* Premium Lock Overlay */}
        {!isPremium && (
            <div className="premium-lock-overlay p-6 text-center">
                <Crown size={48} className="text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">قابلیت ویژه Elite</h3>
                <p className="text-gray-300 mb-6 max-w-md">تحلیل هوشمند خوراکی با هوش مصنوعی تنها برای اعضای Elite در دسترس است. برای دسترسی به این ابزار قدرتمند ارتقا دهید.</p>
                <button 
                  onClick={() => setCurrentView && setCurrentView(AppView.SUBSCRIPTION_LANDING)}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition"
                >
                  ارتقا به عضویت Elite
                </button>
            </div>
        )}

        {/* Image Area */}
        <div className={`w-full md:w-1/2 bg-black/20 flex items-center justify-center p-6 relative min-h-[300px] border-b md:border-b-0 md:border-l border-white/10 ${!isPremium ? 'blur-sm' : ''}`}>
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Meal Preview" 
              className="max-h-80 rounded-lg object-contain"
            />
          ) : (
            <div 
              data-tour-id="meal-scan-uploader"
              onClick={triggerUpload}
              className={`border-2 border-dashed border-gray-600 rounded-xl p-10 flex flex-col items-center transition text-gray-500 ${isPremium ? 'cursor-pointer hover:border-blue-500 hover:text-blue-500' : 'cursor-not-allowed opacity-50'}`}
            >
              <Camera className="w-16 h-16 mb-4" />
              <span className="font-medium">برای آپلود عکس کلیک کنید</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
            disabled={!isPremium}
          />
        </div>

        {/* Analysis Area */}
        <div className={`w-full md:w-1/2 p-6 flex flex-col ${!isPremium ? 'blur-sm' : ''}`}>
          <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
            نتیجه تحلیل
          </h3>
          
          <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto mb-4 border border-white/10 text-right">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <span>در حال پردازش تصویر...</span>
              </div>
            ) : analysis ? (
              <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{analysis}</p>
            ) : (
              <p className="text-gray-500 text-center mt-10">یک تصویر آپلود کنید تا جزئیات تغذیه‌ای را ببینید.</p>
            )}
          </div>

          <div className="flex space-x-3 space-x-reverse">
            <button 
              onClick={triggerUpload} 
              disabled={!isPremium}
              className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50"
            >
              <Upload className="w-4 h-4 ml-2" />
              {imagePreview ? "آپلود مجدد" : "آپلود عکس"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealScanner;
