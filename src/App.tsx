import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { InquiryProvider } from "./contexts/InquiryContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const Products = lazy(() => import("./pages/Products").then(module => ({ default: module.Products })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Categories = lazy(() => import("./pages/Categories").then(module => ({ default: module.Categories })));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail").then(module => ({ default: module.CategoryDetail })));
const Brands = lazy(() => import("./pages/Brands").then(module => ({ default: module.Brands })));
const BrandDetail = lazy(() => import("./pages/BrandDetail").then(module => ({ default: module.BrandDetail })));
const VadoCollection = lazy(() => import("./pages/VadoCollection").then(module => ({ default: module.VadoCollection })));
const SitemapViewer = lazy(() => import("./pages/SitemapViewer").then(module => ({ default: module.SitemapViewer })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const Blog = lazy(() => import("./pages/Blog").then(module => ({ default: module.Blog })));
const BlogDetail = lazy(() => import("./pages/BlogDetail").then(module => ({ default: module.BlogDetail })));
const Catalogues = lazy(() => import("./pages/Catalogues").then(module => ({ default: module.Catalogues })));
const GenericPage = lazy(() => import("./pages/GenericPage").then(module => ({ default: module.GenericPage })));
const BookShowroom = lazy(() => import("./pages/BookShowroom").then(module => ({ default: module.BookShowroom })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })));
const Inquiry = lazy(() => import("./pages/Inquiry").then(module => ({ default: module.Inquiry })));
const StyleGuide = lazy(() => import("./pages/StyleGuide").then(module => ({ default: module.StyleGuide })));

// Admin Pages
const Login = lazy(() => import("./pages/admin/auth/Login").then(module => ({ default: module.Login })));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const ProductList = lazy(() => import("./pages/admin/products/ProductList").then(module => ({ default: module.ProductList })));
const ProductForm = lazy(() => import("./pages/admin/products/ProductForm").then(module => ({ default: module.ProductForm })));
const ProductImport = lazy(() => import("./pages/admin/products/ProductImport").then(module => ({ default: module.ProductImport })));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands").then(module => ({ default: module.AdminBrands })));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories").then(module => ({ default: module.AdminCategories })));
const AdminSystem = lazy(() => import("./pages/admin/AdminSystem").then(module => ({ default: module.AdminSystem })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then(module => ({ default: module.AdminSettings })));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials").then(module => ({ default: module.AdminTestimonials })));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs").then(module => ({ default: module.AdminBlogs })));
const AdminCatalogues = lazy(() => import("./pages/admin/catalogues/AdminCatalogues").then(module => ({ default: module.AdminCatalogues })));
const AdminCatalogueForm = lazy(() => import("./pages/admin/catalogues/AdminCatalogueForm").then(module => ({ default: module.AdminCatalogueForm })));
const AdminCatalogueImport = lazy(() => import("./pages/admin/catalogues/AdminCatalogueImport").then(module => ({ default: module.AdminCatalogueImport })));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers").then(module => ({ default: module.AdminUsers })));
const AdminGeneric = lazy(() => import("./pages/admin/AdminGeneric").then(module => ({ default: module.AdminGeneric })));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads").then(module => ({ default: module.AdminLeads })));

const AdminProjects = lazy(() => import("./pages/admin/projects/AdminProjects").then(module => ({ default: module.AdminProjects })));
const AdminProjectForm = lazy(() => import("./pages/admin/projects/AdminProjectForm").then(module => ({ default: module.AdminProjectForm })));
const AdminBlogForm = lazy(() => import("./pages/admin/blogs/AdminBlogForm").then(module => ({ default: module.AdminBlogForm })));
const AdminFAQs = lazy(() => import("./pages/admin/AdminFAQs").then(module => ({ default: module.AdminFAQs })));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers").then(module => ({ default: module.AdminCareers })));

