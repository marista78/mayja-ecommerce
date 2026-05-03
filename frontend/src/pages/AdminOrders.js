import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching pedidos:', error);
    else setPedidos(data);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestión de Pedidos</h2>
          <p className="text-slate-400 text-sm mt-1">Monitorea y gestiona las ventas de tu tienda</p>
        </div>
        <button 
          onClick={fetchPedidos}
          className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          🔄 Actualizar Lista
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distrito</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pago</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-xs text-slate-600 font-medium">{formatDate(pedido.created_at)}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800">{pedido.nombre}</div>
                    <div className="text-[10px] text-slate-400">{pedido.whatsapp}</div>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-medium">
                    {pedido.direccion.split('-')[1] || 'Lima'}
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-black text-slate-800">S/ {Number(pedido.total).toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      pedido.metadata?.pagoConfirmado 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {pedido.metadata?.pagoConfirmado ? 'Confirmado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedPedido(pedido)}
                      className="text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && (
            <div className="p-20 text-center text-slate-400 text-sm">No hay pedidos registrados todavía.</div>
          )}
        </div>
      )}

      {/* Modal de Detalle de Pedido */}
      {selectedPedido && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">Detalle del Pedido #{selectedPedido.id.slice(0, 8)}</h3>
              <button onClick={() => setSelectedPedido(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Información del Cliente</h4>
                  <p className="text-sm text-slate-700"><strong>Nombre:</strong> {selectedPedido.nombre}</p>
                  <p className="text-sm text-slate-700"><strong>WhatsApp:</strong> {selectedPedido.whatsapp}</p>
                  <p className="text-sm text-slate-700"><strong>Email:</strong> {selectedPedido.email}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dirección de Entrega</h4>
                  <p className="text-sm text-slate-700">{selectedPedido.direccion}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Productos</h4>
                <div className="space-y-3">
                  {selectedPedido.productos?.map((prod, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{prod.nombre} <strong className="text-slate-400">× {prod.quantity}</strong></span>
                      <span className="text-sm font-bold text-slate-800">S/ {(Number(prod.precio) * prod.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Método de Pago</span>
                  <p className="text-sm font-bold text-slate-700 uppercase">{selectedPedido.metadata?.metodoPago || 'WhatsApp'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total del Pedido</span>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">S/ {Number(selectedPedido.total).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
