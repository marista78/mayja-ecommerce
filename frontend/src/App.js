import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import './index.css';

// Context y Componentes Globales
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';

// Páginas
import Tienda from './pages/Tienda';
import Contactanos from './pages/Contactanos';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import LibroReclamaciones from './pages/LibroReclamaciones';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminInventario from './pages/AdminInventario';
import AdminProducts from './pages/AdminProducts';
import AdminStats from './pages/AdminStats';
import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Layout para rutas públicas (con Header, Footer, CartSidebar)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/contactanos" element={<Contactanos />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/libro-de-reclamaciones" element={<LibroReclamaciones />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Rutas Administrativas – sin Header/Footer público */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminStats />} />
            <Route path="inventario" element={<AdminInventario />} />
            <Route path="productos" element={<AdminProducts />} />
          </Route>

          {/* Rutas Públicas – con Header y Footer */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
