
import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../services/adminService';
import { AdminUserView } from '../types';
import { Edit2, Shield, UserX, Check } from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [editingUser, setEditingUser] = useState<AdminUserView | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const handleUpdate = async () => {
    if (editingUser) {
        await updateUserStatus(editingUser.id, editingUser);
        setEditingUser(null);
        loadUsers();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">User Management Upgrade</h2>
      
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] p-6 rounded-xl w-full max-w-md border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4">Edit User: {editingUser.fullName}</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm">Status</label>
                        <select className="w-full input-styled p-2" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                            <option value="restricted">Restricted</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Subscription Tier</label>
                        <select className="w-full input-styled p-2" value={editingUser.subscription} onChange={e => setEditingUser({...editingUser, subscription: e.target.value as any})}>
                            <option value="free">Free</option>
                            <option value="elite">Elite</option>
                            <option value="elite_plus">Elite Plus</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Admin Notes</label>
                        <textarea className="w-full input-styled p-2" rows={3} value={editingUser.adminNotes || ''} onChange={e => setEditingUser({...editingUser, adminNotes: e.target.value})} placeholder="Internal notes..." />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
                    <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 rounded text-white">Save Changes</button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-black/30 text-gray-400 text-xs uppercase">
                <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Sub</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5">
                        <td className="p-4 text-white">
                            <div className="font-bold">{u.fullName}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="p-4 text-gray-300">{u.subscription}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${u.status === 'banned' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{u.status}</span></td>
                        <td className="p-4">
                            <button onClick={() => setEditingUser(u)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition"><Edit2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
