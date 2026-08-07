import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
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
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })));
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
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials").then(module => ({ default: module.AdminTestimonials })));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs").then(module => ({ default: module.AdminBlogs })));
const AdminCatalogues = lazy(() => import("./pages/admin/catalogues/AdminCatalogues").then(module => ({ default: module.AdminCatalogues })));
const AdminCatalogueForm = lazy(() => import("./pages/admin/catalogues/AdminCatalogueForm").then(module => ({ default: module.AdminCatalogueForm })));
const AdminCatalogueImport = lazy(() => import("./pages/admin/catalogues/AdminCatalogueImport").then(module => ({ default: module.AdminCatalogueImport })));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers").then(module => ({ default: module.AdminUsers })));
const AdminGeneric = lazy(() => import("./pages/admin/AdminGeneric").then(module => ({ default: module.AdminGeneric })));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads").then(module => ({ default: module.AdminLeads })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="products/import" element={<ProductImport />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="catalogues" element={<AdminCatalogues />} />
                <Route path="catalogues/add" element={<AdminCatalogueForm />} />
                <Route path="catalogues/edit/:id" element={<AdminCatalogueForm />} />
                <Route path="catalogues/import" element={<AdminCatalogueImport />} />
                <Route path="media" element={<AdminGeneric />} />
                <Route path="seo" element={<AdminGeneric />} />
                <Route path="leads" element={<AdminLeads />} />
            <Route path="system" element={<AdminSystem />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:brandSlug/:categorySlug/:productSlug" element={<ProductDetail />} />
              {/* Fallback for old routes or generic search */}
              <Route path="products/:sku" element={<ProductDetail />} />
              
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:categorySlug" element={<CategoryDetail />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/:brandSlug" element={<BrandDetail />} />
              
              <Route path="vado-collection" element={<VadoCollection />} />
              <Route path="sitemap" element={<SitemapViewer />} />
              <Route path="contact" element={<Contact />} />
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
    </AuthProvider>
  );
}
