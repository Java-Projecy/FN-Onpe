import { useState } from 'react';
import { TrendingUp, Calculator, BarChart2, PieChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalisisEstadistico = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('descriptivo');

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
    ]
  };

  // Animaciones simplificadas
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

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Contenido de cada análisis
  const AnalisisDescriptivo = () => (
    <motion.div
      key="descriptivo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Estadísticas Descriptivas */}
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

      {/* Distribución por Edad */}
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

      {/* Distribución por Distrito */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              { color: 'purple', title: 'Curtosis', value: '-0.82', desc: 'Distribución platicúrtica' }
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

  const AnalisisPredictivo = () => (
    <motion.div
      key="predictivo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Modelos de Predicción</h3>
        <div className="space-y-4">
          {[
            { 
              title: 'Regresión Lineal', 
              active: true, 
              metrics: [
                { label: 'R² Score', value: '0.847' },
                { label: 'RMSE', value: '4.23' }
              ]
            },
            { 
              title: 'Random Forest', 
              active: false,
              metrics: [
                { label: 'Precisión', value: '92.3%' },
                { label: 'F1-Score', value: '0.91' }
              ]
            },
            { 
              title: 'XGBoost', 
              active: false,
              metrics: [
                { label: 'Precisión', value: '94.1%' },
                { label: 'F1-Score', value: '0.93' }
              ]
            }
          ].map((model, index) => (
            <motion.div 
              key={index}
              className={`p-4 border-2 ${model.active ? 'border-slate-500 bg-slate-50' : 'border-gray-200'} rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800">{model.title}</p>
                {model.active && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Activo
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {model.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-gray-600">{metric.label}</p>
                    <p className={`text-lg font-bold ${model.active ? 'text-slate-600' : 'text-gray-800'}`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
              {model.active && (
                <motion.button 
                  className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Detalles
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Predicciones</h3>
        <div className="space-y-4">
          <motion.div 
            className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm font-medium text-gray-700 mb-2">Participación Estimada 2024</p>
            <p className="text-3xl font-bold text-slate-900">78.5%</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
              <TrendingUp size={14} />
              <span>+3.2% respecto a 2020</span>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 border border-gray-200 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm font-medium text-gray-700 mb-3">Factores Principales</p>
            <div className="space-y-2">
              {[
                { label: 'Edad', percentage: 35, color: 'slate' },
                { label: 'Distrito', percentage: 28, color: 'blue' },
                { label: 'Nivel Educativo', percentage: 22, color: 'purple' },
                { label: 'Otros', percentage: 15, color: 'green' }
              ].map((factor, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span>{factor.label}</span>
                    <span className="font-medium">{factor.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`bg-${factor.color}-500 h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.percentage}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Selector de Tipo de Análisis */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'descriptivo', label: 'Análisis Descriptivo', description: 'Estadísticas básicas', icon: Calculator },
            { id: 'predictivo', label: 'Análisis Predictivo', description: 'Modelos y predicciones', icon: Activity }
          ].map((analysis, index) => (
            <motion.button
              key={analysis.id}
              onClick={() => setSelectedAnalysis(analysis.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAnalysis === analysis.id
                  ? 'border-slate-500 bg-slate-50'
                  : 'border-gray-200 hover:border-slate-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <analysis.icon className={`mx-auto mb-2 ${
                selectedAnalysis === analysis.id ? 'text-slate-600' : 'text-gray-400'
              }`} size={32} />
              <p className="font-medium text-gray-800">{analysis.label}</p>
              <p className="text-xs text-gray-600 mt-1">{analysis.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Contenido del Análisis Seleccionado */}
      <div>
        {selectedAnalysis === 'descriptivo' && <AnalisisDescriptivo />}
        {selectedAnalysis === 'predictivo' && <AnalisisPredictivo />}
      </div>
    </div>
  );
};

export default AnalisisEstadistico; 