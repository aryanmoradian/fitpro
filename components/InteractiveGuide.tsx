
import React, { useState, useLayoutEffect, useRef } from 'react';
import { AppView } from '../types';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Define the structure for each step of the tour
interface GuideStep {
  title: string;
  content: string;
  targetSelector?: string; // CSS selector for the element to highlight
  view?: AppView; // The view to switch to for this step
  isModal?: boolean; // Is it a centered modal instead of pointing to an element?
}

// Define the steps of the interactive guide
const tourSteps: GuideStep[] = [
    {
        isModal: true,
        title: 'به فیت پرو خوش آمدید!',
        content: 'این راهنمای سریع شما را با ویژگی‌های کلیدی داشبورد جدیدتان آشنا می‌کند. بیایید شروع کنیم!',
    },
    {
        targetSelector: '[data-tour-id="dashboard-widgets"]',
        title: 'داشبورد اصلی شما',
        content: 'اینجا داشبورد اصلی شماست. خلاصه‌ای بصری از پیشرفت شما را ارائه می‌دهد. ویجت‌ها با ورود داده‌ها به صورت پویا به‌روز می‌شوند.',
        view: AppView.DASHBOARD,
    },
    {
        targetSelector: '[data-tour-id="sidebar"]',
        title: 'منوی ناوبری',
        content: 'از این منو برای جابجایی بین بخش‌های مختلف استفاده کنید. مراحل راه‌اندازی تکمیل‌شده یک تیک دریافت می‌کنند و گام پیشنهادی بعدی می‌درخشد.',
        view: AppView.DASHBOARD,
    },
    {
        targetSelector: '[data-tour-id="profile-info-card"]',
        title: 'پروفایل و بدن',
        content: 'اینجا بخش پروفایل شماست. اطلاعات شخصی را مدیریت کنید، معیارهای بدن را پیگیری کنید، اهداف تعیین کنید و عکس‌های پیشرفت خود را آپلود کنید. برای به‌روزرسانی روی «ویرایش» کلیک کنید.',
        view: AppView.BODY_ANALYSIS,
    },
    {
        targetSelector: '[data-tour-id="advanced-analytics-dashboard"]',
        title: 'تحلیل پیشرفته',
        content: 'با تحلیل‌های پیشرفته، عمیق‌تر به عملکرد خود بپردازید. اگر اولین بارتان است، یک راهنما به شما در درک و وارد کردن داده‌های بیومتریک مانند VO2 Max و تاریخچه هورمونی کمک می‌کند.',
        view: AppView.ADVANCED_ANALYTICS,
    },
    {
        targetSelector: '[data-tour-id="planner-mode-switcher"]',
        title: 'طراح برنامه تمرینی',
        content: 'برنامه‌های تمرینی خود را اینجا طراحی کنید. از تولیدکننده هوش مصنوعی برای شروع سریع استفاده کنید، یا به سازنده حرفه‌ای بروید تا برنامه‌های هفتگی دقیقی از کتابخانه گسترده تمرینات ما ایجاد کنید.',
        view: AppView.PLANNER,
    },
    {
        targetSelector: '[data-tour-id="tracker-workout-log"]',
        title: 'ثبت روزانه',
        content: 'اینجا جایی است که فعالیت‌های روزانه خود را ثبت می‌کنید. ست‌های تمرینی خود را پیگیری کنید، وعده‌های تغذیه خود را تیک بزنید و معیارهای سلامتی مانند خواب و حال را ثبت کنید.',
        view: AppView.TRACKER,
    },
    {
        targetSelector: '[data-tour-id="coach-chat-input"]',
        title: 'مربی هوشمند',
        content: 'سوالی دارید؟ با مربی هوشمند هوش مصنوعی خود چت کنید. مشاوره شخصی در مورد تمرین، تغذیه یا انگیزه خود دریافت کنید.',
        view: AppView.COACH,
    },
    {
        targetSelector: '[data-tour-id="meal-scan-uploader"]',
        title: 'اسکنر خوراکی',
        content: 'از اسکنر وعده تغذیه برای عکس گرفتن از خوراکی خود استفاده کنید. هوش مصنوعی آن را تحلیل می‌کند، درشت مغذی‌ها را تخمین می‌زند و به شما بازخورد می‌دهد.',
        view: AppView.MEAL_SCAN,
    },
    {
        isModal: true,
        title: 'شما آماده‌اید!',
        content: 'تور به پایان رسید. هر زمان که بخواهید می‌توانید این راهنما را از منوی تنظیمات مجدداً راه‌اندازی کنید. حالا بروید و به اهدافتان برسید!',
    },
];


