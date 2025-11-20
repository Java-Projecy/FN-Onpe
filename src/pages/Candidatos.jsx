import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Award,
  TrendingUp,
  Search,
  X,
  Eye,
  FileText,
} from 'lucide-react';
import { candidatosAPI } from '../services/api';

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Mapea campos camelCase de la API
const mapearCandidato = (c) => ({
  ...c,
  tipo_eleccion: c.tipoEleccion,
  image_url: c.imageUrl,
  propuestas: typeof c.propuestas === 'string'
    ? (c.propuestas ? JSON.parse(c.propuestas) : [])
    : (c.propuestas || [])
});

const normalizarTipo = (tipo) => tipo ? tipo.toString().toLowerCase().trim() : '';

const Candidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await candidatosAPI.getAll();
        const candidatosMapeados = (res.data || []).map(mapearCandidato);
        setCandidatos(candidatosMapeados);
      } catch (err) {
        setError('Error al cargar los candidatos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const tipoConfig = {
    presidencial: { label: 'Presidencial', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    regional: { label: 'Regional', color: 'bg-gradient-to-r from-emerald-600 to-teal-600' },
    distrital: { label: 'Distrital', color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
  };

  const estadisticas = [
    { label: 'Total Candidatos', value: candidatos.length, icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Presidenciales', value: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'presidencial').length, icon: Award, gradient: 'from-purple-500 to-pink-500' },
    { label: 'Distritales', value: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'distrital').length, icon: Users, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Regionales', value: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'regional').length, icon: TrendingUp, gradient: 'from-orange-500 to-red-500' },
  ];

  const candidatosFiltrados = candidatos.filter(c => {
    const tipoOk = filtroTipo === 'todos' || normalizarTipo(c.tipo_eleccion) === filtroTipo;
    const busquedaOk = !terminoBusqueda ||
      c.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      c.partido?.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return tipoOk && busquedaOk;
  });

  const contadorPorTipo = {
    total: candidatos.length,
    presidencial: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'presidencial').length,
    regional: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'regional').length,
    distrital: candidatos.filter(c => normalizarTipo(c.tipo_eleccion) === 'distrital').length,
  };

  const tiposFiltro = [
    { id: 'todos', label: 'Todos los Candidatos', count: contadorPorTipo.total },
    { id: 'presidencial', label: 'Presidenciales', count: contadorPorTipo.presidencial },
    { id: 'regional', label: 'Regionales', count: contadorPorTipo.regional },
    { id: 'distrital', label: 'Distritales', count: contadorPorTipo.distrital },
  ];

  const abrirModalPropuestas = (candidato) => {
    setCandidatoSeleccionado(candidato);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setCandidatoSeleccionado(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Implementado': return 'bg-green-100 text-green-800';
      case 'En progreso': return 'bg-blue-100 text-blue-800';
      case 'Planificado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-orange-100 text-orange-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Cargando candidatos...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">

      {/* Hero */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Candidatos</h1>
          <p className="text-white/90">Administra y supervisa todos los candidatos electorales</p>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={containerVariants}>
        {estadisticas.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filtros por tipo */}
      <motion.div variants={itemVariants} className="glass-effect p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Filtrar por Tipo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiposFiltro.map(t => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltroTipo(t.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${filtroTipo === t.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
            >
              <p className="font-semibold text-slate-800">{t.label}</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{t.count}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Búsqueda */}
      <motion.div variants={itemVariants} className="glass-effect p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o partido..."
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          {terminoBusqueda && (
            <button onClick={() => setTerminoBusqueda('')} className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
              <X size={18} /> Limpiar
            </button>
          )}
        </div>
      </motion.div>

      {/* GRID DE CANDIDATOS - CON ANIMACIÓN PERFECTA */}
      <motion.div
        key={`${filtroTipo}-${terminoBusqueda}`}  // ← CLAVE: Fuerza re-render y animación completa
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {candidatosFiltrados.map((candidato) => {
          const tipoNormalizado = normalizarTipo(candidato.tipo_eleccion);
          const config = tipoConfig[tipoNormalizado] || { label: 'Sin tipo', color: 'bg-gray-500' };

          return (
            <motion.div
              key={candidato.id}
              layout                    // ← Anima posición y tamaño suavemente
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="h-32 bg-gradient-to-br from-slate-600 to-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              </div>

              <div className="p-6 -mt-16 relative z-10">
                <div className="w-28 h-28 mx-auto mb-4 rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                  {candidato.image_url ? (
                    <img src={candidato.image_url} alt={candidato.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white">
                      {candidato.nombre?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-center text-slate-800 mb-1">{candidato.nombre || 'Sin nombre'}</h3>
                <p className="text-sm text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  {candidato.partido || 'Sin partido'}
                </p>

                <div className="grid grid-cols-3 gap-3 my-5 p-4 bg-slate-50 rounded-xl text-center text-sm">
                  <div>
                    <p className="text-slate-600">Propuestas</p>
                    <p className="font-bold text-indigo-600 text-lg">{candidato.propuestas.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Tipo</p>
                    <p className="font-bold">{config.label}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Estado</p>
                    <p className="font-bold text-green-600">Activo</p>
                  </div>
                </div>

                <button
                  onClick={() => abrirModalPropuestas(candidato)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg"
                >
                  <Eye size={18} /> Ver Propuestas Completas
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modal */}
      {showModal && candidatoSeleccionado && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative">
              <button onClick={cerrarModal} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition">
                <X size={28} />
              </button>
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                  {candidatoSeleccionado.image_url ? (
                    <img src={candidatoSeleccionado.image_url} alt={candidatoSeleccionado.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/30 flex items-center justify-center text-6xl font-bold">
                      {candidatoSeleccionado.nombre?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{candidatoSeleccionado.nombre}</h2>
                  <p className="text-xl opacity-90">{candidatoSeleccionado.partido}</p>
                  <p className="text-sm opacity-80 mt-2">
                    {candidatoSeleccionado.propuestas.length} propuestas registradas
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {candidatoSeleccionado.propuestas.length > 0 ? (
                <div className="grid gap-5">
                  {candidatoSeleccionado.propuestas.map((p, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {p.titulo || 'Propuesta sin título'}
                        </h3>
                        <FileText className="text-slate-400" size={24} />
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {p.descripcion || 'Sin descripción disponible.'}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {p.categoria && (
                          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {p.categoria}
                          </span>
                        )}
                        {p.estado && (
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEstadoColor(p.estado)}`}>
                            {p.estado}
                          </span>
                        )}
                        {p.prioridad && (
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPrioridadColor(p.prioridad)}`}>
                            Prioridad {p.prioridad}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-xl text-slate-500">Este candidato aún no tiene propuestas registradas</p>
                </div>
              )}
            </div>

            <div className="border-t p-5 bg-slate-50 text-right">
              <button onClick={cerrarModal} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-medium">
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Candidatos;