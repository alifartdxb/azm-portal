import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Package, Eye } from 'lucide-react';

const data = [
  { name: 'Jan', inquiries: 4000, views: 2400 },
  { name: 'Feb', inquiries: 3000, views: 1398 },
  { name: 'Mar', inquiries: 2000, views: 9800 },
  { name: 'Apr', inquiries: 2780, views: 3908 },
  { name: 'May', inquiries: 1890, views: 4800 },
  { name: 'Jun', inquiries: 2390, views: 3800 },
  { name: 'Jul', inquiries: 3490, views: 4300 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Leads", value: "2,543", change: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Product Views", value: "45.2K", change: "+5.2%", icon: Eye, color: "text-green-600", bg: "bg-green-100" },
          { title: "Catalog Downloads", value: "1,203", change: "+2.1%", icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Active Products", value: "854", change: "0%", icon: Package, color: "text-orange-600", bg: "bg-orange-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-stone-500'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-stone-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-stone-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Traffic & Inquiries Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Recent Leads</h3>
          <div className="space-y-4">
            {[
              { name: "Ahmed Mansi", company: "Al Futtaim", type: "Project Inquiry", time: "2h ago" },
              { name: "Sarah Jenkins", company: "Jumeirah Group", type: "Quotation", time: "5h ago" },
              { name: "Mohammed Ali", company: "Emaar", type: "Showroom Visit", time: "1d ago" },
              { name: "David Chen", company: "Independent Architect", type: "Catalog DL", time: "1d ago" },
              { name: "Fatima Al Maktoum", company: "Private Client", type: "WhatsApp", time: "2d ago" },
            ].map((lead, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{lead.name}</p>
                  <p className="text-xs text-stone-500">{lead.company}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded">
                    {lead.type}
                  </span>
                  <p className="text-xs text-stone-400 mt-1">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors">
            View All Leads
          </button>
        </div>
      </div>
    </div>
  );
}
