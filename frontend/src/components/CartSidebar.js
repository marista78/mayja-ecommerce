import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary-500 text-white">
            <h2 className="text-lg font-black uppercase tracking-widest">Tu Carrito</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-6xl grayscale opacity-20 italic">🛒</div>
                <p className="text-gray-400 font-medium">Tu carrito está vacío</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-secondary-500 font-bold hover:underline"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-xs font-bold text-primary-500 uppercase line-clamp-1">{item.nombre}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-secondary-500 font-black text-sm mb-3">S/ {Number(item.precio).toFixed(2)}</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-100 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary-500"
                          >-</button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary-500"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-2xl font-black text-primary-500">S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="space-y-3">
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-primary-500 text-white text-center py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-lg"
                >
                  Finalizar Compra
                </Link>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
