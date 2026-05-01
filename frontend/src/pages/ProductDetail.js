import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Simulamos obtener el producto por ID (en una app real vendría de una API)
  const productos = [
    { 
      id: 1, 
      nombre: "Humidificador Ultrasónico", 
      precio: 89.90, 
      precioOriginal: null, 
      imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop", 
      categoria: "Hogar",
      descripcion: "Humidificador ultrasónico de última generación que mantiene el ambiente con la humedad perfecta para tu hogar y salud. Tecnología silenciosa y eficiente.",
      especificaciones: [
        "Capacidad: 2.5L",
        "Cobertura: hasta 25m²",
        "Duración: hasta 15 horas continuas",
        "Nivel de ruido: <35dB",
        "Apagado automático cuando está vacío"
      ]
    },
    { 
      id: 2, 
      nombre: "Juguete Pop It Gigante", 
      precio: 45.00, 
      precioOriginal: 65.00, 
      imagen: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop", 
      categoria: "Juguetes",
      descripcion: "Pop It gigante para aliviar el estrés y mejorar la concentración. Ideal para niños y adultos que buscan una actividad sensorial relajante.",
      especificaciones: [
        "Dimensiones: 30cm x 30cm",
        "Material: Silicona de grado alimenticio",
        "Colores: Arcoíris",
        "Peso: 200g",
        "Recomendado: +3 años"
      ]
    },
    { 
      id: 3, 
      nombre: "Audífonos Bluetooth Pro", 
      precio: 129.00, 
      precioOriginal: 159.00, 
      imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", 
      categoria: "Tecnología",
      descripcion: "Audífonos inalámbricos con cancelación de ruido activa, batería de larga duración y calidad de sonido premium para música, llamadas y gaming.",
      especificaciones: [
        "Bluetooth 5.0",
        "Autonomía: 30 horas",
        "Cancelación de ruido activa",
        "Resistencia al agua: IPX5",
        "Micrófono integrado con reducción de ruido"
      ]
    }
  ];
  
  const producto = productos.find(p => p.id === parseInt(id)) || {
    id: 0,
    nombre: "Producto no encontrado",
    precio: 0,
    precioOriginal: null,
    imagen: "https://via.placeholder.com/300x300?texto=Producto+no+encontrado",
    categoria: "N/A",
    descripcion: "Lo sentimos, el producto que buscas no está disponible.",
    especificaciones: []
  };

  const getDescuentoPercentage = (precio, precioOriginal) => {
    if (!precioOriginal || precioOriginal <= precio) return 0;
    return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navegación de migas de pan */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-secondary-500 transition-colors mr-2">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/tienda" className="hover:text-secondary-500 transition-colors mr-2">Tienda</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{producto.nombre}</span>
        </nav>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Imagen del producto */}
            <div className="relative">
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-auto rounded-lg"
              />
              
              {/* Etiquetas */}
              <div className="absolute top-4 left-4 space-y-2">
                {getDescuentoPercentage(producto.precio, producto.precioOriginal) > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded">
                    -{getDescuentoPercentage(producto.precio, producto.precioOriginal)}%
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs font-medium bg-secondary-500 text-white rounded">
                  {producto.categoria}
                </span>
              </div>
            </div>
            
            {/* Información del producto */}
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-primary-500 mb-2">{producto.nombre}</h1>
              
              <div className="space-y-2">
                {getDescuentoPercentage(producto.precio, producto.precioOriginal) > 0 && (
                  <div className="flex items-baseline space-x-3">
                    <p className="line-through text-gray-400 text-lg">S/ {producto.precioOriginal.toFixed(2)}</p>
                    <p className="text-2xl font-bold text-primary-500">S/ {producto.precio.toFixed(2)}</p>
                  </div>
                )}
                {!getDescuentoPercentage(producto.precio, producto.precioOriginal) > 0 && (
                  <p className="text-2xl font-bold text-primary-500">S/ {producto.precio.toFixed(2)}</p>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {producto.descripcion}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Especificaciones técnicas</h3>
                <ul className="space-y-2 text-gray-700 list-disc pl-5">
                  {producto.especificaciones.map((espec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 mr-2">•</span>
                      <span>{espec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => alert(`Producto ${producto.nombre} añadido al carrito`)}
                  className="flex-1 bg-secondary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-secondary-600 transition-all transform active:scale-95"
                >
                  Añadir al carrito
                </button>
                
                <button 
                  className="flex-1 bg-white text-secondary-500 border border-secondary-500 font-bold py-3 px-6 rounded-full hover:bg-secondary-500/50 transition-colors"
                >
                  Comprar ahora
                </button>
              </div>
              
              {/* Botón de WhatsApp flotante (lo moveremos al layout principal) */}
              <div className="mt-6">
                <a 
                  href="https://wa.me/51999888777" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#25D366] text-white py-3 px-6 rounded-full text-center font-bold hover:bg-[#228b55] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;