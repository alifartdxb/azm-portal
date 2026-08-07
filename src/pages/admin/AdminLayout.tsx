import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  FolderTree, 
  Briefcase, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  BookOpen, 
  Users, 
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Upload
} from "lucide-react";

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Brands", href: "/admin/brands", icon: Tags },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "SEO Manager", href: "/admin/seo", icon: Search },
    { name: "Catalogues", href: "/admin/catalogues", icon: BookOpen },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Users & Roles", href: "/admin/users", icon: Users },
    { name: "System Tools", href: "/admin/system", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-stone-100 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-stone-900 text-stone-300">
        <div className="flex items-center justify-center h-16 bg-stone-950 border-b border-stone-800">
          <span className="text-white font-bold text-lg tracking-wider uppercase">AZM Admin</span>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-xs font-light tracking-wide text-stone-500 uppercase">Modules</div>
              </div>
            </li>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 ${
                      isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                    }`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <Icon size={18} />
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-stone-800 p-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-400 hover:text-white text-sm w-full text-left">
            <LogOut size={16} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-stone-900 text-stone-300 h-full">
            <div className="flex items-center justify-between h-16 bg-stone-950 px-4">
              <span className="text-white font-bold text-lg tracking-wider uppercase">AZM Admin</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-grow">
              <ul className="flex flex-col py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 ${
                          isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                        }`}
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          <Icon size={18} />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-stone-500 focus:outline-none md:hidden mr-4"
            >
              <Menu size={24} />
            </button>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
              <input
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-primary bg-stone-50 text-sm"
                type="text"
                placeholder="Global search..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-stone-400 hover:text-stone-600">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-brand-secondary text-white flex items-center justify-center text-xs font-bold uppercase">
                {user?.email?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-stone-800 truncate max-w-[150px]">{user?.email || 'Admin User'}</p>
                <p className="text-xs text-stone-500 capitalize">{role || 'User'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
