import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Trash2, Edit, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { containerVariants, itemVariants } from '../animations';

const GestionDatos = () => {
  const [activeTab, setActiveTab] = useState('presidencial');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [votantes, setVotantes] = useState([]);

  // Función para cargar votantes del localStorage
  const cargarVotantes = () => {
    const votantesGuardados = JSON.parse(localStorage.getItem('votantes') || '[]');
    setVotantes(votantesGuardados);
  };

  // Cargar votantes al montar el componente
  useEffect(() => {
    cargarVotantes();
  }, []);

  // Datos simulados iniciales (se combinarán con los del localStorage)
  const votantesIniciales = [
    { 
      id: 1, 
      dni: '72345678', 
      nombre: 'Juan Pérez Gómez', 
      edad: 45, 
      distrito: 'San Isidro',
      departamento: 'Lima',
      provincia: 'Lima',
      direccion: 'Av. Principal 123',
      telefono: '987654321',
      email: 'juan.perez@email.com',
      votoPresidencial: 'Keiko Fujimori',
      votoRegional: 'Rafael López Aliaga',
      votoDistrital: 'Nancy Vizurraga',
      estado: 'Activo',
      fechaRegistro: '2024-01-15'
    },
    { 
      id: 2, 
      dni: '87654321', 
      nombre: 'María López Ruiz', 
      edad: 38, 
      distrito: 'Miraflores',
      departamento: 'Lima',
      provincia: 'Lima',
      direccion: 'Jr. Los Olivos 456',
      telefono: '987123456',
      email: 'maria.lopez@email.com',
      votoPresidencial: 'Pedro Castillo',
      votoRegional: 'Kimberly Gutiérrez',
      votoDistrital: 'Luis Molina',
      estado: 'Activo',
      fechaRegistro: '2024-02-20'
    },
    { 
      id: 3, 
      dni: '45678912', 
      nombre: 'Carlos Mendoza', 
      edad: 29, 
      distrito: 'Surco',
      departamento: 'Lima',
      provincia: 'Lima',
      direccion: 'Calle Las Flores 789',
      telefono: '965874123',
      email: 'carlos.mendoza@email.com',
      votoPresidencial: 'Hernando de Soto',
      votoRegional: 'Werner Salcedo',
      votoDistrital: 'Marco Álvarez',
      estado: 'Activo',
      fechaRegistro: '2024-03-10'
    },
    { 
      id: 4, 
      dni: '78912345', 
      nombre: 'Ana Torres Vega', 
      edad: 'null', 
      distrito: 'La Molina',
      departamento: 'Lima',
      provincia: 'Lima',
      direccion: 'Av. La Universidad 321',
      telefono: '912345678',
      email: 'ana.torres@email.com',
      votoPresidencial: 'Rafael López Aliaga',
      votoRegional: 'Servando García',
      votoDistrital: 'Álvaro Paz',
      estado: 'Inactivo',
      fechaRegistro: '2024-04-05'
    },
    { 
      id: 5, 
      dni: '32165498', 
      nombre: 'Pedro Ramírez', 
      edad: 33, 
      distrito: 'San Borja',
      departamento: 'Lima',
      provincia: 'Lima',
      direccion: 'Jr. San Luis 654',
      telefono: '923456789',
      email: 'pedro.ramirez@email.com',
      votoPresidencial: 'Pedro Castillo',
      votoRegional: 'César Acuña',
      votoDistrital: 'Carla García',
      estado: 'Activo',
      fechaRegistro: '2024-05-12'
    },
  ];

  // Combinar datos iniciales con datos del localStorage
  const todosLosVotantes = [...votantesIniciales, ...votantes];

  // Filtrar por tipo de elección
  const currentData = todosLosVotantes.filter(votante => {
    if (activeTab === 'presidencial') return votante.votoPresidencial !== 'No votó';
    if (activeTab === 'regional') return votante.votoRegional !== 'No votó';
    if (activeTab === 'distrital') return votante.votoDistrital !== 'No votó';
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getEstadoColor = (estado) => {
    return estado === 'Activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getEstadoIcon = (estado) => {
    return estado === 'Activo'
      ? <CheckCircle size={14} className="text-green-600" />
      : <XCircle size={14} className="text-red-600" />;
  };

  // Filtrar por búsqueda
  const datosFiltrados = currentData.filter(row => 
    row.dni.includes(searchTerm) || 
    row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.distrito.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6 p-6 bg-gray-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Título y pestañas */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Registro de Votantes por Nivel Electoral</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cargarVotantes}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={18} />
            Actualizar
          </motion.button>
        </div>
        
        <motion.div 
          className="flex flex-wrap gap-2 border-b border-gray-200"
          variants={containerVariants}
        >
          <button
            onClick={() => { setActiveTab('presidencial'); setSelectedRows([]); setSearchTerm(''); }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'presidencial'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            Presidencial
          </button>
          <button
            onClick={() => { setActiveTab('regional'); setSelectedRows([]); setSearchTerm(''); }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'regional'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            Regional
          </button>
          <button
            onClick={() => { setActiveTab('distrital'); setSelectedRows([]); setSearchTerm(''); }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'distrital'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            Distrital
          </button>
        </motion.div>
      </motion.div>

      {/* Estadísticas Rápidas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Votantes</p>
          <p className="text-3xl font-bold text-gray-800">{todosLosVotantes.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Activos</p>
          <p className="text-3xl font-bold text-green-600">
            {todosLosVotantes.filter(d => d.estado === 'Activo').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Inactivos</p>
          <p className="text-3xl font-bold text-red-600">
            {todosLosVotantes.filter(d => d.estado === 'Inactivo').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Seleccionados</p>
          <p className="text-3xl font-bold text-indigo-600">{selectedRows.length}</p>
        </div>
      </motion.div>

      {/* Tabla Principal */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-800">
              {activeTab === 'presidencial' && 'Votantes - Elección Presidencial'}
              {activeTab === 'regional' && 'Votantes - Elección Regional'}
              {activeTab === 'distrital' && 'Votantes - Elección Distrital'}
            </h3>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por DNI, nombre, distrito, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span className="hidden md:inline">Filtros</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Download size={18} />
                <span className="hidden md:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Acciones en lote */}
          {selectedRows.length > 0 && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-800">
                {selectedRows.length} votante(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50 flex items-center gap-1">
                  <Edit size={16} /> Editar
                </button>
                <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === datosFiltrados.length && datosFiltrados.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Edad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Distrito</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  {activeTab === 'presidencial' && 'Voto Presidencial'}
                  {activeTab === 'regional' && 'Voto Regional'}
                  {activeTab === 'distrital' && 'Voto Distrital'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosFiltrados.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.dni}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.edad}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.distrito}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.direccion || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.telefono || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-indigo-700">
                    {activeTab === 'presidencial' && (row.votoPresidencial || 'No votó')}
                    {activeTab === 'regional' && (row.votoRegional || 'No votó')}
                    {activeTab === 'distrital' && (row.votoDistrital || 'No votó')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.fechaRegistro}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(row.estado)}`}>
                      {getEstadoIcon(row.estado)}
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{datosFiltrados.length}</span> de{' '}
            <span className="font-medium">{datosFiltrados.length}</span> registros
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-white transition-colors">Anterior</button>
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">1</button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-white transition-colors">Siguiente</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GestionDatos;