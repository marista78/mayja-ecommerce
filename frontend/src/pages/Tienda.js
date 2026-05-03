import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API_URL from '../apiConfig';

const Tienda = () => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Error al conectar con la API');
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ['Todos', 'Hogar', 'Sensorial', 'Tecnología', 'Ropa'];

  // Resetear categoría si hay una búsqueda nueva desde fuera
  useEffect(() => {
    if (searchQuery) {
      setCategoriaActiva('Todos');
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 font-bold">Error: {error}</div>
      </div>
    );
  }

  const productosFiltrados = productos.filter(p => {
    const matchesCategory = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDescuentoPercentage = (precio, precioOriginal) => {
    if (!precioOriginal || precioOriginal <= precio) return 0;
    return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-primary-500 mb-2 uppercase tracking-tighter">Nuestra Tienda</h1>
          <div className="h-1 w-20 bg-secondary-500 mx-auto mb-8"></div>
          
          {/* Barra de Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                ${categoriaActiva === cat 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="mb-8 flex items-center justify-center space-x-2">
              <span className="text-gray-500 text-sm">Resultados para:</span>
              <span className="bg-secondary-100 text-secondary-500 px-3 py-1 rounded-full text-sm font-bold">"{searchQuery}"</span>
              <Link to="/tienda" className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          )}
        </div>
        
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map(producto => {
              const descuento = getDescuentoPercentage(producto.precio, producto.precio_original);
              return (
                <div key={producto.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={producto.imagenes[0]} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Etiquetas */}
                    <div className="flex flex-col absolute top-3 left-3 space-y-2 z-10">
                      {producto.badge && (
                        <span 
                          className={`px-3 py-1 text-[10px] font-bold rounded-sm tracking-widest
                          ${producto.badge === 'NUEVO' ? 'bg-primary-500 text-white' : ''}
                          ${producto.badge === 'OFERTA' || producto.badge === 'HOT SALE' ? 'bg-red-600 text-white' : ''}
                          ${producto.badge === 'TOP' ? 'bg-secondary-500 text-white' : ''}
                          `}
                        >
                          {producto.badge}
                        </span>
                      )}
                      
                      {/* Descuento */}
                      {descuento > 0 && (
                        <span className="px-3 py-1 text-[10px] font-bold bg-primary-500 text-white rounded-sm tracking-widest">
                          -{descuento}%
                        </span>
                      )}
                    </div>
                    
                    {/* Vista rápida Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Link 
                        to={`/producto/${producto.id}`}
                        className="bg-white text-primary-500 px-6 py-2.5 rounded-full text-xs font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-500 hover:text-white"
                      >
                        VER PRODUCTO
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col text-center">
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold">{producto.categoria}</p>
                    
                    <Link to={`/producto/${producto.id}`} className="block mb-3 flex-grow">
                      <h3 className="font-bold text-gray-800 hover:text-secondary-500 transition-colors line-clamp-2 text-sm uppercase tracking-tight">
                        {producto.nombre}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-col items-center mb-6">
                    <span className="text-2xl font-black text-secondary-500">S/ {Number(producto.precio).toFixed(2)}</span>
                    {producto.precio_original && (
                      <span className="text-xs text-gray-400 line-through">S/ {Number(producto.precio_original).toFixed(2)}</span>
                    )}
                  </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(producto);
                      }}
                      className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded hover:bg-primary-600 transition-all transform active:scale-95 text-[10px] tracking-[0.2em] uppercase"
                    >
                      AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-6">
              No encontramos resultados para <span className="font-bold">"{searchQuery || categoriaActiva}"</span>
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/tienda"
                className="bg-primary-500 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-600 transition-all"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tienda;