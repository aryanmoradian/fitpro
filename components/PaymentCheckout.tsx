
import React, { useState } from 'react';
import { UserProfile, SubscriptionTier, PlanDuration } from '../types';
import { calculatePrice, getWalletAddress, submitManualPayment } from '../services/pricingService';
import { Wallet, Loader2, ChevronRight, Copy, Globe, ArrowRight, CreditCard, Check, AlertTriangle } from 'lucide-react';

interface PaymentCheckoutProps {
    targetTier: SubscriptionTier;
    setTargetTier: (tier: SubscriptionTier) => void;
    profile: UserProfile;
    updateProfile: (p: UserProfile) => void;
    onBack: () => void;
    onSuccess: () => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ targetTier, setTargetTier, profile, updateProfile, onBack, onSuccess }) => {
    const [duration, setDuration] = useState<PlanDuration>(1);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [txIdInput, setTxIdInput] = useState('');

    const pricing = calculatePrice(targetTier, duration);
    const walletAddress = getWalletAddress();

    const handleCopyWallet = () => {
        navigator.clipboard.writeText(walletAddress);
        alert('آدرس کیف پول کپی شد.');
    };

    const handleSubmitPayment = async () => {
        if (!txIdInput) {
            setErrorMsg("لطفا کد پیگیری (TxID) را وارد کنید.");
            return;
        }
        
        setIsProcessing(true);
        // Simulate verification delay
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in pb-20 text-right" dir="rtl">
            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                <ChevronRight size={20} className="rotate-180 ml-1"/> بازگشت
            </button>

            <h1 className="text-3xl font-black text-white mb-2">
                تکمیل خرید اشتراک <span className="text-[#22C1C3]">{targetTier === 'elite' ? 'Elite' : 'Elite Plus'}</span>
            </h1>

            {/* Steps Indicator */}
            <div className="flex justify-between mb-8 relative max-w-md mx-auto mt-6">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -z-10"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>1</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>2</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>3</div>
            </div>

            {/* STEP 1: Plan Selection */}
            {step === 1 && (
                <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6 shadow-xl animate-in fade-in">
                    <h2 className="text-xl font-bold text-white mb-4">مدت زمان اشتراک</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[1, 3, 6, 12].map(m => (
                            <button key={m} onClick={() => setDuration(m as PlanDuration)} className={`py-3 rounded-lg text-sm font-bold border transition ${duration === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-gray-600 text-gray-400'}`}>
                                {m} ماه
                            </button>
                        ))}
                    </div>
                    <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center border border-white/5 mb-6">
                        <span className="text-gray-300">مبلغ قابل پرداخت:</span>
                        <span className="text-3xl font-black text-[#22C1C3]">${pricing.discountedUSD} <span className="text-sm font-normal text-gray-500">USDT</span></span>
                    </div>
                    <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">تایید و ادامه</button>
                </div>
            )}

            {/* STEP 2: OK-Exchange Tutorial */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                    <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Wallet className="text-yellow-400" /> راهنمای خرید تتر (OK Exchange)</h2>
                        <div className="space-y-6 text-sm text-gray-300">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold">1</div><div className="w-0.5 h-full bg-gray-700 my-2"></div></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">ثبت نام و احراز هویت</h4>
                                    <p>در صرافی <a href="https://ok-ex.io" target="_blank" className="text-blue-400 hover:underline">OK Exchange</a> ثبت نام کنید و مراحل احراز هویت را تکمیل نمایید.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold">2</div><div className="w-0.5 h-full bg-gray-700 my-2"></div></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">خرید تتر (USDT)</h4>
                                    <p>به بخش "خرید و فروش" بروید و معادل <strong>${pricing.discountedUSD}</strong> تتر خریداری کنید.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold">3</div><div className="w-0.5 h-full bg-gray-700 my-2"></div></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">انتقال داخلی / برداشت</h4>
                                    <p>اگر از کیف پول اختصاصی فیت‌پرو استفاده می‌کنید، از گزینه "انتقال داخلی" استفاده کنید. در غیر این صورت، گزینه "برداشت" را بزنید و شبکه <strong>TRC20</strong> را انتخاب کنید.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold">4</div></div>
                                <div className="w-full">
                                    <h4 className="font-bold text-white mb-1">واریز به آدرس ما</h4>
                                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600 flex items-center justify-between mt-2 cursor-pointer group" onClick={handleCopyWallet}>
                                        <code className="text-[#22C1C3] font-mono break-all">{walletAddress}</code>
                                        <Copy size={16} className="text-gray-400 group-hover:text-white" />
                                    </div>
                                    <p className="text-xs text-yellow-500 mt-2 flex items-center"><AlertTriangle size={12} className="mr-1"/> دقت کنید شبکه انتقال TRC20 باشد.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">بازگشت</button>
                        <button onClick={() => setStep(3)} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center">پرداخت انجام شد <ArrowRight size={16} className="mr-2 rotate-180"/></button>
                    </div>
                </div>
            )}

            {/* STEP 3: Confirm TxID */}
            {step === 3 && (
                <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-6 shadow-2xl animate-in fade-in">
                    <h3 className="text-xl font-bold text-white mb-6">ثبت شناسه تراکنش (TxID)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">TxID را اینجا وارد کنید</label>
                            <input type="text" value={txIdInput} onChange={(e) => setTxIdInput(e.target.value)} placeholder="مثلا: 8f343abc..." className="w-full bg-black/20 border border-gray-600 rounded-xl p-3 text-white focus:border-[#22C1C3] outline-none text-left font-mono" />
                        </div>
                    </div>
                    {errorMsg && <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">{errorMsg}</div>}
                    <button onClick={handleSubmitPayment} disabled={isProcessing} className="w-full mt-6 bg-gradient-to-r from-[#22C1C3] to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center disabled:opacity-50">
                        {isProcessing ? <Loader2 className="animate-spin" /> : "بررسی و فعال‌سازی آنی"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentCheckout;
