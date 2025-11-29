
import React, { useState, useEffect } from 'react';
import { AdminStats } from '../types';
import { getAdminAnalytics } from '../services/pricingService';
import { 
    LayoutDashboard, Users, DollarSign, Shield, Activity, Video, Mail, Menu
} from 'lucide-react';
import AdminUserManagement from './AdminUserManagement';
import AdminFinancePanel from './AdminFinancePanel';
import AdminVideoPanel from './AdminVideoPanel';
import AdminActivityMonitor from './AdminActivityMonitor';
import AdminInbox from './AdminInbox';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'finance' | 'videos' | 'activity' | 'inbox'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
      getAdminAnalytics().then(setStats);
  }, []);

  return (
    <div className="flex h-screen bg-[#0F172A] text-white overflow-hidden font-sans dir-rtl" dir="ltr">
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1E293B] border-r border-gray-700 flex flex-col transition-all duration-300 z-20`}>
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                {sidebarOpen ? <span className="font-bold text-lg">FIT PRO ADMIN</span> : <Shield className="text-blue-500"/>}
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <LayoutDashboard size={20} /> {sidebarOpen && <span className="ml-3">Overview</span>}
                </button>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <Users size={20} /> {sidebarOpen && <span className="ml-3">User Management</span>}
                </button>
                <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'finance' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <DollarSign size={20} /> {sidebarOpen && <span className="ml-3">Finance</span>}
                </button>
                <button onClick={() => setActiveTab('videos')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'videos' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <Video size={20} /> {sidebarOpen && <span className="ml-3">Videos</span>}
                </button>
                <button onClick={() => setActiveTab('activity')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'activity' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <Activity size={20} /> {sidebarOpen && <span className="ml-3">Activity Log</span>}
                </button>
                <button onClick={() => setActiveTab('inbox')} className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === 'inbox' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                    <Mail size={20} /> {sidebarOpen && <span className="ml-3">Inbox</span>}
                </button>
            </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
            <header className="h-16 bg-[#1E293B]/50 border-b border-gray-700 flex items-center justify-between px-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400"><Menu/></button>
                <h2 className="text-xl font-bold capitalize">{activeTab.replace('_', ' ')}</h2>
            </header>

            <div className="flex-1 overflow-y-auto bg-black/20">
                {activeTab === 'dashboard' && stats && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700">
                            <p className="text-gray-400 text-xs uppercase">Total Users</p>
                            <h3 className="text-3xl font-black mt-2">{stats.totalUsers}</h3>
                        </div>
                        <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700">
                            <p className="text-gray-400 text-xs uppercase">Elite Members</p>
                            <h3 className="text-3xl font-black mt-2 text-yellow-400">{stats.eliteUsers}</h3>
                        </div>
                    </div>
                )}
                {activeTab === 'users' && <AdminUserManagement />}
                {activeTab === 'finance' && <AdminFinancePanel />}
                {activeTab === 'videos' && <AdminVideoPanel />}
                {activeTab === 'activity' && <AdminActivityMonitor />}
                {activeTab === 'inbox' && <AdminInbox />}
            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;
