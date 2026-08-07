import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getCollection, updateDocument, deleteDocument, createDocument } from '../../services/db';

export function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General', status: 'Published' });
  
  const categories = ['General', 'Products', 'Shipping', 'Installation', 'Warranty'];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollection('faqs');
        setFaqs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFaq) {
        await updateDocument('faqs', currentFaq.id, formData);
        setFaqs(faqs.map(f => f.id === currentFaq.id ? { ...formData, id: currentFaq.id } : f));
      } else {
        const id = await createDocument('faqs', formData);
        setFaqs([...faqs, { ...formData, id }]);
      }
      setIsEditing(false);
      setCurrentFaq(null);
    } catch (err) {
      alert("Error saving FAQ");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDocument('faqs', id);
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const toggleStatus = async (id, status) => {
    const newStatus = status === 'Published' ? 'Draft' : 'Published';
    await updateDocument('faqs', id, { status: newStatus });
    setFaqs(faqs.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">FAQs</h1>
          <p className="text-stone-500 text-sm">Manage frequently asked questions</p>
        </div>
        <button onClick={() => { setIsEditing(true); setFormData({ question: '', answer: '', category: 'General', status: 'Published' }); setCurrentFaq(null); }} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2">
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">{currentFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <div>
            <label className="block text-sm font-bold mb-1">Question</label>
            <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Answer</label>
            <textarea required rows="4" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold">Save</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {faqs.map(faq => (
                <tr key={faq.id}>
                  <td className="px-6 py-4 font-medium">{faq.question}</td>
                  <td className="px-6 py-4">{faq.category}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(faq.id, faq.status)} className={`px-3 py-1 rounded-full text-xs font-bold ${faq.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-stone-100'}`}>
                      {faq.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setIsEditing(true); setCurrentFaq(faq); setFormData(faq); }} className="p-2 text-stone-400 hover:text-brand-primary"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}