import React, { useEffect, useState } from 'react';
import API_URL from '../apiConfig';

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    precio_original: '',
    descripcion: '',
    categoria: '',
    stock: 0,
    badge: '',
    imagenes: [],
    video_url: null,
    concepto: ''
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
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

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        imagenes: product.imagenes || []
      });
      setPreviews(product.imagenes || []);
      setVideoPreview(product.video_url || null);
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '', precio: '', precio_original: '', descripcion: '',
        categoria: '', stock: 0, badge: '', imagenes: [], video_url: null,
        concepto: ''
      });
      setPreviews([]);
      setVideoPreview(null);
    }
    setSelectedFiles([]);
    setSelectedVideo(null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > 5) {
      alert('Solo puedes subir un máximo de 5 imágenes en total.');
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...files]);
    
    // Generar previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    // Si es una imagen existente (URL), actualizar formData
    const newExistingImages = [...(formData.imagenes || [])];
    const removedImg = previews[index];
    
    if (typeof removedImg === 'string' && removedImg.startsWith('http')) {
      const existingIdx = newExistingImages.indexOf(removedImg);
      if (existingIdx > -1) {
        newExistingImages.splice(existingIdx, 1);
        setFormData({ ...formData, imagenes: newExistingImages });
      }
    } else {
      // Si es un archivo nuevo, quitarlo de selectedFiles
      // Nota: Esto es simplificado, en un caso real tendríamos que rastrear qué preview corresponde a qué archivo
      const fileIndex = index - (formData.imagenes?.length || 0);
      if (fileIndex >= 0) {
        const newFiles = [...selectedFiles];
        newFiles.splice(fileIndex, 1);
        setSelectedFiles(newFiles);
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setFormData({ ...formData, video_url: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('concepto', formData.concepto || '');
    data.append('precio', formData.precio);
    data.append('precio_original', formData.precio_original);
    data.append('categoria', formData.categoria);
    data.append('stock', formData.stock);
    data.append('descripcion', formData.descripcion);
    data.append('badge', formData.badge);
    
    // Imágenes existentes que se mantienen
    const existingImages = previews.filter(p => typeof p === 'string' && p.startsWith('http'));
    data.append('imagenesExistentes', JSON.stringify(existingImages));

    // Archivos nuevos
    selectedFiles.forEach(file => {
      data.append('imagenes', file);
    });

    if (selectedVideo) {
      data.append('video', selectedVideo);
    } else if (formData.video_url) {
      data.append('videoExistente', formData.video_url);
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar');
      }

      setShowForm(false);
      fetchProductos();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) fetchProductos();
        else alert('Error al eliminar');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestión de Inventario</h2>
          <p className="text-slate-400 text-sm mt-1">Añade, edita o elimina productos de tu catálogo</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {loading && !showForm ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Imagen</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4">
                    <img src={prod.imagenes && prod.imagenes[0]} alt="" className="w-12 h-12 object-cover rounded border border-slate-100" />
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800">{prod.nombre}</div>
                    <div className="text-[10px] text-slate-400">ID: {prod.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold tracking-widest">
                      {prod.sku || '—'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-500 uppercase">{prod.categoria}</td>
                  <td className="p-4 text-sm font-black text-slate-800">S/ {Number(prod.precio).toFixed(2)}</td>
                  <td className="p-4 text-sm font-bold text-slate-600">{prod.stock}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleOpenForm(prod)} className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase tracking-widest">Editar</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre del Producto</label>
                  <input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto (Texto corto debajo del nombre)</label>
                  <input value={formData.concepto || ''} onChange={(e) => setFormData({...formData, concepto: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" placeholder="Ej: Humidificador ultrasónico de alta gama..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio Actual (S/)</label>
                  <input required type="number" step="0.01" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio Original (Oferta)</label>
                  <input type="number" step="0.01" value={formData.precio_original} onChange={(e) => setFormData({...formData, precio_original: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                  <select 
                    required 
                    value={formData.categoria} 
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})} 
                    className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none bg-white"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Sensorial">Sensorial</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Ropa">Ropa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badge (Opcional - ej: AGOTADO, NUEVO)</label>
                  <input value={formData.badge || ''} onChange={(e) => setFormData({...formData, badge: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</label>
                  <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descripción del Producto</label>
                  <textarea rows="3" required value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" placeholder="Breve resumen del producto..."></textarea>
                </div>
              </div>

              {/* Gestión de Imágenes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Imágenes del Producto (Máx 5)</label>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-all bg-slate-50 text-slate-400">
                      <span className="text-xl">+</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter">Subir</span>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 italic">* La primera imagen será la principal. Se crearán carpetas automáticamente por categoría.</p>
              </div>

              {/* Gestión de Video */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Video de Demostración (Opcional)</label>
                {videoPreview ? (
                  <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                    <video src={videoPreview} className="w-full h-full object-cover" muted playsInline />
                    <button 
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    >✕</button>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white text-[10px] font-bold uppercase">Vista Previa</span>
                    </div>
                  </div>
                ) : (
                  <label className="w-full max-w-xs aspect-video rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-all bg-slate-50 text-slate-400">
                    <span className="text-2xl">📹</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Subir Video</span>
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                  </label>
                )}
                <p className="text-[9px] text-slate-400 mt-2 italic">* Se recomienda videos cortos (max 15s) en formato MP4 o WebM.</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descripción del Producto</label>
                <textarea rows="4" required value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 border border-slate-200 p-3 rounded-lg text-sm focus:border-slate-400 focus:outline-none" placeholder="Breve resumen del producto..."></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-slate-900 text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

