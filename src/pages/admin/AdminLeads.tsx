import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, X, Mail } from 'lucide-react';
import { getCollection, updateDocument, deleteDocument } from '../../services/db';

export function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingLead, setViewingLead] = useState<any | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getCollection('inquiries');
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteDocument('inquiries', id);
      setLeads(leads.filter(l => l.id !== id));
      if (viewingLead?.id === id) setViewingLead(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
      alert('Failed to delete lead.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDocument('inquiries', id, { status: newStatus });
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (viewingLead?.id === id) setViewingLead({ ...viewingLead, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredLeads = leads.filter(l => 
    (false) ||
    (false)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Inquiries Management</h1>
          <p className="text-stone-500 text-sm">Manage incoming product inquiries, quotes, and contact requests.</p>
        </div>
        <button onClick={() => {
          const headers = ['id', 'name', 'company', 'email', 'phone', 'productName', 'sku', 'status', 'createdAt', 'message'];
          const csv = [headers.join(','), ...leads.map(l => headers.map(h => `"${(l[h]||'').toString().replace(/"/g, '""')}"`).join(','))].join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
        }} className="px-4 py-2 bg-brand-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-secondary transition-colors">
          Export CSV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className={`w-full ${viewingLead ? 'lg:w-2/3' : 'lg:w-full'} transition-all`}>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search leads by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Product/SKU</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-stone-500">Loading...</td></tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-stone-500">No leads found.</td></tr>
                  ) : filteredLeads.map((lead) => (
                    <tr key={lead.id} className={`hover:bg-stone-50 transition-colors ${viewingLead?.id === lead.id ? 'bg-stone-50' : ''}`}>
                      <td className="px-6 py-4 font-bold text-stone-800">{lead.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-stone-600">
                        <div>{lead.email}</div>
                        <div className="text-xs text-stone-400">{lead.phone}</div>
                        {lead.company && <div className="text-xs font-medium text-stone-500">{lead.company}</div>}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {lead.productName ? (
                           <>
                             <div className="font-bold text-stone-700 text-xs truncate max-w-[150px]">{lead.productName}</div>
                             <div className="text-[10px] text-stone-400 uppercase tracking-wider">{lead.sku}</div>
                           </>
                        ) : (
                           <span className="text-xs text-stone-400 italic">General Inquiry</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs font-bold uppercase rounded px-2 py-1 border-none focus:ring-0 cursor-pointer ${
                            lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'Closed' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Quotation Sent">Quotation Sent</option>
                          <option value="Closed">Closed</option>
                          <option value="Spam">Spam</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setViewingLead(lead)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Eye size={16} /></button>
                          <button onClick={() => handleDelete(lead.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {viewingLead && (
          <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sticky top-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-stone-800">Lead Details</h2>
              <button onClick={() => setViewingLead(null)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Name</p>
                <p className="font-medium text-stone-800">{viewingLead.name}</p>
              </div>
              
              <div>
                <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Email</p>
                <a href={`mailto:${viewingLead.email}`} className="font-medium text-brand-primary flex items-center gap-2 hover:underline">
                  <Mail size={14} /> {viewingLead.email}
                </a>
              </div>
              
              {viewingLead.phone && (
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-stone-800">{viewingLead.phone}</p>
                </div>
              )}
              
              {viewingLead.company && (
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Company</p>
                  <p className="font-medium text-stone-800">{viewingLead.company}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Message</p>
                <div className="bg-stone-50 p-4 rounded-lg text-stone-700 text-sm whitespace-pre-wrap border border-stone-100">
                  {viewingLead.message || 'No message provided.'}
                </div>
              </div>
              {viewingLead.productName && (
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 mt-4">
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-2">Product Inquiry Details</p>
                  <p className="font-medium text-stone-800 text-sm mb-1">{viewingLead.productName}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    {viewingLead.sku && <div><span className="text-stone-400">SKU:</span> {viewingLead.sku}</div>}
                    {viewingLead.brand && <div><span className="text-stone-400">Brand:</span> {viewingLead.brand}</div>}
                    {viewingLead.quantity && <div><span className="text-stone-400">Qty:</span> {viewingLead.quantity}</div>}
                    {viewingLead.projectName && <div><span className="text-stone-400">Project:</span> {viewingLead.projectName}</div>}
                  </div>
                  {viewingLead.productUrl && (
                    <a href={viewingLead.productUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-primary hover:underline mt-2 inline-block">View Product Page</a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
