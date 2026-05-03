import React, { useState } from 'react';

const CulqiModal = ({ isOpen, onClose, total, onPaymentSuccess, emailCliente }) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    cuotas: 'Sin cuotas'
  });

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    // Simulación de procesamiento de pago
    alert("Procesando pago con Culqi...");
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-slideUp">
        {/* Header Culqi */}
        <div className="bg-[#00a19b] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-sm">
              <img src="/img/culqi-logo.png" className="h-4 w-auto" alt="Culqi" />
            </div>
            <span className="font-bold text-sm">MAYJA</span>
          </div>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-transform">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Total a pagar */}
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total a pagar</span>
          <span className="text-xl font-black text-gray-800">S/ {total.toFixed(2)}</span>
        </div>

        <form onSubmit={handlePay} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Número de Tarjeta</label>
              <div className="relative mt-1">
                <input required type="text" placeholder="#### #### #### ####" className="w-full border border-gray-200 p-3 pl-10 rounded text-sm focus:border-[#00a19b] focus:outline-none" />
                <span className="absolute left-3 top-3 text-gray-300">💳</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Vencimiento</label>
                <input required type="text" placeholder="MM/AA" className="w-full mt-1 border border-gray-200 p-3 rounded text-sm focus:border-[#00a19b] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">CVV</label>
                <input required type="text" placeholder="123" className="w-full mt-1 border border-gray-200 p-3 rounded text-sm focus:border-[#00a19b] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Número de Cuotas</label>
              <select className="w-full mt-1 border border-gray-200 p-3 rounded text-sm bg-white appearance-none focus:border-[#00a19b] focus:outline-none">
                <option>Sin cuotas</option>
                <option>2 cuotas</option>
                <option>3 cuotas</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</label>
              <input required type="email" value={emailCliente} readOnly className="w-full mt-1 border border-gray-100 p-3 rounded text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#00a19b] text-white py-4 rounded font-bold text-sm hover:brightness-90 transition-all shadow-lg uppercase tracking-widest mt-4">
            Pagar S/ {total.toFixed(2)}
          </button>

          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-50">
            <img src="https://vj-it.com/wp-content/uploads/2021/04/culqi.png" alt="Powered by Culqi" className="h-3 w-auto opacity-40 grayscale" />
            <span className="text-[9px] text-gray-300 uppercase tracking-widest">Pago 100% Seguro</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CulqiModal;
