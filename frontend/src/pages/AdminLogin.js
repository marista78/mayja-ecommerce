import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Si el login es exitoso, redirigir al Dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o acceso denegado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-xl shadow-xl shadow-slate-200 w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-slate-900 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            M
          </div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Panel Administrativo</h1>
          <p className="text-slate-400 text-sm mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg text-xs font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mayja.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none transition-all text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none transition-all text-slate-700"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Acceder al Panel'}
          </button>

          {/* Botón temporal de configuración inicial - VERSION ROBUSTA */}
          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                // Intentar registro con correo nuevo para saltar el rate limit
                const { data, error: signupError } = await supabase.auth.signUp({
                  email: 'admin2@mayja.com',
                  password: 'admin1234',
                });

                if (signupError) {
                  alert("Error Supabase: " + signupError.message);
                } else {
                  alert("✅ ¡ÉXITO! Usuario admin2@mayja.com creado. Ahora intenta loguearte.");
                }
              } catch (e) {
                alert("Error de red/cliente: " + e.message);
              }
              setLoading(false);
            }}
            className="w-full mt-4 bg-emerald-50 text-emerald-600 py-3 rounded-lg font-bold uppercase tracking-widest text-[9px] hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            ⚙️ Configuración Inicial (Forzar Admin)
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 text-xs hover:text-slate-600 transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
