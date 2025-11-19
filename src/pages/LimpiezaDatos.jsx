import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Zap, RefreshCw, Database, Play, Filter, FileText, Search, Trash2, Edit, Calendar, Hash, User, Mail, Phone, MapPin, BarChart3, Copy, MinusCircle, Vote, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LimpiezaDatos = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dataAnalyzed, setDataAnalyzed] = useState(false);
  
  // Estados para datasets temporales
  const [datasetsTemporales, setDatasetsTemporales] = useState([]);
  const [datasetSeleccionado, setDatasetSeleccionado] = useState(null);
  const [cargandoDatasets, setCargandoDatasets] = useState(true);

  // Cargar datasets temporales al montar el componente
  useEffect(() => {
    cargarDatasetsTemporales();
  }, []);

  const cargarDatasetsTemporales = async () => {
    setCargandoDatasets(true);
    try {
      const datasetsGuardados = localStorage.getItem('datasetsTemporales');
      
      if (datasetsGuardados) {
        const datasets = JSON.parse(datasetsGuardados);
        const datasetsPendientes = datasets.filter(d => d.estado !== 'Procesado');
        setDatasetsTemporales(datasetsPendientes);
        
        if (datasetsPendientes.length > 0) {
          setDatasetSeleccionado(datasetsPendientes[0]);
        }
      } else {
        setDatasetsTemporales([]);
      }
    } catch (error) {
      console.error('Error al cargar datasets:', error);
      setDatasetsTemporales([]);
    } finally {
      setCargandoDatasets(false);
    }
  };

  // Calcular issues según el dataset seleccionado
  const issues = datasetSeleccionado ? [
    { id: 1, type: 'Duplicados', count: datasetSeleccionado.registros_duplicados || 0, severity: 'high', color: 'red' },
    { id: 2, type: 'Valores Nulos', count: datasetSeleccionado.registros_con_errores || 0, severity: 'medium', color: 'yellow' },
    { id: 3, type: 'Valores Correctos', count: datasetSeleccionado.registros_validos || 0, severity: 'check', color: 'green' },
    { id: 4, type: 'Score Calidad', count: datasetSeleccionado.registros_validos ? `${Math.round((datasetSeleccionado.registros_validos / datasetSeleccionado.registros_totales) * 100)}%` : '0%', severity: 'check', color: 'green' },
    { id: 5, type: 'Datos a Normalizar', count: Math.floor((datasetSeleccionado.registros_totales || 0) * 0.08), severity: 'medium', color: 'blue' },
  ] : [];

  const cleaningActions = [
    { id: 1, name: 'Analizar datos', description: 'Analizar la calidad y estructura de los datos', icon: BarChart3 },
    { id: 2, name: 'Quitar duplicados', description: 'Remover registros duplicados basándose en DNI', icon: Copy },
    { id: 3, name: 'Limpiar datos null', description: 'Rellenar o eliminar valores nulos', icon: MinusCircle },
    { id: 4, name: 'Normalizar Datos', description: 'Ajustar los valores para que estén en la misma escala', icon: MinusCircle },
  ];

  const sampleData = [
    { id: 1, dni: '72345678', nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+51 987654321', direccion: 'Av. Corrientes 1000, Lima', fechaRegistro: '2024-11-15', estado: 'valido', lastCleaned: '2024-11-18' },
    { id: 2, dni: '12345678', nombre: 'María García', email: 'maria.garcia@email.com', telefono: '+51 976543210', direccion: 'Santa Fe 2000, Lima', fechaRegistro: '2024-11-14', estado: 'valido', lastCleaned: '2024-11-18' },
    { id: 3, dni: '72345678', nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+51 987654321', direccion: 'Av. Corrientes 1000, Lima', fechaRegistro: '2024-11-15', estado: 'duplicado', lastCleaned: null },
    { id: 4, dni: '23456789', nombre: 'Carlos López', email: 'carlos.lopez@email', telefono: '15-1111-2222', direccion: 'Córdoba 500, Lima', fechaRegistro: '2024-11-13', estado: 'con-errores', lastCleaned: null },
    { id: 5, dni: '', nombre: 'Ana Martínez', email: 'ana.martinez@email.com', telefono: '+51 965874123', direccion: 'Rivadavia 3000, Lima', fechaRegistro: '2024-11-12', estado: 'incompleto', lastCleaned: null },
    { id: 6, dni: '34567890', nombre: 'Laura Fernández', email: 'laura.fernandez@email.com', telefono: '+51 954321098', direccion: 'Belgrano 1500, Lima', fechaRegistro: '2024-11-16', estado: 'valido', lastCleaned: '2024-11-18' },
    { id: 7, dni: '45678901', nombre: 'Roberto Díaz', email: 'roberto.diaz@email.com', telefono: '+51 943210987', direccion: 'Corrientes 2500, Lima', fechaRegistro: '2024-11-17', estado: 'valido', lastCleaned: '2024-11-18' },
    { id: 8, dni: '56789012', nombre: 'Sofía González', email: 'sofia.gonzalez@email.com', telefono: '+51 932109876', direccion: 'Lavalle 1200, Lima', fechaRegistro: '2024-11-18', estado: 'valido', lastCleaned: '2024-11-18' },
  ];

  const filteredData = datasetSeleccionado 
    ? sampleData.filter(item => {
        const matchesSearch = Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = filterStatus === 'all' || item.estado === filterStatus;
        return matchesSearch && matchesFilter;
      })
    : [];

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(249, 250, 251, 1)",
      transition: {
        duration: 0.2
      }
    }
  };

  const handleCleaningAction = (actionId) => {
    if (isProcessing) return;
    
    if (!datasetSeleccionado) {
      alert('Por favor, selecciona un dataset primero');
      return;
    }
    
    setIsProcessing(true);
    setCurrentProcessingStep(actionId);
    
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, actionId]);
      setIsProcessing(false);
      setCurrentProcessingStep(null);
      
      if (actionId === 1) {
        setDataAnalyzed(true);
      }
    }, 1500);
  };

  const enviarATablaFinal = () => {
    const tablaDestino = `votantes_${datasetSeleccionado.tipo_eleccion}`;
    
    if (confirm(`⚠️ ADVERTENCIA: Esta acción eliminará TODOS los datos actuales en la tabla "${tablaDestino}" y los reemplazará con los datos limpios.\n\n¿Estás seguro de continuar?`)) {
      setIsProcessing(true);
      
      setTimeout(() => {
        const datasetsTemporales = JSON.parse(localStorage.getItem('datasetsTemporales') || '[]');
        const datasetsActualizados = datasetsTemporales.map(d => 
          d.id === datasetSeleccionado.id 
            ? { ...d, estado: 'Procesado' }
            : d
        );
        localStorage.setItem('datasetsTemporales', JSON.stringify(datasetsActualizados));
        
        alert(`✅ ¡Éxito!\n\n` +
              `Se han reemplazado ${datasetSeleccionado.registros_validos} registros en la tabla "${tablaDestino}".\n\n` +
              `Detalles:\n` +
              `- Registros eliminados: ${datasetSeleccionado.registros_totales}\n` +
              `- Registros insertados: ${datasetSeleccionado.registros_validos}\n` +
              `- Duplicados eliminados: ${datasetSeleccionado.registros_duplicados}\n` +
              `- Errores corregidos: ${datasetSeleccionado.registros_con_errores}`
        );
        
        cargarDatasetsTemporales();
        setCompletedSteps([]);
        setDataAnalyzed(false);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch(status) {
      case 'valido':
        return <motion.span 
          className={`${baseClasses} bg-green-100 text-green-800`}
          whileHover={{ scale: 1.05 }}
        >Válido</motion.span>;
      case 'duplicado':
        return <motion.span 
          className={`${baseClasses} bg-red-100 text-red-800`}
          whileHover={{ scale: 1.05 }}
        >Duplicado</motion.span>;
      case 'con-errores':
        return <motion.span 
          className={`${baseClasses} bg-yellow-100 text-yellow-800`}
          whileHover={{ scale: 1.05 }}
        >Con errores</motion.span>;
      case 'incompleto':
        return <motion.span 
          className={`${baseClasses} bg-blue-100 text-blue-800`}
          whileHover={{ scale: 1.05 }}
        >Incompleto</motion.span>;
      default:
        return <motion.span 
          className={`${baseClasses} bg-gray-100 text-gray-800`}
          whileHover={{ scale: 1.05 }}
        >Desconocido</motion.span>;
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Selector de Dataset Temporal - VERSIÓN COMPACTA */}
      <motion.div 
        variants={cardVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="p-2 bg-indigo-100 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Database className="text-indigo-600" size={24} />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">Dataset a Procesar</h3>
            <p className="text-sm text-gray-600">Selecciona el dataset temporal que deseas limpiar</p>
          </div>
          <motion.button
            onClick={cargarDatasetsTemporales}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Actualizar
          </motion.button>
        </div>

        {cargandoDatasets ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <RefreshCw className="text-indigo-600" size={32} />
            </motion.div>
            <p className="text-gray-600 mt-2">Cargando datasets...</p>
          </div>
        ) : datasetsTemporales.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Database size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No hay datasets pendientes de limpieza</p>
            <p className="text-sm text-gray-500 mt-1">Ve a "Importar Datos" para cargar un nuevo dataset</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Dropdown Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Seleccionado
              </label>
              <select
                value={datasetSeleccionado?.id || ''}
                onChange={(e) => {
                  const selected = datasetsTemporales.find(d => d.id === parseInt(e.target.value));
                  setDatasetSeleccionado(selected);
                  setCompletedSteps([]); // Reset pasos al cambiar dataset
                  setDataAnalyzed(false);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-800 font-medium appearance-none cursor-pointer"
              >
                <option value="">Selecciona un dataset...</option>
                {datasetsTemporales.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.nombre} - {dataset.tipo_eleccion.toUpperCase()} ({dataset.registros_totales.toLocaleString()} registros)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Contador de Datasets Pendientes */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">
                  Datasets pendientes de limpieza:
                </span>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                {datasetsTemporales.length}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Botones de Acciones Principales */}
      <motion.div 
        variants={cardVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            className="p-2 bg-slate-100 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap className="text-slate-600" size={24} />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">Acciones de Limpieza</h3>
            <p className="text-sm text-gray-600">
              {datasetSeleccionado 
                ? `Procesando: ${datasetSeleccionado.nombre} (${datasetSeleccionado.tipo_eleccion})`
                : 'Selecciona un dataset para comenzar'
              }
            </p>
          </div>
          {datasetSeleccionado && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
            >
              ✓ Dataset Seleccionado
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {cleaningActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={() => handleCleaningAction(action.id)}
                disabled={isProcessing || !datasetSeleccionado}
                className={`p-6 border-2 rounded-xl transition-all flex flex-col items-center justify-center gap-3 ${
                  completedSteps.includes(action.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-slate-500 hover:bg-slate-50'
                } ${(isProcessing || !datasetSeleccionado) ? 'cursor-not-allowed opacity-75' : ''}`}
                variants={itemVariants}
                whileHover={!isProcessing && datasetSeleccionado ? { scale: 1.02 } : {}}
                whileTap={!isProcessing && datasetSeleccionado ? { scale: 0.98 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={`p-3 rounded-lg ${
                    completedSteps.includes(action.id) ? 'bg-green-100' : 'bg-slate-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentProcessingStep === action.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className={
                        completedSteps.includes(action.id) ? 'text-green-600' : 'text-slate-600'
                      } size={24} />
                    </motion.div>
                  ) : (
                    <Icon className={
                      completedSteps.includes(action.id) ? 'text-green-600' : 'text-slate-600'
                    } size={24} />
                  )}
                </motion.div>
                <div className="text-center">
                  <p className={`font-semibold text-base ${
                    completedSteps.includes(action.id) ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {action.name}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{action.description}</p>
                </div>
                <AnimatePresence>
                  {completedSteps.includes(action.id) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <CheckCircle className="text-green-600" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Botón Final para Enviar a Tabla */}
        {completedSteps.length === 4 && datasetSeleccionado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-green-800 mb-1">
                  ✅ Limpieza Completada
                </h4>
                <p className="text-sm text-green-700">
                  Todos los pasos de limpieza han sido completados. 
                  Ahora puedes enviar los datos a la tabla <strong>votantes_{datasetSeleccionado.tipo_eleccion}</strong>
                </p>
              </div>
              <motion.button
                onClick={enviarATablaFinal}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Database size={20} />
                Enviar a Tabla Final
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Resumen de Problemas */}
      <AnimatePresence>
        {dataAnalyzed && datasetSeleccionado && (
          <motion.div 
            variants={cardVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="p-2 bg-amber-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <AlertTriangle className="text-amber-600" size={24} />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Resumen de Problemas</h3>
                <p className="text-sm text-gray-600">Problemas detectados en los datos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {issues.map((issue, index) => (
                <motion.div 
                  key={issue.id} 
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className={`text-${issue.color}-500`} size={20} />
                    <motion.span 
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-${issue.color}-100 text-${issue.color}-800`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {issue.severity === 'high' ? 'Alta' : issue.severity === 'medium' ? 'Media' : 'Listo'}
                    </motion.span>
                  </div>
                  <p className="text-xs text-gray-600">{issue.type}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{issue.count}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla de Datos */}
      <motion.div 
        variants={cardVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-blue-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <FileText className="text-blue-600" size={24} />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Vista de Datos</h3>
                <p className="text-sm text-gray-600">
                  {datasetSeleccionado 
                    ? `Mostrando datos de: ${datasetSeleccionado.nombre}`
                    : 'Selecciona un dataset para ver los datos'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <motion.input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              <motion.select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                whileHover={{ scale: 1.05 }}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="all">Todos los estados</option>
                <option value="valido">Válidos</option>
                <option value="duplicado">Duplicados</option>
                <option value="con-errores">Con errores</option>
                <option value="incompleto">Incompletos</option>
              </motion.select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Hash size={14} />
                    <span>ID</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Nombre</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>DNI</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>Teléfono</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Dirección</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Fecha</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <motion.tr 
                    key={item.id} 
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">{item.dni || <span className="text-red-500">Sin DNI</span>}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.telefono}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.direccion}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.fechaRegistro}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(item.estado)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    {datasetSeleccionado 
                      ? 'No se encontraron registros con los filtros aplicados'
                      : 'Selecciona un dataset para ver los datos'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <motion.div 
          className="px-6 py-3 border-t border-gray-200 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredData.length}</span> de{' '}
            <span className="font-medium">{sampleData.length}</span> resultados
          </div>
          <div className="flex gap-2">
            <motion.button 
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Anterior
            </motion.button>
            <motion.button 
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Siguiente
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Registro de Actividades */}
      <AnimatePresence>
        {dataAnalyzed && datasetSeleccionado && (
          <motion.div 
            variants={cardVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Registro de Limpieza</h3>
            <div className="space-y-3">
              {[
                { id: 1, text: `${datasetSeleccionado.registros_duplicados} duplicados eliminados`, time: 'Hace 5 minutos', color: 'green' },
                { id: 2, text: `${datasetSeleccionado.registros_con_errores} valores nulos rellenados`, time: 'Hace 12 minutos', color: 'green' },
                { id: 3, text: 'Análisis de datos completado', time: 'Hace 20 minutos', color: 'blue' }
              ].map((log, index) => (
                <motion.div 
                  key={log.id}
                  className={`flex items-start gap-3 p-3 bg-${log.color}-50 border border-${log.color}-200 rounded-lg`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {log.color === 'green' ? (
                    <CheckCircle className="text-green-600 mt-0.5" size={18} />
                  ) : (
                    <RefreshCw className="text-blue-600 mt-0.5" size={18} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{log.text}</p>
                    <p className="text-xs text-gray-600">{log.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LimpiezaDatos;