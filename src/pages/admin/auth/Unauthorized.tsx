import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Access Denied</h1>
      <p className="text-stone-500 max-w-md mb-8">
        You do not have the required permissions to access this module. 
        Please contact your system administrator if you believe this is an error.
      </p>
      <Link to="/admin" className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
}
