import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getCollection, updateDocument, deleteDocument, createDocument } from '../../services/db';

export function AdminCareers() {
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: 'Dubai, UAE', type: 'Full-time', description: '', requirements: '', status: 'Active' });

  useEffect(() => {
    async function loadData() {
      const data = await getCollection('careers');
      setJobs(data);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentJob) {
        await updateDocument('careers', currentJob.id, formData);
        setJobs(jobs.map(j => j.id === currentJob.id ? { ...formData, id: currentJob.id } : j));
      } else {
        const id = await createDocument('careers', formData);
        setJobs([...jobs, { ...formData, id }]);
      }
      setIsEditing(false);
    } catch (err) {
      alert("Error saving job");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDocument('careers', id);
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display">Careers</h1>
        <button onClick={() => { setIsEditing(true); setCurrentJob(null); setFormData({ title: '', location: 'Dubai, UAE', type: 'Full-time', description: '', requirements: '', status: 'Active' }); }} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus size={18} /> Add Job
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border space-y-4">
          <div><label className="font-bold">Job Title</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-bold">Location</label><input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="font-bold">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option>Full-time</option><option>Part-time</option></select></div>
          </div>
          <div><label className="font-bold">Description</label><textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
          <div><label className="font-bold">Requirements</label><textarea required rows="4" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
          <div><label className="font-bold">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option>Active</option><option>Closed</option></select></div>
          <div className="flex gap-4"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save</button></div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-t border-stone-100">
                  <td className="px-6 py-4 font-bold">{job.title}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{job.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setIsEditing(true); setCurrentJob(job); setFormData(job); }} className="p-2"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500"><Trash2 size={16} /></button>
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