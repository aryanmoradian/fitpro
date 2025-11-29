
import React from 'react';
import { Smartphone, MessageCircle, CreditCard, AlertCircle, Clock } from 'lucide-react';

interface PaymentIRRInfoProps {
  amountIRR: number;
  planName: string;
  duration: number;
}

const PaymentIRRInfo: React.FC<PaymentIRRInfoProps> = ({ amountIRR, planName, duration }) => {
  const supportPhone = "09981749697";
  const whatsappLink = `https://wa.me/989981749697?text=${encodeURIComponent(`سلام، درخواست شماره کارت برای خرید اشتراک ${planName} (${duration} ماهه) به مبلغ ${amountIRR.toLocaleString()} تومان را دارم.`)}`;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-6 animate-in fade-in">
      <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
        <Smartphone size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">پرداخت کارت به کارت (ریالی)</h3>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-400">مبلغ قابل پرداخت:</span>
            <span className="text-[#22C1C3] font-bold font-mono text-lg">{amountIRR.toLocaleString()} تومان</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-yellow-500 bg-yellow-900/20 p-2 rounded text-right">
            <AlertCircle size={14} className="mt-0.5 shrink-0"/>
            <p>توجه: به دلیل محدودیت‌های درگاه بانکی، در حال حاضر فعال‌سازی از طریق کارت به کارت و تایید پشتیبانی انجام می‌شود.</p>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#20bd5a] transition flex items-center justify-center shadow-lg"
        >
            <MessageCircle size={20} className="mr-2"/>
            دریافت شماره کارت در واتساپ
        </a>
        
        <div className="flex items-center justify-center text-gray-500 text-xs gap-1 mt-4">
            <Clock size={12} />
            <span>زمان پاسخگویی معمول: کمتر از ۱۵ دقیقه</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentIRRInfo;
