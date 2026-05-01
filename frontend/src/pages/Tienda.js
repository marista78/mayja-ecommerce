import React from 'react';
import { Link } from 'react-router-dom';

const Tienda = () => {
  const productos = [
    { 
      id: 1, 
      nombre: "Humidificador Ultrasónico", 
      precio: 89.90, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      etiquetas: ["Nuevo"]
    },
    { 
      id: 2, 
      nombre: "Juguete Pop It Gigante", 
      precio: 45.00, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop", 
      categoria: "Juguetes",
      etiquetas: ["Oferta"]
    },
    { 
      id: 3, 
      nombre: "Audífonos Bluetooth Pro", 
      precio: 129.00, 
      precioOriginal: 159.00, 
      imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", 
      categoria: "Tecnología",
      etiquetas: []
    },
    { 
      id: 4, 
      nombre: "Set de Luces LED Smart", 
      precio: 55.00, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      etiquetas: ["Básicos"]
    },
    { 
      id: 5, 
      nombre: "Pantalón Térmico Invierno", 
      precio: 75.00, 
      precioOriginal: 95.00, 
      imagen: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop", 
      categoria: "Ropa",
      etiquetas: ["Top"]
    },
    { 
      id: 6, 
      nombre: "Lámpara de Escritorio", 
      precio: 65.00, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      etiquetas: []
    },
    { 
      id: 7, 
      nombre: "Kit de Relajación Sensorial", 
      precio: 95.00, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&h=300&fit=crop", 
      categoria: "Juguetes",
      etiquetas: ["Nuevo"]
    },
    { 
      id: 8, 
      nombre: "Cargador Carga Rápida", 
      precio: 39.00, 
      precioOriginal: 49.00, 
      imagen: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop", 
      categoria: "Tecnología",
      etiquetas: ["Oferta"]
    },
    { 
      id: 9, 
      nombre: "Alfombra Antideslizante", 
      precio: 49.00, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      etiquetas: []
    },
    { 
      id: 10, 
      nombre: "Casaca Impermeable", 
      precio: 150.00, 
      precioOriginal: 199.00, 
      imagen: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop", 
      categoria: "Ropa",
      etiquetas: ["Oferta"]
    },
    { 
      id: 11, 
      nombre: "Set de 4 Contenedores Herméticos", 
      precio: 76.00, 
      precioOriginal: 95.00, 
      imagen: "https://images.unsplash.com/photo-1588195030432-7f9e9b334b1a?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      etiquetas: []
    },
    { 
      id: 12, 
      nombre: "Botellas Dispensadoras Verdes", 
      precio: 49.00, 
      precioOriginal: 65.00, 
      imagen: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop", 
      categoria: "Baño",
      etiquetas: ["Nuevo"]
    }
  ];

  const getDescuentoPercentage = (precio, precioOriginal) => {
    if (!precioOriginal || precioOriginal <= precio) return 0;
    return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-primary-500 mb-2 uppercase tracking-tighter">Tienda</h1>
          <div className="h-1 w-20 bg-secondary-500"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map(producto => {
            const descuento = getDescuentoPercentage(producto.precio, producto.precioOriginal);
            return (
              <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Etiquetas */}
                  <div className="flex flex-col absolute top-2 left-2 space-y-2">
                    {producto.etiquetas.map((etiqueta, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-0.5 text-xs font-medium rounded 
                        ${etiqueta === 'Nuevo' ? 'bg-primary-500 text-white' : ''}
                        ${etiqueta === 'Oferta' ? 'bg-red-500 text-white' : ''}
                        ${etiqueta === 'Básicos' || etiqueta === 'Top' ? 'bg-secondary-500 text-white' : ''}
                        `}
                      >
                        {etiqueta}
                      </span>
                    ))}
                    
                    {/* Descuento */}
                    {descuento > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded">
                        -{descuento}%
                      </span>
                    )}
                  </div>
                  
                  {/* Vista rápida (placeholder) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <button className="text-white text-sm font-medium">
                      Vista rápida
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <Link to={`/producto/${producto.id}`} className="block mb-3">
                    <h3 className="font-semibold text-gray-800 hover:text-secondary-500 transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">{producto.categoria}</p>
                  <div className="mb-4">
                    {descuento > 0 ? (
                      <>
                        <p className="line-through text-gray-400">S/ {producto.precioOriginal.toFixed(2)}</p>
                        <p className="text-xl font-bold text-primary-500">S/ {producto.precio.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-primary-500">S/ {producto.precio.toFixed(2)}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => alert(`Producto ${producto.nombre} añadido al carrito`)}
                    className="w-full bg-secondary-500 text-white font-bold py-2 px-4 rounded-full hover:bg-secondary-600 transition-all transform active:scale-95"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tienda;