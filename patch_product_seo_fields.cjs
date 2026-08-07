const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/products/ProductForm.tsx', 'utf8');

const additionalFields = `
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Canonical URL</label>
                      <input type="text" name="canonicalUrl" value={formData.canonicalUrl || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="https://www.azmgroup.ae/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Schema Type</label>
                      <select name="schemaType" value={formData.schemaType || 'Product'} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary">
                        <option value="Product">Product</option>
                        <option value="Article">Article</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Title</label>
                      <input type="text" name="ogTitle" value={formData.ogTitle || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Image URL</label>
                      <input type="text" name="ogImage" value={formData.ogImage || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Description</label>
                      <textarea name="ogDescription" value={formData.ogDescription || ''} onChange={handleChange} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="index" checked={formData.index !== false} onChange={(e) => setFormData({...formData, index: e.target.checked})} className="rounded text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm font-bold text-stone-700">Index</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="follow" checked={formData.follow !== false} onChange={(e) => setFormData({...formData, follow: e.target.checked})} className="rounded text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm font-bold text-stone-700">Follow</span>
                      </label>
                    </div>
                  </div>
`;

code = code.replace(
  '                  <div>\n                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Meta Description</label>', 
  additionalFields + '                  <div>\n                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Meta Description</label>'
);

fs.writeFileSync('src/pages/admin/products/ProductForm.tsx', code);
