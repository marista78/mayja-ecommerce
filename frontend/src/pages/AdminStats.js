import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Componente de tarjeta KPI con skeleton loading
const KpiCard = ({ label, value, sub, subColor = 'text-emerald-500', loading }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 transform hover:scale-[1.02] transition-all">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    {loading ? (
      <div className="mt-3 h-9 w-32 bg-slate-100 animate-pulse rounded-lg" />
    ) : (
      <p className="text-4xl font-black text-slate-800 mt-2">{value}</p>
    )}
    <div className={`mt-4 text-xs font-bold ${subColor}`}>{sub}</div>
  </div>
);

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalPedidos: 0,
    ventasMes: 0,
    pedidosPendientes: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Obtener todos los pedidos
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular KPIs
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const totalPedidos = pedidos.length;

      const ventasMes = pedidos
        .filter(p => p.created_at >= inicioMes)
        .reduce((acc, p) => acc + Number(p.total || 0), 0);

      const pedidosPendientes = pedidos.filter(
        p => !p.metadata?.pagoConfirmado
      ).length;

      setStats({ totalPedidos, ventasMes, pedidosPendientes });
      setRecentOrders(pedidos.slice(0, 5));
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 1000 / 60);
    if (diff < 1) return 'Hace un momento';
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return new Date(dateString).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="p-10">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <KpiCard
          label="Pedidos Totales"
          value={stats.totalPedidos}
          sub={`${stats.totalPedidos === 1 ? '1 pedido registrado' : `${stats.totalPedidos} pedidos registrados`}`}
          subColor="text-slate-500"
          loading={loading}
        />
        <KpiCard
          label="Ventas Este Mes"
          value={`S/ ${stats.ventasMes.toFixed(2)}`}
          sub="Suma de pedidos del mes actual"
          subColor="text-emerald-500"
          loading={loading}
        />
        <KpiCard
          label="Pendientes de Pago"
          value={stats.pedidosPendientes}
          sub={stats.pedidosPendientes > 0 ? '⚠️ Requieren confirmación' : '✅ Todo al día'}
          subColor={stats.pedidosPendientes > 0 ? 'text-amber-500' : 'text-emerald-500'}
          loading={loading}
        />
      </div>

      {/* Actividad Reciente + Bienvenida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            📋 Últimos Pedidos
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No hay pedidos registrados aún.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((pedido) => (
                <div key={pedido.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pedido.metadata?.pagoConfirmado ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 truncate">
                      Pedido de <strong>{pedido.nombre || pedido.cliente_nombre || 'Cliente'}</strong>
                    </p>
                    <p className="text-xs text-slate-400">
                      S/ {Number(pedido.total).toFixed(2)} · {pedido.metadata?.pagoConfirmado ? 'Confirmado' : 'Pendiente'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{formatDate(pedido.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-8 rounded-xl shadow-xl text-white flex flex-col justify-center">
          <div className="text-3xl mb-4">👋</div>
          <h3 className="text-xl font-bold mb-2">¡Bienvenido de nuevo!</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Desde aquí puedes gestionar toda tu tienda Mayja. Revisa los pedidos pendientes de confirmación y mantén tu inventario actualizado.
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <a
              href="/admin/pedidos"
              className="bg-white text-slate-900 px-5 py-2 rounded-lg font-bold text-xs hover:bg-slate-100 transition-all"
            >
              Ver Pedidos →
            </a>
            <a
              href="/admin/productos"
              className="border border-slate-700 text-slate-300 px-5 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Gestionar Productos →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
