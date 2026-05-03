import React, { useState, useMemo } from 'react';
import API_URL from '../apiConfig';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import CulqiModal from '../components/CulqiModal';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCulqiOpen, setIsCulqiOpen] = useState(false);
  
  const tarifasEnvio = {
    "Miraflores": 9.90, "San Isidro": 9.90, "San Borja": 9.90, "Surco": 9.90, "Lince": 9.90,
    "Jesús María": 9.90, "Magdalena": 9.90, "Pueblo Libre": 9.90, "Barranco": 9.90,
    "San Miguel": 12.00, "Surquillo": 9.90, "La Victoria": 12.00, "Chorrillos": 12.00,
    "La Molina": 15.00, "Los Olivos": 15.00, "San Martín de Porres": 15.00, 
    "San Juan de Lurigancho": 18.00, "Villa El Salvador": 18.00, "Otros": 20.00
  };

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', dni_ruc: '', email: '', whatsapp: '',
    departamento: 'Lima Metropolitana', distrito: '', direccion: '',
    apartamento: '', referencia: '', notas: '', solicitarFactura: false,
    metodoEnvio: 'domicilio_lima', metodoPago: 'culqi' // Culqi por defecto según imagen
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const costoEnvio = useMemo(() => {
    if (formData.metodoEnvio === 'recojo') return 0;
    return tarifasEnvio[formData.distrito] || 0;
  }, [formData.distrito, formData.metodoEnvio]);

  const totalFinal = cartTotal + costoEnvio;

  const handleFinalizeOrder = async (pagoExitoso = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: `${formData.nombres} ${formData.apellidos}`,
          email: formData.email,
          whatsapp: formData.whatsapp,
          direccion: `${formData.direccion} - ${formData.distrito}`,
          productos: cartItems,
          total: totalFinal,
          metadata: { ...formData, costoEnvio, pagoConfirmado: pagoExitoso }
        })
      });

      const mensaje = `*NUEVO PEDIDO - MAYJA*\n\n👤 ${formData.nombres}\n📍 ${formData.distrito}\n💳 Pago: ${formData.metodoPago}${pagoExitoso ? ' (CONFIRMADO)' : ''}\n💰 Total: S/ ${totalFinal.toFixed(2)}`;
      window.location.href = `https://wa.me/51999888777?text=${encodeURIComponent(mensaje)}`;
      clearCart();
    } catch (err) {
      alert('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.distrito && formData.metodoEnvio === 'domicilio_lima') {
      alert("Por favor selecciona un distrito");
      return;
    }

    if (formData.metodoPago === 'culqi') {
      setIsCulqiOpen(true);
    } else {
      handleFinalizeOrder(false);
    }
  };

  if (cartItems.length === 0) return <div className="p-20 text-center">Carrito vacío</div>;

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans pb-20">
      
      <CulqiModal 
        isOpen={isCulqiOpen} 
        onClose={() => setIsCulqiOpen(false)}
        total={totalFinal}
        emailCliente={formData.email}
        onPaymentSuccess={() => {
          setIsCulqiOpen(false);
          handleFinalizeOrder(true);
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMNA 1: DATOS */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-[#1c1f22] uppercase tracking-tighter border-b border-gray-100 pb-4">Facturación y envío</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre *</label>
                <input name="nombres" value={formData.nombres} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-blue-50/40 focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Apellidos *</label>
                <input name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-blue-50/40 focus:outline-none focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">DNI / RUC *</label>
              <input name="dni_ruc" value={formData.dni_ruc} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp *</label>
              <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-blue-50/40 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Correo electrónico *</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-blue-50/40 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Distrito *</label>
              <select name="distrito" value={formData.distrito} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-white focus:outline-none focus:border-primary-500">
                <option value="">Seleccionar distrito...</option>
                {Object.keys(tarifasEnvio).sort().map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dirección *</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-4 text-base bg-blue-50/40 mb-4 focus:outline-none focus:border-primary-500" />
              <input name="apartamento" value={formData.apartamento} onChange={handleChange} className="w-full border border-gray-200 p-4 text-base focus:outline-none focus:border-primary-500" placeholder="Apt, hab, etc. (opcional)" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Referencia *</label>
              <textarea name="referencia" value={formData.referencia} onChange={handleChange} rows="2" className="w-full mt-2 border border-gray-200 p-4 text-base focus:outline-none focus:border-primary-500"></textarea>
            </div>
          </div>

          {/* COLUMNA 2: SU PEDIDO */}
          <div className="space-y-10">
            <h2 className="text-2xl font-black text-[#1c1f22] uppercase tracking-tighter border-b border-gray-100 pb-4">Su pedido</h2>
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0"><img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" /></div>
                    <span className="text-sm text-gray-700 font-bold leading-tight">{item.nombre} <span className="text-primary-500">× {item.quantity}</span></span>
                  </div>
                  <span className="text-sm font-black text-gray-800">S/ {(Number(item.precio) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-6 border-b border-gray-100 pb-8">
              <div className="flex justify-between items-center text-base font-bold"><span>Subtotal</span><span>S/ {cartTotal.toFixed(2)}</span></div>
              <div className="space-y-5">
                <span className="text-base font-bold text-[#1c1f22] block">Envío</span>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="radio" name="metodoEnvio" value="recojo" checked={formData.metodoEnvio === 'recojo'} onChange={handleChange} className="mt-1 h-4 w-4" />
                  <span className="text-sm text-gray-600 leading-normal">Recojo En Almacén Previa Coordinación (Chorrillos)</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input type="radio" name="metodoEnvio" value="domicilio_lima" checked={formData.metodoEnvio === 'domicilio_lima'} onChange={handleChange} className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Envío Distritos LM: S/ {costoEnvio.toFixed(2)}</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl font-black text-[#1c1f22] uppercase tracking-tighter"><span>Total</span><span className="text-3xl text-secondary-500">S/ {totalFinal.toFixed(2)}</span></div>
            <div className="bg-[#f0f9f1] p-8 rounded-sm border-l-4 border-[#4caf50] text-sm text-[#2e7d32] italic leading-relaxed">
              Entregas entre 24 y 48 horas. Nos contactaremos contigo para coordinar el día y el rango horario de tu preferencia.
            </div>
          </div>

          {/* COLUMNA 3: MÉTODOS DE PAGO (ESTILO FIEL A IMAGEN) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-[#1c1f22] uppercase tracking-tighter border-b border-gray-100 pb-4">Métodos de pago</h2>
            
            <div className="pt-2 space-y-8">
              <h3 className="text-sm font-bold text-[#1c1f22]">Métodos de pago</h3>
              
              <div className="space-y-10">
                {/* Yape / Plin */}
                <label className="flex items-center gap-4 cursor-pointer group relative">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.metodoPago === 'yape_plin' ? 'border-[#00a19b]' : 'border-gray-200'}`}>
                    {formData.metodoPago === 'yape_plin' && <div className="w-3 h-3 rounded-full bg-[#00a19b]"></div>}
                  </div>
                  <input type="radio" name="metodoPago" value="yape_plin" checked={formData.metodoPago === 'yape_plin'} onChange={handleChange} className="hidden" />
                  <span className="text-base text-gray-600 flex items-center gap-3">
                    Yape / Plin <img src="/img/yape-plin.png" className="h-6 w-auto" alt="Yape Plin" />
                  </span>
                </label>

                {/* Transferencia */}
                <label className="flex items-center gap-4 cursor-pointer group relative">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.metodoPago === 'transferencia' ? 'border-[#00a19b]' : 'border-gray-200'}`}>
                    {formData.metodoPago === 'transferencia' && <div className="w-3 h-3 rounded-full bg-[#00a19b]"></div>}
                  </div>
                  <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} className="hidden" />
                  <span className="text-base text-gray-600">Transferencia bancaria directa</span>
                </label>

                {/* Contra entrega */}
                {formData.metodoEnvio === 'domicilio_lima' && (
                  <label className="flex items-center gap-4 cursor-pointer group relative">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.metodoPago === 'contra_entrega' ? 'border-[#00a19b]' : 'border-gray-200'}`}>
                      {formData.metodoPago === 'contra_entrega' && <div className="w-3 h-3 rounded-full bg-[#00a19b]"></div>}
                    </div>
                    <input type="radio" name="metodoPago" value="contra_entrega" checked={formData.metodoPago === 'contra_entrega'} onChange={handleChange} className="hidden" />
                    <span className="text-base text-gray-600">Contra entrega</span>
                  </label>
                )}

                {/* Culqi */}
                <div className="space-y-3">
                  <label className="flex items-center gap-4 cursor-pointer group relative">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.metodoPago === 'culqi' ? 'border-[#00a19b]' : 'border-gray-200'}`}>
                      {formData.metodoPago === 'culqi' && <div className="w-3 h-3 rounded-full bg-[#00a19b]"></div>}
                    </div>
                    <input type="radio" name="metodoPago" value="culqi" checked={formData.metodoPago === 'culqi'} onChange={handleChange} className="hidden" />
                    <span className="text-base text-gray-600 flex items-center gap-3">
                      <img src="/img/culqi-logo.png" className="h-4 w-auto" alt="Culqi" />
                      <img src="/img/cards.png" className="h-5 w-auto" alt="Tarjetas" />
                    </span>
                  </label>
                  <p className="text-[11px] text-gray-500 leading-relaxed pl-10 pr-4">
                    Acepta pagos con <span className="font-bold">tarjetas de débito y crédito, Cuotéalo BCP y PagoEfectivo</span> (billeteras móviles, agentes y bodegas).
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100">
                <p className="text-xs text-gray-400 leading-relaxed mb-8">
                  Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra <span className="text-primary-500 font-bold underline cursor-pointer">privacy policy</span>.
                </p>

                <div className="flex justify-between items-center text-2xl font-black text-[#1c1f22] mb-6">
                  <span>TOTAL:</span>
                  <span>S/ {totalFinal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#1c1f22] text-white py-6 font-black uppercase tracking-[0.25em] text-xs hover:bg-black transition-all shadow-xl shadow-gray-200 transform active:scale-95"
                >
                  {loading ? 'PROCESANDO...' : 'REALIZAR EL PEDIDO'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
