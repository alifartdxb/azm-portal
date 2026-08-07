import React, { useState, useEffect } from 'react';
import { getCollection, updateDocument } from '../../services/db';
import { Shield, ShieldAlert, User, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getCollection('users');
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDocument('users', userId, { role: newRole });
      loadUsers(); // refresh
    } catch (e) {
      console.error("Failed to update role", e);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
      await updateDocument('users', userId, { status: newStatus });
      loadUsers();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  if (role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-stone-800">Access Denied</h2>
        <p className="text-stone-500 mt-2">You do not have permission to view or manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">User & Role Management</h1>
          <p className="text-stone-500 text-sm">Manage access control and user permissions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-500">No users found. (Ensure they are synced to Firestore)</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold uppercase">
                          {u.email ? u.email.charAt(0) : <User size={16} />}
                        </div>
                        <span className="font-medium text-stone-800">{u.displayName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role || 'viewer'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={role !== 'super_admin'}
                        className="bg-stone-100 border-none rounded-lg px-3 py-1 text-sm text-stone-700 font-medium focus:ring-2 focus:ring-brand-primary cursor-pointer"
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="seo_manager">SEO Manager</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${u.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.status === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`text-xs px-2 py-1 rounded font-bold uppercase ${u.status === 'inactive' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                        >
                          {u.status === 'inactive' ? 'Activate' : 'Deactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
