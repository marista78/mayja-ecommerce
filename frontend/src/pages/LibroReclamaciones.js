import React, { useState, useEffect } from 'react';
import API_URL from '../apiConfig';
import { peruData } from '../data/ubigeo';

const LibroReclamaciones = () => {
  const [sent, setSent] = useState(false);
  const [correlativo, setCorrelativo] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState([]);

  const [formData, setFormData] = useState({
    tipo_persona: 'Natural',
    nombre: '',
    domicilio: '',
    tipo_documento: 'DNI',
    num_documento: '',
    telefono: '',
    email: '',
    departamento: '',
    provincia: '',
    distrito: '',
    es_menor: false,
    padre_tutor: '',
    apoderado_dni: '',
    apoderado_email: '',
    apoderado_telefono: '',
    apoderado_direccion: '',
    tipo_bien: 'Producto',
    tipo_comprobante: 'Sin comprobante',
    num_comprobante: '',
    descripcion_bien: '',
    tipo_reclamo: 'Reclamo',
    detalle_reclamo: ''
  });

  // Efecto para actualizar provincias cuando cambia departamento
  useEffect(() => {
    if (formData.departamento && peruData[formData.departamento]) {
      setProvinciasDisponibles(Object.keys(peruData[formData.departamento]));
    } else {
      setProvinciasDisponibles([]);
    }
    setFormData(prev => ({ ...prev, provincia: '', distrito: '' }));
  }, [formData.departamento]);

  // Efecto para actualizar distritos cuando cambia provincia
  useEffect(() => {
    if (formData.departamento && formData.provincia && peruData[formData.departamento][formData.provincia]) {
      setDistritosDisponibles(peruData[formData.departamento][formData.provincia]);
    } else {
      setDistritosDisponibles([]);
    }
    setFormData(prev => ({ ...prev, distrito: '' }));
  }, [formData.provincia, formData.departamento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reclamaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSent(true);
        setCorrelativo(data.correlativo);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      alert('Error al enviar el formulario. Inténtelo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h1 className="text-3xl font-black text-primary-500 mb-4 uppercase tracking-tighter">¡Reclamo Registrado!</h1>
        <p className="text-gray-600 mb-8">Su reclamación ha sido enviada con éxito. Guarde su número de seguimiento:</p>
        <div className="bg-slate-100 p-6 rounded-xl font-mono text-2xl font-bold tracking-widest text-slate-800 mb-8 border-2 border-dashed border-slate-300">
          {correlativo}
        </div>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          De acuerdo a ley, tenemos un plazo de hasta 15 días hábiles para dar respuesta a su requerimiento.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-10 bg-primary-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-primary-600 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 font-sans">
        {/* Header Oficial */}
        <div className="bg-slate-900 p-8 text-center sm:text-left sm:flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black uppercase tracking-tighter">Libro de Reclamaciones</h1>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Hoja de Reclamación Virtual</p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
            <span className="text-white/60 text-[10px] block uppercase font-bold tracking-widest">Fecha</span>
            <span className="text-white font-mono text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
            <span className="text-2xl">📝</span>
            <p className="text-xs text-amber-800 leading-relaxed italic">
              "Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, este establecimiento cuenta con un Libro de Reclamaciones a tu disposición. Solicítalo para registrar una queja o reclamo."
            </p>
          </div>

          {/* Tipo de Persona */}
          <div className="flex gap-6 justify-center sm:justify-start border-b border-slate-50 pb-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="tipo_persona" value="Natural" checked={formData.tipo_persona === 'Natural'} onChange={handleChange} className="accent-primary-500 h-4 w-4" />
              <span className={`text-xs font-bold uppercase tracking-widest ${formData.tipo_persona === 'Natural' ? 'text-primary-500' : 'text-slate-400'}`}>Persona Natural</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="tipo_persona" value="Juridica" checked={formData.tipo_persona === 'Juridica'} onChange={handleChange} className="accent-primary-500 h-4 w-4" />
              <span className={`text-xs font-bold uppercase tracking-widest ${formData.tipo_persona === 'Juridica' ? 'text-primary-500' : 'text-slate-400'}`}>Persona Jurídica</span>
            </label>
          </div>

          {/* Sección 1: Identificación del Consumidor */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
              <h2 className="font-black text-slate-800 uppercase tracking-widest text-sm">Identificación del Consumidor Reclamante</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombres y Apellidos</label>
                <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" placeholder="Tal como figura en su documento" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Domicilio</label>
                <input required name="domicilio" value={formData.domicilio} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Doc. Identidad</label>
                <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white">
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carnet de extranjería</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">N. Documento</label>
                <input required name="num_documento" value={formData.num_documento} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Departamento</label>
                <select 
                  required 
                  name="departamento" 
                  value={formData.departamento} 
                  onChange={handleChange} 
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">Seleccione...</option>
                  {Object.keys(peruData).map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Provincia</label>
                  <select 
                    required 
                    name="provincia" 
                    value={formData.provincia} 
                    onChange={handleChange} 
                    disabled={!formData.departamento}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seleccione...</option>
                    {provinciasDisponibles.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Distrito</label>
                  <select 
                    required 
                    name="distrito" 
                    value={formData.distrito} 
                    onChange={handleChange} 
                    disabled={!formData.provincia}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seleccione...</option>
                    {distritosDisponibles.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono / Celular</label>
                <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
              </div>
            </div>

            {/* Menor de Edad */}
            <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="es_menor" checked={formData.es_menor} onChange={handleChange} className="accent-primary-500 h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">¿Eres menor de edad?</span>
              </label>

              {formData.es_menor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 animate-fadeIn">
                  <p className="sm:col-span-2 text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Datos del Padre, Madre o Tutor</p>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre y Apellido del Apoderado</label>
                    <input required={formData.es_menor} name="padre_tutor" value={formData.padre_tutor} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">DNI / CE Apoderado</label>
                    <input required={formData.es_menor} name="apoderado_dni" value={formData.apoderado_dni} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email del Apoderado</label>
                    <input required={formData.es_menor} type="email" name="apoderado_email" value={formData.apoderado_email} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono del Apoderado</label>
                    <input required={formData.es_menor} name="apoderado_telefono" value={formData.apoderado_telefono} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Dirección del Apoderado</label>
                    <input required={formData.es_menor} name="apoderado_direccion" value={formData.apoderado_direccion} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Sección 2: Manifiesto del Consumidor Reclamante */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
              <h2 className="font-black text-slate-800 uppercase tracking-widest text-sm">Manifiesto del Consumidor Reclamante</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Bien Contratado</label>
                <select name="tipo_bien" value={formData.tipo_bien} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white">
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo</label>
                <div className="flex gap-8 h-full items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="tipo_reclamo" value="Reclamo" checked={formData.tipo_reclamo === 'Reclamo'} onChange={handleChange} className="accent-primary-500 h-4 w-4" />
                    <span className="text-xs font-bold text-slate-600 uppercase group-hover:text-primary-500 transition-colors">Reclamo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="tipo_reclamo" value="Queja" checked={formData.tipo_reclamo === 'Queja'} onChange={handleChange} className="accent-primary-500 h-4 w-4" />
                    <span className="text-xs font-bold text-slate-600 uppercase group-hover:text-primary-500 transition-colors">Queja</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:col-span-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Comprobante de Pago</label>
                  <select name="tipo_comprobante" value={formData.tipo_comprobante} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none bg-white">
                    <option value="Factura">Factura</option>
                    <option value="Boleta">Boleta</option>
                    <option value="Recibo">Recibo</option>
                    <option value="Sin comprobante">Sin comprobante</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">N:</label>
                  <input name="num_comprobante" value={formData.num_comprobante} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" placeholder="Número de comprobante" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Descripción del Bien o Servicio</label>
                <textarea rows="2" name="descripcion_bien" value={formData.descripcion_bien} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none" placeholder="Nombre del producto, código de pedido, etc."></textarea>
              </div>

              <div className="sm:col-span-2 space-y-4">
                <p className="text-[10px] text-slate-400 italic">
                  * Reclamo: Disconformidad relacionada a los productos o servicios. / Queja: Disconformidad no relacionada a los productos (atención al cliente, etc).
                </p>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Detalle del Reclamo o Queja</label>
                  <textarea required rows="4" name="detalle_reclamo" value={formData.detalle_reclamo} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-primary-500 outline-none"></textarea>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-primary-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Hoja de Reclamación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroReclamaciones;
