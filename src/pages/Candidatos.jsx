import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Filter, Edit, Trash2, Eye, Award, Users, TrendingUp, X, FileText, CheckCircle, Clock, Trophy } from 'lucide-react';
import { containerVariants, itemVariants } from '../animations';

const Candidatos = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const candidatos = [
    {
      id: 1,
      nombre: 'Juan Carlos Pérez',
      partido: 'Partido Democrático',
      cargo: 'Presidente',
      tipo: 'presidencial',
      foto: '👨‍💼',
      dni: '12345678',
      edad: 55,
      propuestas: 15,
      votos: 2845678,
      porcentaje: 38.5,
      estado: 'Activo',
      color: 'from-blue-500 to-cyan-500',
      barColor: 'bg-blue-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Reforma Educativa Integral',
          descripcion: 'Implementación de educación gratuita y de calidad desde preescolar hasta universidad.',
          categoria: 'Educación',
          estado: 'En progreso',
          prioridad: 'Alta'
        },
        {
          id: 2,
          titulo: 'Plan Nacional de Salud',
          descripcion: 'Fortalecimiento del sistema público de salud con equipamiento moderno y más personal médico.',
          categoria: 'Salud',
          estado: 'Planificado',
          prioridad: 'Alta'
        }
      ]
    },
    {
      id: 2,
      nombre: 'María González',
      partido: 'Movimiento Popular',
      cargo: 'Vicepresidente',
      tipo: 'presidencial',
      foto: '👩‍💼',
      dni: '87654321',
      edad: 48,
      propuestas: 12,
      votos: 2134567,
      porcentaje: 28.9,
      estado: 'Activo',
      color: 'from-green-500 to-emerald-500',
      barColor: 'bg-green-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Programa de Vivienda Social',
          descripcion: 'Construcción de 100,000 viviendas para familias de bajos recursos.',
          categoria: 'Vivienda',
          estado: 'Planificado',
          prioridad: 'Alta'
        }
      ]
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      partido: 'Partido Nacional',
      cargo: 'Gobernador Regional',
      tipo: 'regional',
      foto: '👨‍💼',
      dni: '45678912',
      edad: 42,
      propuestas: 8,
      votos: 1567890,
      porcentaje: 21.2,
      estado: 'Activo',
      color: 'from-purple-500 to-pink-500',
      barColor: 'bg-purple-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Desarrollo Regional',
          descripcion: 'Inversión en infraestructura para las regiones.',
          categoria: 'Infraestructura',
          estado: 'En progreso',
          prioridad: 'Alta'
        }
      ]
    },
    {
      id: 4,
      nombre: 'Ana María Torres',
      partido: 'Frente Progresista',
      cargo: 'Congresista',
      tipo: 'distrital',
      foto: '👩‍💼',
      dni: '78912345',
      edad: 39,
      propuestas: 10,
      votos: 845678,
      porcentaje: 11.4,
      estado: 'Activo',
      color: 'from-orange-500 to-red-500',
      barColor: 'bg-red-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Ley de Transparencia',
          descripcion: 'Mayor transparencia en la gestión pública.',
          categoria: 'Transparencia',
          estado: 'Planificado',
          prioridad: 'Media'
        }
      ]
    },
    {
      id: 5,
      nombre: 'Roberto Silva',
      partido: 'Alianza Verde',
      cargo: 'Alcalde',
      tipo: 'regional',
      foto: '👨‍💼',
      dni: '32165487',
      edad: 45,
      propuestas: 7,
      votos: 756432,
      porcentaje: 15.8,
      estado: 'Activo',
      color: 'from-teal-500 to-green-500',
      barColor: 'bg-teal-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Ciudad Sostenible',
          descripcion: 'Implementación de energías renovables en la ciudad.',
          categoria: 'Medio Ambiente',
          estado: 'Implementado',
          prioridad: 'Alta'
        }
      ]
    },
    {
      id: 6,
      nombre: 'Laura Mendoza',
      partido: 'Unión por el Cambio',
      cargo: 'Congresista',
      tipo: 'distrital',
      foto: '👩‍💼',
      dni: '65498732',
      edad: 37,
      propuestas: 9,
      votos: 923456,
      porcentaje: 19.3,
      estado: 'Activo',
      color: 'from-pink-500 to-rose-500',
      barColor: 'bg-pink-600',
      propuestasDetalle: [
        {
          id: 1,
          titulo: 'Educación Digital',
          descripcion: 'Implementación de tecnología en las aulas.',
          categoria: 'Educación',
          estado: 'En progreso',
          prioridad: 'Media'
        }
      ]
    }
  ];

  const estadisticas = [
    { 
      label: 'Total Candidatos', 
      value: candidatos.length.toString(), 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Presidenciales', 
      value: candidatos.filter(c => c.tipo === 'presidencial').length.toString(), 
      icon: Award, 
      gradient: 'from-purple-500 to-pink-500' 
    },
    { 
      label: 'Distritales', 
      value: candidatos.filter(c => c.tipo === 'distrital').length.toString(), 
      icon: Users, 
      gradient: 'from-green-500 to-emerald-500' 
    },
    { 
      label: 'Regionales', 
      value: candidatos.filter(c => c.tipo === 'regional').length.toString(), 
      icon: TrendingUp, 
      gradient: 'from-orange-500 to-red-500' 
    },
  ];

  // Filtrar candidatos según el tipo seleccionado y búsqueda
  const candidatosFiltrados = candidatos.filter(candidato => {
    const coincideTipo = filtroTipo === 'todos' || candidato.tipo === filtroTipo;
    const coincideBusqueda = candidato.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                            candidato.partido.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                            candidato.dni.includes(terminoBusqueda);
    
    return coincideTipo && coincideBusqueda;
  });

  // Contar candidatos por tipo para las estadísticas
  const contadorPorTipo = {
    presidencial: candidatos.filter(c => c.tipo === 'presidencial').length,
    regional: candidatos.filter(c => c.tipo === 'regional').length,
    distrital: candidatos.filter(c => c.tipo === 'distrital').length,
    total: candidatos.length
  };

  const abrirModalPropuestas = (candidato) => {
    setCandidatoSeleccionado(candidato);
    setShowModal(true);
    setModalType('propuestas');
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

  const tiposFiltro = [
    { id: 'todos', label: 'Todos los Candidatos', count: contadorPorTipo.total },
    { id: 'presidencial', label: 'Presidenciales', count: contadorPorTipo.presidencial },
    { id: 'regional', label: 'Regionales', count: contadorPorTipo.regional },
    { id: 'distrital', label: 'Distritales', count: contadorPorTipo.distrital },
  ];

  // Función para formatear números con separadores de miles
  const formatNumber = (num) => {
    return num.toLocaleString('es-ES');
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Hero */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Candidatos</h1>
            <p className="text-white/90">Administra y supervisa todos los candidatos electorales</p>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {estadisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filtros por Tipo */}
      <motion.div 
        variants={itemVariants}
        className="glass-effect p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">Filtrar por Tipo de Candidatura</h3>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={containerVariants}
        >
          {tiposFiltro.map((tipo) => (
            <motion.button
              key={tipo.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFiltroTipo(tipo.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                filtroTipo === tipo.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-slate-800">{tipo.label}</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{tipo.count}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Barra de Búsqueda */}
      <motion.div 
        variants={itemVariants}
        className="glass-effect p-6 rounded-2xl shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar candidato por nombre, DNI o partido..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setTerminoBusqueda('')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              <X size={18} />
              Limpiar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contador de resultados */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <h3 className="text-lg font-bold text-slate-800">
          {filtroTipo === 'todos' ? 'Todos los Candidatos' : 
           filtroTipo === 'presidencial' ? 'Candidatos Presidenciales' :
           filtroTipo === 'regional' ? 'Candidatos Regionales' : 'Candidatos Distritales'}
          <span className="text-indigo-600 ml-2">({candidatosFiltrados.length})</span>
        </h3>
      </motion.div>

      {/* Grid de Candidatos Mejorado */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {candidatosFiltrados.map((candidato, index) => (
          <motion.div 
            key={candidato.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group relative glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            {/* Badge de tipo */}
            <div className="absolute top-4 left-4 z-20">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                candidato.tipo === 'presidencial' ? 'bg-purple-500' :
                candidato.tipo === 'regional' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {candidato.tipo === 'presidencial' ? 'Presidencial' :
                 candidato.tipo === 'regional' ? 'Regional' : 'Distrital'}
              </span>
            </div>

            {/* Trofeo para el primer lugar */}
            {index === 0 && filtroTipo !== 'todos' && (
              <div className="absolute top-4 right-4 z-20">
                <Trophy className="text-yellow-500" size={24} />
              </div>
            )}

            {/* Header con gradiente */}
            <div className={`h-32 bg-gradient-to-br ${candidato.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  candidato.estado === 'Activo' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                } shadow-lg`}>
                  {candidato.estado}
                </span>
              </div>
            </div>

            <div className="p-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform">
                {candidato.foto}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-slate-800 mb-1">{candidato.nombre}</h3>
              <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {candidato.partido}
              </p>
              <p className="text-sm text-slate-600 mb-4">{candidato.cargo}</p>

              {/* Porcentaje de Votos - Estilo Resultados Electorales */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{candidato.porcentaje}%</p>
                    <p className="text-sm text-slate-600">{formatNumber(candidato.votos)} votos</p>
                  </div>
                  {index === 0 && filtroTipo !== 'todos' && (
                    <div className="text-right">
                      <p className="text-xs font-semibold text-yellow-600">PRIMER LUGAR</p>
                    </div>
                  )}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${candidato.barColor}`}
                    style={{ width: `${candidato.porcentaje}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <p className="text-xs text-slate-600">DNI</p>
                  <p className="text-sm font-bold text-slate-800">{candidato.dni}</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-xs text-slate-600">Edad</p>
                  <p className="text-sm font-bold text-slate-800">{candidato.edad}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Propuestas</p>
                  <p className="text-sm font-bold text-slate-800">{candidato.propuestas}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button 
                  onClick={() => abrirModalPropuestas(candidato)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium"
                >
                  <Eye size={16} />
                  Ver Propuestas
                </button>
              </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Mensaje cuando no hay resultados */}
      {candidatosFiltrados.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-12 glass-effect rounded-2xl"
        >
          <Users size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">No se encontraron candidatos</h3>
          <p className="text-slate-500">Intenta con otros términos de búsqueda o cambia el filtro</p>
        </motion.div>
      )}

      {/* Modal de Propuestas (se mantiene igual) */}
      {showModal && modalType === 'propuestas' && candidatoSeleccionado && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className={`bg-gradient-to-r ${candidatoSeleccionado.color} p-6 text-white relative`}>
              <button 
                onClick={cerrarModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl">
                  {candidatoSeleccionado.foto}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{candidatoSeleccionado.nombre}</h2>
                  <p className="text-white/90">{candidatoSeleccionado.partido} • {candidatoSeleccionado.cargo}</p>
                  <p className="text-white/80 text-sm mt-1">
                    {candidatoSeleccionado.propuestasDetalle?.length || 0} propuestas registradas
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-4">
                {candidatoSeleccionado.propuestasDetalle?.map((propuesta, index) => (
                  <div 
                    key={propuesta.id}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {propuesta.titulo}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {propuesta.descripcion}
                        </p>
                      </div>
                      <FileText className="text-slate-400 ml-4 flex-shrink-0" size={20} />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {propuesta.categoria}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(propuesta.estado)}`}>
                        {propuesta.estado}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(propuesta.prioridad)}`}>
                        Prioridad {propuesta.prioridad}
                      </span>
                    </div>
                  </div>
                ))}

                {(!candidatoSeleccionado.propuestasDetalle || candidatoSeleccionado.propuestasDetalle.length === 0) && (
                  <div className="text-center py-8 text-slate-500">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>No hay propuestas registradas para este candidato</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={cerrarModal}
                  className="px-6 py-2.5 text-slate-600 hover:bg-white rounded-xl transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Candidatos;