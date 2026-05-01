import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };
  return (
    <div className="sticky top-0 z-50">
      {/* Barra superior (Top Bar) */}
      <div className="bg-primary-500 text-white py-2 text-center text-xs font-medium border-b border-white/10">
        <p className="flex items-center justify-center space-x-2">
          <span>📦 Envíos rápidos a todo el Perú</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-secondary-500">📞 WhatsApp: +51 999 888 777</span>
        </p>
      </div>
      
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/img/logo.jpeg" 
                  alt="Mayja Logo" 
                  className="h-10 w-auto group-hover:scale-105 transition-transform"
                />
              </Link>
            </div>
            
            {/* Buscador central */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-10">
              <form onSubmit={handleSearch} className="relative w-full">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="¿Qué buscas para tu hogar?" 
                  className="w-full pl-4 pr-12 py-2 border-2 border-primary-500 rounded-full focus:outline-none text-sm font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 h-full px-5 bg-primary-500 text-white rounded-r-full hover:bg-primary-600 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* Acciones y Menú simplificado */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-bold text-gray-700 hover:text-secondary-500 transition-colors uppercase tracking-wider">Inicio</Link>
                <Link to="/tienda" className="text-sm font-bold text-gray-700 hover:text-secondary-500 transition-colors uppercase tracking-wider">Tienda</Link>
                <Link to="/contactanos" className="text-sm font-bold text-gray-700 hover:text-secondary-500 transition-colors uppercase tracking-wider">Contáctanos</Link>
              </nav>

              <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                <Link to="/carrito" className="relative text-gray-700 hover:text-secondary-500 transition-colors">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-secondary-500 rounded-full">
                    0
                  </span>
                </Link>
                
                {/* Menú móvil */}
                <button className="md:hidden text-gray-700">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;