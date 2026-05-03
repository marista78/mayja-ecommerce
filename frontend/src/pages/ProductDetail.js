import API_URL from '../apiConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  
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

  const producto = productos.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setCantidad(1);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link to="/tienda" className="text-secondary-500 font-bold hover:underline">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  const getDescuentoPercentage = (precio, precioOriginal) => {
    if (!precioOriginal || precioOriginal <= precio) return 0;
    return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  };

  const descuento = getDescuentoPercentage(producto.precio, producto.precio_original);

  // Productos relacionados (misma categoría)
  const relacionados = productos
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
          <Link to="/" className="hover:text-secondary-500 transition-colors">Inicio</Link>
          <span className="mx-3 text-gray-300">/</span>
          <Link to="/tienda" className="hover:text-secondary-500 transition-colors">Tienda</Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-primary-500">{producto.nombre}</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Columna Izquierda: Galería (Lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 group">
              {activeImg < (producto.imagenes || []).length ? (
                <img 
                  src={(producto.imagenes || [])[activeImg]} 
                  alt={producto.nombre} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
              ) : (
                <video 
                  src={producto.video_url} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                />
              )}
              {producto.badge && (
                <div className="absolute top-6 left-6 bg-slate-900 text-white px-4 py-1.5 text-[10px] font-black tracking-[0.2em] rounded-full uppercase shadow-xl">
                  {producto.badge}
                </div>
              )}
              {/* Botones de navegación sobre la imagen */}
              {((producto.imagenes || []).length + (producto.video_url ? 1 : 0)) > 1 && (
                <>
                  <button 
                    onClick={() => {
                      const totalItems = producto.imagenes.length + (producto.video_url ? 1 : 0);
                      setActiveImg(activeImg === 0 ? totalItems - 1 : activeImg - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all text-slate-800 hover:bg-white"
                  >←</button>
                  <button 
                    onClick={() => {
                      const totalItems = (producto.imagenes || []).length + (producto.video_url ? 1 : 0);
                      setActiveImg(activeImg === totalItems - 1 ? 0 : activeImg + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all text-slate-800 hover:bg-white"
                  >→</button>
                </>
              )}
            </div>
            
            {((producto.imagenes || []).length > 1 || producto.video_url) && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {(producto.imagenes || []).map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImg(index)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300
                      ${activeImg === index ? 'border-slate-900 scale-95 shadow-md' : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Miniatura ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {producto.video_url && (
                  <button 
                    onClick={() => setActiveImg((producto.imagenes || []).length)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-slate-100 flex flex-col items-center justify-center
                      ${activeImg === (producto.imagenes || []).length ? 'border-slate-900 scale-95 shadow-md' : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'}`}
                  >
                    <span className="text-2xl mb-1">📹</span>
                    <span className="text-[10px] font-bold uppercase">Video</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Columna Derecha: Info (Lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col pt-2">

            <div className="border-b border-gray-100 pb-6 mb-6">
              <p className="text-secondary-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">{producto.subcategoria || producto.categoria}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-primary-500 mb-2 leading-tight tracking-tighter uppercase">{producto.nombre}</h1>
              {producto.concepto && (
                <p className="text-gray-500 text-sm italic mb-4">{producto.concepto}</p>
              )}
              
              <div className="flex items-center space-x-4 mb-6">
                {descuento > 0 ? (
                  <>
                    <span className="text-3xl font-black text-secondary-500 tracking-tighter">S/ {Number(producto.precio).toFixed(2)}</span>
                    <span className="text-xl text-gray-300 line-through">S/ {Number(producto.precio_original).toFixed(2)}</span>
                    <span className="bg-primary-500 text-white px-2 py-1 text-[10px] font-bold rounded-sm">-{descuento}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-secondary-500 tracking-tighter">S/ {Number(producto.precio).toFixed(2)}</span>
                )}
              </div>

            </div>
            
            {/* Acciones de Compra */}
            <div className="space-y-6 pb-8 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-100 rounded-full h-12 px-2 bg-white">
                  <button 
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    className="w-12 text-center font-bold text-primary-500 focus:outline-none"
                  />
                  <button 
                    onClick={() => setCantidad(cantidad + 1)}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
                  >+</button>
                </div>
                
                <button 
                  onClick={() => addToCart(producto, cantidad)}
                  className="flex-grow bg-primary-500 text-white font-bold h-12 rounded-full uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-lg active:scale-95"
                >
                  Agregar al carrito
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(producto, cantidad)}
                  className="flex-1 bg-secondary-500 text-white font-bold h-12 rounded-full uppercase tracking-widest text-xs hover:bg-secondary-600 transition-all shadow-md active:scale-95"
                >
                  Comprar ahora
                </button>
                <a 
                  href={`https://wa.me/51999888777?text=Hola, estoy interesado en el producto: ${producto.nombre}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 border-2 border-[#25D366] text-[#25D366] font-bold h-12 rounded-full uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#25D366]/5 transition-all"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Consultar WhatsApp
                </a>
              </div>
            </div>
            
            {/* Tabs / Accordions */}
            <div className="py-6 border-b border-gray-100">
              <div className="flex space-x-8 mb-6 border-b border-gray-100 pb-px">
                <button 
                  onClick={() => setActiveTab('descripcion')}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative
                  ${activeTab === 'descripcion' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Descripción
                  {activeTab === 'descripcion' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-500"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('envio')}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative
                  ${activeTab === 'envio' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Condiciones y tiempos de envío
                  {activeTab === 'envio' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-500"></div>}
                </button>
              </div>
              
              <div className="text-gray-600 text-sm leading-relaxed min-h-[100px]">
                {activeTab === 'descripcion' && (
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {(producto.descripcion || '').split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 pb-1">
                          <span className="text-secondary-500 font-bold mt-0.5 flex-shrink-0">•</span>
                          <span>{line.trim()}</span>
                        </li>
                      ))}
                    </ul>
                    {(producto.detalles || []).length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                        {(producto.detalles || []).map((detalle, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600 border-b border-gray-50 pb-2">
                            <span className="text-secondary-500 font-bold">•</span>
                            <span>{detalle}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {activeTab === 'envio' && (
                  <div className="bg-gray-50 p-6 rounded-md">
                    <p className="whitespace-pre-line text-gray-600 italic">
                      {producto.envio || `Los plazos de entrega se contabilizan desde que verificamos el pago de tu compra.

Lima: Dentro de los 2 días hábiles siguientes.

Distritos de reparto: Todo Lima Metropolitana.

Provincia: Dentro de los 4 días hábiles siguientes. Llegamos a todo el territorio peruano donde existan puntos de entrega de Olva Courier.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="py-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Paga seguro con:</p>
              <div className="flex items-center gap-4 opacity-40">
                <img src="/img/pagos.png" alt="Pagos" className="h-6 w-auto grayscale" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Productos Relacionados */}
        {relacionados.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-black text-primary-500 mb-10 uppercase tracking-tighter text-center">También te puede interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relacionados.map(p => (
                <Link key={p.id} to={`/producto/${p.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-50">
                    <div className="aspect-square overflow-hidden">
                      <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1 uppercase group-hover:text-secondary-500 transition-colors">{p.nombre}</h3>
                  <p className="text-secondary-500 font-black text-sm">S/ {Number(p.precio).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;