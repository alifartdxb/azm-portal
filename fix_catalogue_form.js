import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/catalogues/AdminCatalogueForm.tsx', 'utf8');

// Add visibility field
if (!content.includes('visibility:')) {
  content = content.replace("category: '',", "category: 'Catalogue',\n    visibility: 'Public',");
  content = content.replace("brand: '', category: '',", "brand: '', category: 'Catalogue', visibility: 'Public',");
}

let formAdd = `
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2">Visibility & Access</h3>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Visibility Status</label>
                  <select name="visibility" value={formData.visibility || 'Public'} onChange={handleChange} className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-primary">
                    <option value="Public">Public</option>
                    <option value="Lead-gated">Lead-gated</option>
                    <option value="Admin-only">Admin-only</option>
                    <option value="Unpublished">Unpublished</option>
                  </select>
                </div>
              </div>
`;

content = content.replace(
  '{/* Right Column */}',
  '{/* Right Column */}\n' + formAdd
);

content = content.replace(
  '<input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-primary" placeholder="e.g. Bathroom Faucets" />',
  '<select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-primary"><option value="Catalogue">Catalogue</option><option value="Data Sheet">Data Sheet</option><option value="Manual">Installation Manual</option><option value="Brochure">Brochure</option><option value="Price List">Price List</option></select>'
);

fs.writeFileSync('src/pages/admin/catalogues/AdminCatalogueForm.tsx', content);

let catalogueList = fs.readFileSync('src/pages/admin/catalogues/AdminCatalogues.tsx', 'utf8');
catalogueList = catalogueList.replace(
  'catalogue.year && <span>{catalogue.year}</span>',
  'catalogue.year && <span>{catalogue.year}</span>} {catalogue.visibility && <><span className="w-1 h-1 bg-stone-300 rounded-full" /><span>{catalogue.visibility}</span></>'
);
fs.writeFileSync('src/pages/admin/catalogues/AdminCatalogues.tsx', catalogueList);
