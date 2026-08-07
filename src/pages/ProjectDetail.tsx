import React, { useState, useEffect } from 'react';
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
        const found = data.find((p: any) => (p.slug === slug || p.id === slug) && p.status === 'Published');
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
                    <img key={i} src={img} alt={`Gallery ${i}`} className="w-full aspect-[4/3] object-cover rounded-xl" />
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
}