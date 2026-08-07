import React from 'react';
import { AdminGeneric } from './AdminGeneric';

export function AdminTestimonials() {
  const columns = [
    { key: 'clientName', label: 'Client Name', type: 'text' as const, required: true },
    { key: 'position', label: 'Position', type: 'text' as const }, { key: 'company', label: 'Company', type: 'text' as const },
    { key: 'type', label: 'Customer Type', type: 'select' as const, options: ['Homeowners', 'Interior Designers', 'Architects', 'Contractors', 'Builders', 'Hotels', 'Commercial Projects'] },
    { key: 'text', label: 'Testimonial Text', type: 'text' as const, required: true }, { key: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true }, { key: 'projectRef', label: 'Project Reference', type: 'text' as const },
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
