import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Package, Eye, Search, Calendar, FolderTree, Tags, Activity, AlertCircle, Phone, Download } from 'lucide-react';
import { getCollection } from '../../services/db';

const trafficData = [
  { name: 'Jan', inquiries: 40, views: 2400 },
  { name: 'Feb', inquiries: 30, views: 1398 },
  { name: 'Mar', inquiries: 20, views: 9800 },
  { name: 'Apr', inquiries: 27, views: 3908 },
  { name: 'May', inquiries: 18, views: 4800 },
  { name: 'Jun', inquiries: 23, views: 3800 },
  { name: 'Jul', inquiries: 34, views: 4300 },
];

const sourceData = [
  { name: 'Google SEO', value: 400 },
  { name: 'Direct', value: 300 },
  { name: 'Social', value: 300 },
  { name: 'Referral', value: 200 },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    inquiries: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories, brands, leads] = await Promise.all([
          getCollection('products'),
          getCollection('categories'),
          getCollection('brands'),
          getCollection('leads')
        ]);
        
        setStats({
          products: products.length,
          categories: categories.length,
          brands: brands.length,
          inquiries: leads.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">Dashboard Overview</h1>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors">
          Download Report
        </button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Products", value: loading ? "..." : stats.products, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Total Categories", value: loading ? "..." : stats.categories, icon: FolderTree, color: "text-green-600", bg: "bg-green-100" },
          { title: "Total Brands", value: loading ? "..." : stats.brands, icon: Tags, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "New Inquiries", value: loading ? "..." : stats.inquiries, icon: Phone, color: "text-orange-600", bg: "bg-orange-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-stone-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-stone-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-brand-primary" /> Traffic & Inquiries</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="views" fill="#D1D5DB" radius={[4, 4, 0, 0]} name="Page Views" />
                <Bar dataKey="inquiries" fill="#1f2937" radius={[4, 4, 0, 0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2"><Users size={20} className="text-brand-primary" /> Leads by Source</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             {sourceData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-stone-600">{entry.name}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Viewed Products */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2"><Eye size={20} className="text-brand-primary" /> Top Viewed Products</h3>
          <div className="space-y-4">
            {[
              { name: "Vado Sensori SmartTouch", views: "1,245" },
              { name: "Jaquar Artize Tailwater", views: "982" },
              { name: "Italian Standards Carrara", views: "854" },
              { name: "Roman Showers Liberty", views: "743" },
              { name: "Sanit Concealed Cistern", views: "651" },
            ].map((prod, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-stone-700 truncate pr-4">{prod.name}</p>
                <span className="text-xs font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded">{prod.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Analytics */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2"><Search size={20} className="text-brand-primary" /> Search Analytics</h3>
          
          <div className="mb-6">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
               {['gold mixer', 'black shower', 'freestanding tub', 'concealed valve', 'grohe'].map((term, i) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full border border-stone-200">{term}</span>
               ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-1"><AlertCircle size={14} /> Zero-Result Searches</h4>
            <div className="space-y-2">
               {[
                 { term: "hansgrohe", count: 24 },
                 { term: "toto toilet", count: 18 },
                 { term: "kohler sink", count: 12 }
               ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2">
                    <span className="text-stone-600 font-medium">"{item.term}"</span>
                    <span className="text-stone-400 text-xs">{item.count} searches</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Showroom Bookings & Catalogues */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2"><Calendar size={20} className="text-brand-primary" /> Upcoming Bookings</h3>
              <div className="space-y-3">
                {[
                  { name: "Ahmed Mansi", time: "Today, 10:00 AM", type: "Architect" },
                  { name: "Sarah Jenkins", time: "Today, 02:00 PM", type: "Designer" },
                  { name: "Mohammed Ali", time: "Tomorrow, 11:00 AM", type: "Contractor" },
                ].map((booking, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                     <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                        {booking.name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-stone-800">{booking.name}</p>
                        <p className="text-xs text-stone-500">{booking.time} • {booking.type}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2"><Download size={20} className="text-brand-primary" /> Top Catalogues</h3>
              <div className="space-y-3">
                 {[
                   { name: "Vado Master Collection 2024", dls: 142 },
                   { name: "Jaquar Architectural Guide", dls: 98 },
                   { name: "Sanit Technical Manual", dls: 76 }
                 ].map((cat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-stone-600 font-medium truncate pr-4">{cat.name}</span>
                      <span className="text-brand-primary text-xs font-bold">{cat.dls}</span>
                    </div>
                 ))}
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}
