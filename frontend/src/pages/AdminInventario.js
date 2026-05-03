import React, { useEffect, useState } from 'react';
import API_URL from '../apiConfig';

const AdminInventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todos');

  const categorias = ['Todos', 'Hogar', 'Sensorial', 'Tecnología', 'Ropa'];

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

  const handleEditStock = (producto) => {
    setEditingId(producto.id);
    setNewStock(String(producto.stock));
  };

  const handleSaveStock = async (producto) => {
    setSavingId(producto.id);
    try {
      const formData = new FormData();
      formData.append('nombre', producto.nombre);
      formData.append('precio', producto.precio);
      formData.append('precio_original', producto.precio_original || '');
      formData.append('categoria', producto.categoria);
      formData.append('stock', newStock);
      formData.append('descripcion', producto.descripcion || '');
      formData.append('badge', producto.badge || '');
      formData.append('concepto', producto.concepto || '');
      formData.append('imagenesExistentes', JSON.stringify(producto.imagenes || []));
      if (producto.video_url) formData.append('videoExistente', producto.video_url);

      const response = await fetch(`${API_URL}/api/products/${producto.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        setEditingId(null);
        fetchProductos();
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    } finally {
      setSavingId(null);
    }
  };

  const productosFiltrados = productos.filter(p => {
    const matchCat = filterCategoria === 'Todos' || p.categoria === filterCategoria;
    const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalProductos = productos.length;
  const sinStock = productos.filter(p => p.stock === 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
  const stockTotal = productos.reduce((acc, p) => acc + (p.stock || 0), 0);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Agotado', color: 'bg-red-100 text-red-600' };
    if (stock <= 5) return { label: 'En espera de reposición', color: 'bg-amber-100 text-amber-600' };
    return { label: 'En stock', color: 'bg-emerald-100 text-emerald-600' };
  };

  return (
    <div className="p-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestión de Inventario</h2>
        <p className="text-slate-400 text-sm mt-1">Monitorea y actualiza el stock de tus productos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Productos</p>
          <p className="text-3xl font-black text-slate-800">{totalProductos}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidades en Stock</p>
          <p className="text-3xl font-black text-emerald-600">{stockTotal}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">En espera de repos.</p>
          <p className="text-3xl font-black text-amber-500">{stockBajo}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Agotados</p>
          <p className="text-3xl font-black text-red-500">{sinStock}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm flex-grow focus:outline-none focus:border-slate-400"
        />
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:border-slate-400"
        >
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(prod => {
                const status = getStockStatus(prod.stock);
                const isEditing = editingId === prod.id;
                return (
                  <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imagenes && prod.imagenes[0]}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800 line-clamp-1">{prod.nombre}</div>
                          <div className="text-[10px] text-slate-400">ID: {prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold tracking-widest">
                        {prod.sku || '—'}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-500 uppercase">{prod.categoria}</td>
                    <td className="p-4 text-sm font-black text-slate-800">S/ {Number(prod.precio).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-20 border-2 border-slate-900 rounded-lg text-center text-sm font-bold p-1 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className={`text-lg font-black ${prod.stock === 0 ? 'text-red-500' : prod.stock <= 5 ? 'text-amber-500' : 'text-slate-800'}`}>
                          {prod.stock}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveStock(prod)}
                            disabled={savingId === prod.id}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all"
                          >
                            {savingId === prod.id ? '...' : 'Guardar'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditStock(prod)}
                          className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase tracking-widest"
                        >
                          Editar Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 text-sm">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventario;
