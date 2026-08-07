import React from 'react';
import { AdminGeneric } from './AdminGeneric';

export function AdminTestimonials() {
  const columns = [
    { key: 'author', label: 'Author', type: 'text' as const, required: true },
    { key: 'role', label: 'Role/Company', type: 'text' as const, required: true },
    { key: 'type', label: 'Customer Type', type: 'select' as const, options: ['Homeowners', 'Interior Designers', 'Architects', 'Contractors', 'Builders', 'Hotels', 'Commercial Projects'] },
    { key: 'quote', label: 'Review', type: 'text' as const, required: true },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Published', 'Draft'] }
  ];

  return (
    <AdminGeneric 
      collectionName="testimonials" 
      title="Testimonials Management" 
      description="Manage client endorsements and reviews."
      columns={columns}
    />
  );
}
