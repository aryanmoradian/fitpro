
import React, { useState, useEffect } from 'react';
import { getTransactionLogs } from '../services/adminService';
import { TransactionLog } from '../types';
import { DollarSign, Download, TrendingUp, AlertCircle } from 'lucide-react';

const AdminFinancePanel: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);

  useEffect(() => {
    getTransactionLogs().then(setTransactions);
  }, []);

  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.status === 'confirmed' ? curr.amount : 0), 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + "ID,TxID,Amount,Currency,Status,Date\n" + transactions.map(e => `${e.id},${e.txid},${e.amount},${e.currency},${e.status},${e.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
            <div className="text-3xl font-black text-green-400">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-1">Total Transactions</h3>
            <div className="text-3xl font-black text-blue-400">{transactions.length}</div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-1">Pending Approval</h3>
            <div className="text-3xl font-black text-yellow-400">{transactions.filter(t => t.status === 'pending').length}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Transaction Logs</h2>
        <button onClick={exportCSV} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center text-sm"><Download size={16} className="mr-2"/> Export CSV</button>
      </div>

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 uppercase text-xs font-bold text-gray-500">
                <tr>
                    <th className="p-4">TxID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
                {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono text-xs">{t.txid}</td>
                        <td className="p-4 font-bold text-white">${t.amount}</td>
                        <td className="p-4">{t.createdAt}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs capitalize ${t.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{t.status}</span></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFinancePanel;
