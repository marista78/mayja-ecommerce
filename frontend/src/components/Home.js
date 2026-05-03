import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API_URL from '../apiConfig';

const Home = () => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const featuredProducts = productos.slice(0, 4);

  return (
    <div className="bg-gray-50 pb-8 font-sans">
      {/* Hero Section */}
      <section className="relative bg-primary-500 h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transforma tu Hogar con lo Mejor de <span className="text-secondary-500">MAYJA</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Encuentra productos exclusivos con la mejor calidad y precios increíbles. Envíos a todo Lima.
            </p>
            <button className="bg-secondary-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-secondary-600 transition-all transform hover:scale-105 shadow-lg">
              Ver Colección
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Hogar', icon: '🏠' },
            { name: 'Sensorial', icon: '🧠' },
            { name: 'Tecnología', icon: '💻' },
            { name: 'Ropa', icon: '👕' }
          ].map((cat) => (
            <div key={cat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-secondary-500 transition-colors text-2xl">
                {cat.icon}
              </div>
              <span className="font-bold text-gray-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary-500">Nuestros Destacados</h2>
            <div className="h-1 w-20 bg-secondary-500 mt-2"></div>
          </div>
          <Link to="/tienda" className="text-secondary-500 font-bold hover:underline">Ver todos &rarr;</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Link to={`/producto/${product.id}`}>
                  <img 
                    src={product.imagenes[0]} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white shadow-sm ${
                    product.badge === 'OFERTA' || product.badge === 'HOT SALE' ? 'bg-red-500' : 'bg-secondary-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
                <Link 
                  to={`/producto/${product.id}`}
                  className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md text-primary-500 hover:bg-secondary-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>
              </div>
              <div className="p-4 flex flex-col flex-grow text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">{product.categoria}</span>
                <Link to={`/producto/${product.id}`}>
                  <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 hover:text-secondary-500 transition-colors leading-snug">
                    {product.nombre}
                  </h3>
                </Link>
                <div className="mt-auto pt-4">
                  <p className="text-lg font-extrabold text-secondary-500 mb-3">S/ {Number(product.precio).toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-primary-500 text-white font-bold py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-md"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Sections */}
      <section className="bg-white py-10 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-3xl mb-3">🚚</div>
              <h4 className="text-lg font-bold text-primary-500 mb-1">Envios</h4>
              <p className="text-gray-500 text-sm">Envios en 24-48h en Lima</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="text-lg font-bold text-primary-500 mb-1">Compra Segura</h4>
              <p className="text-gray-500 text-sm">Protegemos tus datos, compra confiable.</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="text-lg font-bold text-primary-500 mb-1">Entrega confiable</h4>
              <p className="text-gray-500 text-sm">Logistica segura y confiable</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/51999888777" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          ¿Necesitas ayuda? ¡Escríbenos!
        </span>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
};

export default Home;