const Projects = lazy(() => import("./pages/Projects").then(module => ({ default: module.Projects })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then(module => ({ default: module.ProjectDetail })));
const FAQs = lazy(() => import("./pages/FAQs").then(module => ({ default: module.FAQs })));
const Careers = lazy(() => import("./pages/Careers").then(module => ({ default: module.Careers })));
const ProductFinder = lazy(() => import("./pages/ProductFinder").then(module => ({ default: module.ProductFinder })));
const ProductComparison = lazy(() => import("./pages/ProductComparison").then(module => ({ default: module.ProductComparison })));



const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <InquiryProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* Everyone gets dashboard */}
                <Route index element={<AdminDashboard />} />

                {/* Content Manager + SEO Manager */}
                <Route element={<ProtectedRoute allowedRoles={['content_manager', 'seo_manager']} />}>
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="blogs/add" element={<AdminBlogForm />} />
                  <Route path="blogs/edit/:id" element={<AdminBlogForm />} />
                  <Route path="pages" element={<AdminGeneric />} />
                </Route>

                {/* Content Manager */}
                <Route element={<ProtectedRoute allowedRoles={['content_manager']} />}>
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/add" element={<ProductForm />} />
                  <Route path="products/edit/:id" element={<ProductForm />} />
                  <Route path="products/import" element={<ProductImport />} />
                  <Route path="brands" element={<AdminBrands />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="collections" element={<AdminGeneric />} />
                  <Route path="attributes" element={<AdminGeneric />} />
                  <Route path="applications" element={<AdminGeneric />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="catalogues" element={<AdminCatalogues />} />
                  <Route path="catalogues/add" element={<AdminCatalogueForm />} />
                  <Route path="catalogues/edit/:id" element={<AdminCatalogueForm />} />
                  <Route path="catalogues/import" element={<AdminCatalogueImport />} />
                  <Route path="media" element={<AdminGeneric />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="projects/add" element={<AdminProjectForm />} />
                  <Route path="projects/edit/:id" element={<AdminProjectForm />} />
                  <Route path="gallery" element={<AdminGeneric />} />
                  <Route path="videos" element={<AdminGeneric />} />
                  <Route path="faqs" element={<AdminFAQs />} />
                </Route>

                {/* Sales Manager */}
                <Route element={<ProtectedRoute allowedRoles={['sales_manager']} />}>
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="quotations" element={<AdminGeneric />} />
                  <Route path="bookings" element={<AdminGeneric />} />
                  <Route path="dealers" element={<AdminGeneric />} />
                </Route>

                {/* SEO Manager */}
                <Route element={<ProtectedRoute allowedRoles={['seo_manager']} />}>
                  <Route path="seo" element={<AdminGeneric />} />
                  <Route path="analytics" element={<AdminGeneric />} />
                  <Route path="redirects" element={<AdminGeneric />} />
                </Route>

                {/* Super Admin Only - no allowedRoles passed defaults to super_admin manually or we can pass empty but wait, ProtectedRoute defaults to checking if allowedRoles exists. If we don't pass it, anyone gets in. So we must pass ['super_admin'] */}
                <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="system" element={<AdminSystem />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="team" element={<AdminGeneric />} />
                  <Route path="careers" element={<AdminCareers />} />
                  <Route path="emails" element={<AdminGeneric />} />
                  <Route path="menus" element={<AdminGeneric />} />
                  <Route path="integrations" element={<AdminGeneric />} />
                  <Route path="audit-logs" element={<AdminGeneric />} />
                </Route>

              </Route>
            </Route>
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:brandSlug/:categorySlug/:productSlug" element={<ProductDetail />} />
              {/* Fallback for old routes or generic search */}
              <Route path="products/:productSlug" element={<ProductDetail />} />
              
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:categorySlug" element={<CategoryDetail />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/:brandSlug" element={<BrandDetail />} />
              
              <Route path="vado-collection" element={<VadoCollection />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="careers" element={<Careers />} />
              <Route path="product-finder" element={<ProductFinder />} />
              <Route path="compare" element={<ProductComparison />} />
              <Route path="sitemap" element={<SitemapViewer />} />
              <Route path="contact" element={<Contact />} />
          <Route path="book-showroom" element={<BookShowroom />} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="about" element={<About />} />
              <Route path="catalogues" element={<Catalogues />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="style-guide" element={<StyleGuide />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      </InquiryProvider>
    </AuthProvider>
  );
}