// Props for the component
interface InteractiveGuideProps {
  onClose: () => void;
  setCurrentView: (view: AppView) => void;
}

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({ onClose, setCurrentView }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = tourSteps[currentStep];

  // Effect to switch views and find the target element
  useLayoutEffect(() => {
    const findTarget = () => {
      if (step.view) {
        setCurrentView(step.view);
      }
      
      if (step.targetSelector) {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        } else {
          setTargetRect(null); 
        }
      } else {
        setTargetRect(null); // No target for this step (e.g., modal)
      }
    };
    
    // A small timeout helps ensure the new view's elements are in the DOM before we measure them.
    const timer = setTimeout(findTarget, 150);
    return () => clearTimeout(timer);
  }, [currentStep, setCurrentView]);

  // Handle navigation
  const next = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // End of tour
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calculate tooltip position logic
  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect || !tooltipRef.current) return { visibility: 'hidden' };
    
    const { innerWidth, innerHeight } = window;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const spaceBelow = innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;
    
    let top, left = targetRect.left;

    // Position vertically
    if (spaceBelow > tooltipHeight + 20) {
      top = targetRect.bottom + 10;
    } else if (spaceAbove > tooltipHeight + 20) {
      top = targetRect.top - tooltipHeight - 10;
    } else {
      top = innerHeight / 2 - tooltipHeight / 2;
    }

    // Position horizontally, ensuring it doesn't go off-screen
    if (left + tooltipWidth > innerWidth - 20) {
        left = innerWidth - tooltipWidth - 20;
    }
    if (left < 20) {
        left = 20;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  const highlightStyle: React.CSSProperties = targetRect ? {
      position: 'absolute',
      top: `${targetRect.top - 5}px`,
      left: `${targetRect.left - 5}px`,
      width: `${targetRect.width + 10}px`,
      height: `${targetRect.height + 10}px`,
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      zIndex: 51,
      transition: 'all 0.3s ease-in-out'
  } : {};

  return (
    <div className="fixed inset-0 z-[100] animate-in fade-in">
        {/* Highlight Box */}
        {targetRect && !step.isModal && (
            <div style={highlightStyle} />
        )}

        {/* Backdrop for modal steps */}
        {step.isModal && (
            <div className="absolute inset-0 bg-black/70 z-50" onClick={onClose}/>
        )}

      {/* Tooltip/Modal Box */}
      <div
        ref={tooltipRef}
        className={`absolute bg-gray-800 text-white rounded-lg shadow-2xl p-6 border border-gray-600 w-96 z-50 transition-all duration-300 ${step.isModal || !targetRect ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
        style={!step.isModal ? getTooltipPosition() : {}}
      >
        <button onClick={onClose} className="absolute top-3 left-3 text-gray-400 hover:text-white">
            <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-3 text-blue-400 flex items-center">
            <Sparkles size={20} className="ml-2 text-yellow-400"/>
            {step.title}
        </h3>
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">{step.content}</p>

        {/* Navigation */}
        <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
                مرحله {currentStep + 1} از {tourSteps.length}
            </div>
            <div className="flex space-x-2 space-x-reverse">
                {currentStep > 0 && <button onClick={prev} className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md flex items-center"><ChevronRight size={16} className="ml-1"/>قبلی</button>}
                <button onClick={next} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-md font-semibold flex items-center">
                    {currentStep === tourSteps.length - 1 ? 'پایان' : 'بعدی'}
                    {currentStep < tourSteps.length - 1 && <ChevronLeft size={16} className="mr-1"/>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;
