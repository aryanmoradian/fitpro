
import React, { useState, useEffect } from 'react';
import { getUserActivities } from '../services/adminService';
import { UserActivity } from '../types';
import { Activity, Clock, Monitor, Globe } from 'lucide-react';

const AdminActivityMonitor: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getUserActivities();
      setActivities(data);
    };
    fetch();
    const interval = setInterval(fetch, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Activity /> User Activity Monitor</h2>
      <div className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/30 uppercase text-xs font-bold text-gray-500">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">User</th>
              <th className="p-4">Event</th>
              <th className="p-4">Device</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {activities.map(act => (
              <tr key={act.id} className="hover:bg-white/5 transition">
                <td className="p-4 flex items-center gap-2"><Clock size={14}/> {act.timestamp}</td>
                <td className="p-4 text-white font-medium">{act.userId}</td>
                <td className="p-4">
                  <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">{act.eventType}</span>
                  {act.eventData && <span className="ml-2 text-xs text-gray-500">{JSON.stringify(act.eventData)}</span>}
                </td>
                <td className="p-4 flex items-center gap-2"><Monitor size={14}/> <span className="truncate max-w-[200px]">{act.deviceInfo}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityMonitor;
