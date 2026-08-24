import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { getCollection } from '../services/db';

export function Careers() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await getCollection('careers');
      setJobs(data.filter((j: any) => j.status === 'Active'));
    }
    loadData();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-secondary mb-6">Careers at AZM</h1>
          <p className="text-lg text-stone-600">Join the team building the leading materials platform in the UAE.</p>
        </div>

        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-stone-500">No open positions currently. Please check back later.</div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:border-brand-primary transition-colors flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-stone-500">
                    <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> {job.type}</span>
                  </div>
                  <p className="mt-4 text-stone-600 line-clamp-2">{job.description}</p>
                </div>
                <button className="bg-stone-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary transition-colors shrink-0">
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}