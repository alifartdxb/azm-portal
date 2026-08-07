import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

const newNav = `  const navigationGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard }
      ]
    },
    {
      title: "Catalog",
      items: [
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Categories", href: "/admin/categories", icon: FolderTree },
        { name: "Brands", href: "/admin/brands", icon: Tags },
        { name: "Collections", href: "/admin/collections", icon: Package },
        { name: "Attributes", href: "/admin/attributes", icon: Settings },
        { name: "Applications", href: "/admin/applications", icon: Package },
      ]
    },
    {
      title: "Content",
      items: [
        { name: "Pages", href: "/admin/pages", icon: FileText },
        { name: "Blogs", href: "/admin/blogs", icon: FileText },
        { name: "Projects", href: "/admin/projects", icon: Briefcase },
        { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
        { name: "Videos", href: "/admin/videos", icon: ImageIcon },
        { name: "Testimonials", href: "/admin/testimonials", icon: Users },
        { name: "FAQs", href: "/admin/faqs", icon: FileText },
        { name: "Downloads", href: "/admin/catalogues", icon: BookOpen },
      ]
    },
    {
      title: "Sales & Leads",
      items: [
        { name: "Leads", href: "/admin/leads", icon: Users },
        { name: "Quotation Requests", href: "/admin/quotations", icon: FileText },
        { name: "Showroom Bookings", href: "/admin/bookings", icon: Users },
        { name: "Dealers", href: "/admin/dealers", icon: Users },
      ]
    },
    {
      title: "Company",
      items: [
        { name: "Team", href: "/admin/team", icon: Users },
        { name: "Careers", href: "/admin/careers", icon: Briefcase },
      ]
    },
    {
      title: "Marketing & SEO",
      items: [
        { name: "SEO", href: "/admin/seo", icon: Search },
        { name: "Search Analytics", href: "/admin/analytics", icon: Search },
        { name: "Redirects", href: "/admin/redirects", icon: Search },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Media Library", href: "/admin/media", icon: ImageIcon },
        { name: "Users and Roles", href: "/admin/users", icon: Users },
        { name: "Email Templates", href: "/admin/emails", icon: FileText },
        { name: "Website Settings", href: "/admin/settings", icon: Settings },
        { name: "Menus", href: "/admin/menus", icon: Menu },
        { name: "Integrations", href: "/admin/integrations", icon: Settings },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
        { name: "Backup Tools", href: "/admin/system", icon: Settings },
      ]
    }
  ];`;

// Replace old navigation array
content = content.replace(/const navigation = \[[\s\S]*?\];/, newNav);

// Now replace the mapping part in both Desktop and Mobile
const oldMapping = `{navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={\`relative flex flex-row items-center h-11 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 \${
                      isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                    }\`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <Icon size={18} />
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}`;

const newMapping = `{navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="mb-4">
                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">{group.title}</div>
                  </div>
                </li>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={\`relative flex flex-row items-center h-10 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 \${
                          isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                        }\`}
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          <Icon size={16} />
                        </span>
                        <span className="ml-2 text-[13px] tracking-wide truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </div>
            ))}`;

content = content.replace(oldMapping, newMapping); // Replace first occurrence (desktop)

// Replace mobile mapping which has onClick handler
const oldMobileMapping = `{navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={\`relative flex flex-row items-center h-11 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 \${
                          isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                        }\`}
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          <Icon size={18} />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}`;

const newMobileMapping = `{navigationGroups.map((group, gIdx) => (
                  <div key={gIdx} className="mb-4">
                    <li className="px-5">
                      <div className="flex flex-row items-center h-8">
                        <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">{group.title}</div>
                      </div>
                    </li>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={\`relative flex flex-row items-center h-10 focus:outline-none hover:bg-stone-800 text-stone-300 hover:text-white border-l-4 border-transparent hover:border-brand-primary pr-6 \${
                              isActive ? "bg-stone-800 text-white border-brand-primary" : ""
                            }\`}
                          >
                            <span className="inline-flex justify-center items-center ml-4">
                              <Icon size={16} />
                            </span>
                            <span className="ml-2 text-[13px] tracking-wide truncate">{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </div>
                ))}`;

content = content.replace(oldMobileMapping, newMobileMapping);

// Remove duplicate Modules header from desktop
content = content.replace(`<li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-xs font-light tracking-wide text-stone-500 uppercase">Modules</div>
              </div>
            </li>`, '');

fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);
