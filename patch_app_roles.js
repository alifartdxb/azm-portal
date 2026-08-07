import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldRoutes = `<Route element={<ProtectedRoute />}>
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
            <Route path="settings" element={<AdminSettings />} />
            <Route path="system" element={<AdminSystem />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="collections" element={<AdminGeneric />} />
                <Route path="attributes" element={<AdminGeneric />} />
                <Route path="applications" element={<AdminGeneric />} />
                <Route path="pages" element={<AdminGeneric />} />
                <Route path="projects" element={<AdminGeneric />} />
                <Route path="gallery" element={<AdminGeneric />} />
                <Route path="videos" element={<AdminGeneric />} />
                <Route path="faqs" element={<AdminGeneric />} />
                <Route path="quotations" element={<AdminGeneric />} />
                <Route path="bookings" element={<AdminGeneric />} />
                <Route path="dealers" element={<AdminGeneric />} />
                <Route path="team" element={<AdminGeneric />} />
                <Route path="careers" element={<AdminGeneric />} />
                <Route path="analytics" element={<AdminGeneric />} />
                <Route path="redirects" element={<AdminGeneric />} />
                <Route path="emails" element={<AdminGeneric />} />
                <Route path="menus" element={<AdminGeneric />} />
                <Route path="integrations" element={<AdminGeneric />} />
                <Route path="audit-logs" element={<AdminGeneric />} />
              </Route>
            </Route>`;

const newRoutes = `<Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* Everyone gets dashboard */}
                <Route index element={<AdminDashboard />} />

                {/* Content Manager + SEO Manager */}
                <Route element={<ProtectedRoute allowedRoles={['content_manager', 'seo_manager']} />}>
                  <Route path="blogs" element={<AdminBlogs />} />
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
                  <Route path="projects" element={<AdminGeneric />} />
                  <Route path="gallery" element={<AdminGeneric />} />
                  <Route path="videos" element={<AdminGeneric />} />
                  <Route path="faqs" element={<AdminGeneric />} />
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
                  <Route path="careers" element={<AdminGeneric />} />
                  <Route path="emails" element={<AdminGeneric />} />
                  <Route path="menus" element={<AdminGeneric />} />
                  <Route path="integrations" element={<AdminGeneric />} />
                  <Route path="audit-logs" element={<AdminGeneric />} />
                </Route>

              </Route>
            </Route>`;

content = content.replace(oldRoutes, newRoutes);
fs.writeFileSync('src/App.tsx', content);
