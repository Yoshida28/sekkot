import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, FileUp, Mail } from 'lucide-react';

const FloatingNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-purple-600' : 'bg-gray-900 hover:bg-purple-800';
  };

  const openMailto = () => {
    window.location.href = 'mailto:sekkot_engineering@yahoo.com';
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col gap-4 p-4 bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-900">
        <Link 
          to="/"
          className={`${isActive('/')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
        >
          <Home size={20} />
          <span className="hidden group-hover:block">Home</span>
        </Link>
        
        <Link 
          to="/products"
          className={`${isActive('/products')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
        >
          <Package size={20} />
          <span className="hidden group-hover:block">Products</span>
        </Link>
        
        <Link 
          to="/submit-requirement"
          className={`${isActive('/submit-requirement')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
        >
          <FileUp size={20} />
          <span className="hidden group-hover:block">Submit</span>
        </Link>
        
        <button
          onClick={openMailto}
          className="bg-gray-900 hover:bg-purple-800 p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2"
        >
          <Mail size={20} />
          <span className="hidden group-hover:block">Contact</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingNavbar;