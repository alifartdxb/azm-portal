import fs from 'fs';

// 1. Projects
const projectsList = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/db';

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollection('projects');
        setProjects(data.filter(p => p.status === 'Published'));
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-secondary mb-6">Our Projects</h1>
          <p className="text-lg text-stone-600">Discover our portfolio of prestigious projects across the UAE.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={project.id}>
                <Link to={\`/projects/\${project.slug || project.id}\`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                    {project.featuredImage && (
                      <img src={project.featuredImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">{project.category}</p>
                    <h3 className="text-xl font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2">{project.scope || \`Located in \${project.emirate}\`}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/pages/Projects.tsx', projectsList);

const projectDetail = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCollection } from '../services/db';

export function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollection('projects');
        const found = data.find(p => (p.slug === slug || p.id === slug) && p.status === 'Published');
        setProject(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!project) return <div className="min-h-screen pt-32 text-center">Project not found.</div>;

  return (
    <div className="pt-24 pb-24 bg-stone-50 min-h-screen">
      {project.featuredImage && (
        <div className="w-full h-[50vh] bg-stone-900 relative">
          <img src={project.featuredImage} alt={project.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end pb-16">
            <div className="container mx-auto px-6 max-w-7xl text-white">
              <p className="text-brand-primary font-bold tracking-widest uppercase mb-4">{project.category} • {project.emirate}</p>
              <h1 className="text-4xl md:text-6xl font-display font-bold">{project.name}</h1>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-6 max-w-7xl mt-12">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {project.scope && (
              <section>
                <h2 className="text-2xl font-bold font-display text-brand-secondary mb-4">Project Scope</h2>
                <div className="prose text-stone-600 max-w-none whitespace-pre-line">{project.scope}</div>
              </section>
            )}
            {project.challenges && (
              <section>
                <h2 className="text-2xl font-bold font-display text-brand-secondary mb-4">Challenges</h2>
                <div className="prose text-stone-600 max-w-none whitespace-pre-line">{project.challenges}</div>
              </section>
            )}
            {project.solution && (
              <section>
                <h2 className="text-2xl font-bold font-display text-brand-secondary mb-4">Solution</h2>
                <div className="prose text-stone-600 max-w-none whitespace-pre-line">{project.solution}</div>
              </section>
            )}
            {project.gallery?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-display text-brand-secondary mb-6">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <img key={i} src={img} alt={\`Gallery \${i}\`} className="w-full aspect-[4/3] object-cover rounded-xl" />
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm sticky top-32 space-y-6">
              <h3 className="text-lg font-bold text-brand-secondary border-b border-stone-100 pb-4">Project Details</h3>
              {project.client && <div><p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Client</p><p className="font-medium text-stone-800">{project.client}</p></div>}
              {project.consultant && <div><p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Consultant</p><p className="font-medium text-stone-800">{project.consultant}</p></div>}
              {project.contractor && <div><p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Contractor</p><p className="font-medium text-stone-800">{project.contractor}</p></div>}
              {project.completionYear && <div><p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Completion</p><p className="font-medium text-stone-800">{project.completionYear}</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/pages/ProjectDetail.tsx', projectDetail);

// FAQs
const faqs = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { getCollection } from '../services/db';

export function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCollection('faqs');
      setFaqs(data.filter(f => f.status === 'Published'));
    }
    loadData();
  }, []);

  const categories = [...new Set(faqs.map(f => f.category))];

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-secondary mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-stone-600">Find answers to common questions about our products and services.</p>
        </div>
        
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold font-display text-brand-secondary mb-6">{category}</h2>
              <div className="space-y-4">
                {faqs.filter(f => f.category === category).map(faq => (
                  <div key={faq.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all">
                    <button 
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left font-bold text-stone-800 hover:text-brand-primary transition-colors"
                    >
                      {faq.question}
                      <ChevronDown className={\`transition-transform \${openId === faq.id ? 'rotate-180 text-brand-primary' : 'text-stone-400'}\`} />
                    </button>
                    {openId === faq.id && (
                      <div className="px-6 pb-6 text-stone-600 prose">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/pages/FAQs.tsx', faqs);

// Careers
const careers = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { getCollection } from '../services/db';

export function Careers() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await getCollection('careers');
      setJobs(data.filter(j => j.status === 'Active'));
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
}`;
fs.writeFileSync('src/pages/Careers.tsx', careers);

