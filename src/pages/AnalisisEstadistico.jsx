import { useState } from 'react';
import {
  TrendingUp,
  Calculator,
  BarChart2,
  Activity,
  Vote,
  MapPin,
  Users,
  ChevronDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalisisEstadistico = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('descriptivo');
  const [electionType, setElectionType] = useState('presidencial');

  const estadisticas = {
    descriptivas: [
      { label: 'Media de Edad', value: '38.5 años', icon: Calculator, color: 'blue' },
      { label: 'Mediana', value: '36 años', icon: Activity, color: 'green' },
      { label: 'Desviación Estándar', value: '±12.3', icon: TrendingUp, color: 'purple' },
      { label: 'Moda', value: '42 años', icon: BarChart2, color: 'orange' },
    ],
    distribucion: [
      { rango: '18-25', cantidad: 12430, porcentaje: 18.5 },
      { rango: '26-35', cantidad: 23450, porcentaje: 34.8 },
      { rango: '36-45', cantidad: 18920, porcentaje: 28.1 },
      { rango: '46-55', cantidad: 9840, porcentaje: 14.6 },
      { rango: '56+', cantidad: 2690, porcentaje: 4.0 },
    ],
    distritos: [
      { nombre: 'Lima', votantes: 45230, porcentaje: 36.1 },
      { nombre: 'Callao', votantes: 28450, porcentaje: 22.7 },
      { nombre: 'Arequipa', votantes: 18920, porcentaje: 15.1 },
      { nombre: 'Cusco', votantes: 15340, porcentaje: 12.2 },
      { nombre: 'Otros', votantes: 17490, porcentaje: 13.9 },
    ],
  };

  const modelos = {
    presidencial: {
      activo: 'Random Forest',
      metricas: { r2: '0.889', rmse: '3.87', precision: '93.5%', f1: '0.92' },
      participacion: '81.2%',
      factores: [
        { label: 'Edad', percentage: 38, color: 'slate' },
        { label: 'Educación', percentage: 31, color: 'blue' },
        { label: 'Distrito', percentage: 22, color: 'purple' },
        { label: 'Otros', percentage: 9, color: 'green' },
      ],
    },
    regional: {
      activo: 'XGBoost',
      metricas: { r2: '0.847', rmse: '4.23', precision: '91.2%', f1: '0.89' },
      participacion: '76.8%',
      factores: [
        { label: 'Ubicación', percentage: 42, color: 'slate' },
        { label: 'Edad', percentage: 28, color: 'blue' },
        { label: 'Ingresos', percentage: 18, color: 'purple' },
        { label: 'Otros', percentage: 12, color: 'green' },
      ],
    },
    distrital: {
      activo: 'Regresión Logística',
      metricas: { r2: '0.792', rmse: '5.11', precision: '88.7%', f1: '0.85' },
      participacion: '73.5%',
      factores: [
        { label: 'Proximidad', percentage: 45, color: 'slate' },
        { label: 'Edad', percentage: 25, color: 'blue' },
        { label: 'Demografía', percentage: 20, color: 'purple' },
        { label: 'Otros', percentage: 10, color: 'green' },
      ],
    },
  };

  const electionOptions = [
    { value: 'presidencial', label: 'Elección Presidencial', icon: Vote },
    { value: 'regional', label: 'Elección Regional', icon: MapPin },
    { value: 'distrital', label: 'Elección Distrital', icon: Users },
  ];

  const currentIcon = electionOptions.find(opt => opt.value === electionType)?.icon || Vote;

  const AnalisisDescriptivo = () => (
    <motion.div
      key="descriptivo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Tarjetas de estadísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estadisticas.descriptivas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`inline-flex p-3 bg-${stat.color}-100 rounded-lg mb-3`}>
                <Icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Distribución por rango de edad */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Rango de Edad</h3>
        <div className="space-y-4">
          {estadisticas.distribucion.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.rango} años</span>
                <span className="text-sm text-gray-600">
                  {item.cantidad.toLocaleString()} ({item.porcentaje}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-slate-500 to-slate-700 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.porcentaje * 2.5}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Votantes por distrito y Resumen estadístico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Votantes por distrito */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Votantes por Distrito</h3>
          <div className="space-y-3">
            {estadisticas.distritos.map((distrito, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{distrito.nombre}</p>
                  <p className="text-xs text-gray-600">{distrito.porcentaje}% del total</p>
                </div>
                <p className="text-lg font-bold text-slate-600">
                  {distrito.votantes.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resumen estadístico */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Estadístico</h3>
          <div className="space-y-4">
            {[
              { color: 'blue', title: 'Coeficiente de Variación', value: '31.95%', desc: 'Variabilidad moderada' },
              { color: 'green', title: 'Asimetría', value: '0.35', desc: 'Distribución ligeramente sesgada' },
              { color: 'purple', title: 'Curtosis', value: '-0.82', desc: 'Distribución platicúrtica' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`p-4 bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className={`text-sm text-${stat.color}-800 font-medium`}>{stat.title}</p>
                <p className={`text-2xl font-bold text-${stat.color}-900 mt-1`}>{stat.value}</p>
                <p className={`text-xs text-${stat.color}-700 mt-1`}>{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const AnalisisPredictivo = () => {
    const modeloActual = modelos[electionType];

    return (
      <motion.div
        key="predictivo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modelo activo */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Modelo Activo - {electionType.charAt(0).toUpperCase() + electionType.slice(1)}
            </h3>
            <div className="p-4 border-2 border-slate-500 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800">{modeloActual.activo}</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Activo
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(modeloActual.metricas).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-600 uppercase">{key}</p>
                    <p className="text-lg font-bold text-slate-600">{value}</p>
                  </div>
                ))}
              </div>
              <motion.button
                className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Detalles del Modelo
              </motion.button>
            </div>
          </motion.div>

          {/* Predicciones y factores */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Predicciones</h3>

            <motion.div
              className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm font-medium text-gray-700 mb-2">Participación Estimada 2026</p>
              <p className="text-3xl font-bold text-slate-900">{modeloActual.participacion}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                <TrendingUp size={14} />
                <span>+{(parseFloat(modeloActual.participacion) - 75).toFixed(1)}% vs 2021</span>
              </div>
            </motion.div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Factores Principales</p>
              <div className="space-y-3">
                {modeloActual.factores.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{factor.label}</span>
                      <span className="font-semibold">{factor.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`bg-${factor.color}-500 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Selector de tipo de análisis + Dropdown de elección */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { id: 'descriptivo', label: 'Análisis Descriptivo', description: 'Estadísticas básicas', icon: Calculator },
            { id: 'predictivo', label: 'Análisis Predictivo', description: 'Modelos y predicciones', icon: Activity },
          ].map((analysis) => (
            <motion.button
              key={analysis.id}
              onClick={() => setSelectedAnalysis(analysis.id)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                selectedAnalysis === analysis.id
                  ? 'border-slate-500 bg-slate-50'
                  : 'border-gray-200 hover:border-slate-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <analysis.icon
                className={`mb-2 ${selectedAnalysis === analysis.id ? 'text-slate-600' : 'text-gray-400'}`}
                size={32}
              />
              <p className="font-medium text-gray-800">{analysis.label}</p>
              <p className="text-xs text-gray-600 mt-1">{analysis.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Dropdown tipo de elección */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Elección
          </label>
          <div className="relative">
            <select
              value={electionType}
              onChange={(e) => setElectionType(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pl-12 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all cursor-pointer hover:border-slate-400"
            >
              {electionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <currentIcon className="text-slate-600" size={20} />
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-gray-500" size={20} />
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Los datos y modelos se actualizan según la elección seleccionada.
          </p>
        </div>
      </motion.div>

      {/* Contenido según selección */}
      <div>
        {selectedAnalysis === 'descriptivo' && <AnalisisDescriptivo />}
        {selectedAnalysis === 'predictivo' && <AnalisisPredictivo />}
      </div>
    </div>
  );
};

export default AnalisisEstadistico;