
import React, { useState } from 'react';
import { Copy, AlertTriangle, Loader2 } from 'lucide-react';
import { verifyTetherPayment } from '../services/pricingService';

interface PaymentUSDTFormProps {
  walletAddress: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentUSDTForm: React.FC<PaymentUSDTFormProps> = ({ walletAddress, amount, onSuccess }) => {
  const [txid, setTxid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('آدرس ولت کپی شد!');
  };

  const handleVerifyTxID = async () => {
    if (!txid) {
      setErrorMsg("لطفا TxID تراکنش را وارد کنید.");
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const result = await verifyTetherPayment(txid, amount);
      if (result.verified) {
        onSuccess();
      } else {
        setErrorMsg(result.message || "تراکنش یافت نشد یا مبلغ نامعتبر است.");
      }
    } catch (e) {
      setErrorMsg("خطا در ارتباط با سرور.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
      {/* QR & Address */}
      <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="bg-white p-2 rounded-lg mb-4">
          <img src={qrCodeUrl} alt="USDT Wallet QR" className="w-36 h-36" />
        </div>
        <p className="text-xs text-gray-400 mb-2">Scan to pay with TrustWallet / TronLink</p>
        <div className="w-full bg-black/40 p-3 rounded-lg border border-gray-600 flex items-center justify-between group cursor-pointer" onClick={handleCopy}>
          <code className="text-[#22C1C3] text-xs break-all font-mono truncate mr-2">{walletAddress}</code>
          <Copy size={16} className="text-gray-400 group-hover:text-white transition" />
        </div>
        <div className="mt-3 flex items-center text-[10px] text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded">
          <AlertTriangle size={12} className="mr-1" />
          واریز فقط بر روی شبکه <strong>TRC20 (Tron)</strong>
        </div>
      </div>

      {/* TxID Input */}
      <div className="flex flex-col justify-center">
        <div className="mb-6">
          <label className="block text-sm text-white mb-2 font-bold">مرحله نهایی: ثبت شناسه تراکنش</label>
          <p className="text-xs text-gray-400 mb-3">پس از واریز موفق، کد TXID (هش تراکنش) را از کیف پول خود کپی کرده و اینجا وارد کنید.</p>
          <input 
            type="text" 
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder="Enter TxID (e.g., 8f343...)" 
            className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-[#22C1C3] focus:ring-1 focus:ring-[#22C1C3] outline-none transition font-mono text-sm"
          />
        </div>

        {errorMsg && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-4 flex items-center">
            <AlertTriangle size={16} className="mr-2 shrink-0"/> {errorMsg}
          </div>
        )}

        <button 
          onClick={handleVerifyTxID}
          disabled={isProcessing || !txid}
          className="w-full bg-gradient-to-r from-[#22C1C3] to-blue-600 hover:from-[#1CA7A9] hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/50 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : "بررسی و فعال‌سازی آنی"}
        </button>
      </div>
    </div>
  );
};

export default PaymentUSDTForm;
