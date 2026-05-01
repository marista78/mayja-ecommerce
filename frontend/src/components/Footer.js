import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Logo e Info */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-6">
              <img 
                src="/img/logo.jpeg" 
                alt="Mayja Logo" 
                className="h-14 w-auto block" 
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Productos exclusivos para tu hogar, tecnología y más. Calidad garantizada en cada compra.
            </p>
          </div>
          
          {/* Columna 2: Menú Rápido */}
          <div>
            <h4 className="text-secondary-500 font-bold mb-6 uppercase tracking-widest text-sm">Navegación</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-secondary-500 transition-colors">Inicio</Link></li>
              <li><Link to="/tienda" className="hover:text-secondary-500 transition-colors">Tienda</Link></li>
              <li><Link to="/contactanos" className="hover:text-secondary-500 transition-colors">Contáctanos</Link></li>
            </ul>
          </div>
          
          {/* Columna 3: Información */}
          <div>
            <h4 className="text-secondary-500 font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-secondary-500 transition-colors text-gray-300">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-secondary-500 transition-colors text-gray-300">Políticas de Privacidad</a></li>
              <li><a href="#" className="hover:text-secondary-500 transition-colors text-gray-300">Libro de Reclamaciones</a></li>
            </ul>
          </div>
          
          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-secondary-500 font-bold mb-6 uppercase tracking-widest text-sm">Contacto</h4>
            <div className="space-y-4 text-sm">
              <p className="flex items-center text-gray-300">
                <span className="text-secondary-500 mr-2">📞</span> +51 999 888 777
              </p>
              <p className="flex items-center text-gray-300">
                <span className="text-secondary-500 mr-2">✉️</span> ventas@mayja.com
              </p>
              <p className="flex items-center text-gray-300">
                <span className="text-secondary-500 mr-2">📍</span> Lima, Perú
              </p>
            </div>
          </div>
        </div>
        
        {/* Barra inferior: Pagos */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 mb-6 md:mb-0">&copy; {new Date().getFullYear()} MAYJA. Todos los derechos reservados.</p>
          
          <div className="flex flex-col items-center md:items-end space-y-3">
            <span className="text-secondary-500 font-bold tracking-widest uppercase">Pagos 100% Seguros</span>
            <div className="flex items-center">
              <img src="/img/pagos.png" alt="Métodos de Pago" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;