
import React, { useState, useEffect } from 'react';
import { PendingPayment, PaymentStatus } from '../types';
import { getPendingPayments, updatePaymentStatus } from '../services/pricingService';
import { CheckCircle, XCircle, Loader2, ExternalLink, Calendar, DollarSign, CreditCard } from 'lucide-react';

const AdminPaymentPanel: React.FC = () => {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    const data = await getPendingPayments();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id: string, action: 'succeeded' | 'failed') => {
    setProcessingId(id);
    await updatePaymentStatus(id, action);
    // Refresh local state to reflect the status change
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
    setProcessingId(null);
  };

  // Helper to colorize status
  const getStatusBadge = (status: PaymentStatus) => {
      switch(status) {
          case 'succeeded': return 'bg-green-500/20 text-green-400';
          case 'failed': return 'bg-red-500/20 text-red-400';
          case 'needs_review': return 'bg-orange-500/20 text-orange-400';
          case 'waiting': return 'bg-orange-500/20 text-orange-400';
          default: return 'bg-yellow-500/20 text-yellow-400'; // pending
      }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">Coach Dashboard: Payment Approvals</h1>
        <button onClick={fetchPayments} className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center">
            Refresh List
        </button>
      </div>

      <div className="bg-[#1E293B] border border-gray-700 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
            <div className="p-12 flex justify-center text-gray-400">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        ) : payments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
                No pending payments found.
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-black/30 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Plan / Duration</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Method / Proof</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-gray-200">
                        {payments.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition">
                                <td className="p-4 font-bold">{p.userName}<br/><span className="text-xs text-gray-500 font-normal">{p.userId}</span></td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-xs ${p.plan === 'elite_plus' ? 'bg-cyan-900/50 text-cyan-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                                        {p.plan === 'elite_plus' ? 'Elite Plus' : 'Elite'}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1">{p.durationMonths} Months</div>
                                </td>
                                <td className="p-4 font-mono text-green-400 font-bold">${p.amount}</td>
                                <td className="p-4 text-sm text-gray-400 flex items-center gap-2"><Calendar size={14}/> {p.date}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {p.method === 'usdt_trc20' ? <CreditCard size={16} className="text-blue-400"/> : <DollarSign size={16} className="text-purple-400"/>}
                                        <span className="text-sm">
                                            {p.method === 'usdt_trc20' ? 'Tether' : 
                                             p.method === 'manual' ? 'Receipt' : p.method}
                                        </span>
                                    </div>
                                    {p.receipt_url ? (
                                        <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center mt-1">
                                            View Image <ExternalLink size={10} className="ml-1"/>
                                        </a>
                                    ) : (
                                        <span className="text-xs font-mono text-gray-500 mt-1 truncate max-w-[100px] inline-block" title={p.tx_id}>{p.tx_id || 'N/A'}</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(p.status)}`}>
                                        {p.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        {(p.status === 'pending' || p.status === 'needs_review' || p.status === 'waiting') && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(p.id, 'succeeded')} 
                                                    disabled={!!processingId}
                                                    className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white disabled:opacity-50" title="Approve"
                                                >
                                                    {processingId === p.id ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle size={16} />}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(p.id, 'failed')} 
                                                    disabled={!!processingId}
                                                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white disabled:opacity-50" title="Reject"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentPanel;
