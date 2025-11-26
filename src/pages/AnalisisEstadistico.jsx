import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Play,
  Zap,
  TrendingUp,
  Target,
  Calculator,
  Activity,
  BarChart2,
  Vote,
  MapPin,
  Users,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

const AnalisisEstadistico = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('descriptivo');
  const [electionType, setElectionType] = useState('presidencial');
  const [modeloActual, setModeloActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entrenando, setEntrenando] = useState(false);

  // Datos estadísticos descriptivos (siempre disponibles)
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

  const electionOptions = [
    { value: 'presidencial', label: 'Elección Presidencial', icon: Vote },
    { value: 'regional', label: 'Elección Regional', icon: MapPin },
    { value: 'distrital', label: 'Elección Distrital', icon: Users },
  ];

  // Cargar modelo cuando cambia el tipo de elección
  useEffect(() => {
    if (selectedAnalysis === 'predictivo') {
      cargarModeloActivo();
    }
  }, [electionType, selectedAnalysis]);

  const cargarModeloActivo = async () => {
    setLoading(true);
    try {
      // DEMO: Simulación de carga de modelo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simular que NO hay modelo al inicio (realista)
      setModeloActual(null);
      
    } catch (error) {
      console.error('Error cargando modelo:', error);
      setModeloActual(null);
    } finally {
      setLoading(false);
    }
  };

  const entrenarModelo = async () => {
    setEntrenando(true);
    try {
      // DEMO: Simulación de entrenamiento (2.5 segundos)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Datos del modelo recién entrenado
      const modelosEntrenados = {
        presidencial: {
          modelo_activo: 'Random Forest (2024-11-26)',
          metricas: {
            'R²': '0.87',
            'RMSE': '3.2%',
            'Precisión': '89.4%',
            'F1-Score': '0.91'
          },
          participacion_estimada: '78.5%',
          feature_importance: {
            'Participación histórica': 0.32,
            'Región geográfica': 0.24,
            'Partido político': 0.18,
            'Tendencia temporal': 0.15,
            'Factor demográfico': 0.11
          }
        },
        regional: {
          modelo_activo: 'XGBoost (2024-11-26)',
          metricas: {
            'R²': '0.82',
            'RMSE': '4.1%',
            'Precisión': '85.2%',
            'F1-Score': '0.87'
          },
          participacion_estimada: '72.3%',
          feature_importance: {
            'Participación histórica': 0.35,
            'Región geográfica': 0.28,
            'Partido político': 0.20,
            'Tendencia temporal': 0.12,
            'Factor demográfico': 0.05
          }
        },
        distrital: {
          modelo_activo: 'Logistic Regression (2024-11-26)',
          metricas: {
            'R²': '0.79',
            'RMSE': '4.8%',
            'Precisión': '81.7%',
            'F1-Score': '0.83'
          },
          participacion_estimada: '68.9%',
          feature_importance: {
            'Participación histórica': 0.38,
            'Región geográfica': 0.25,
            'Partido político': 0.17,
            'Tendencia temporal': 0.11,
            'Factor demográfico': 0.09
          }
        }
      };

      setModeloActual(modelosEntrenados[electionType]);
      alert(`✅ Modelo ${electionType} entrenado exitosamente!`);
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setEntrenando(false);
    }
  };

  // ============= COMPONENTE: ANÁLISIS DESCRIPTIVO =============
  const AnalisisDescriptivo = () => (
    <motion.div
      key="descriptivo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

      {/* Distribución por edad */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Rango de Edad</h3>
        <div className="space-y-4">
          {estadisticas.distribucion.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.rango} años</span>
                <span className="text-sm text-gray-600">
                  {item.cantidad.toLocaleString()} ({item.porcentaje}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-slate-500 to-slate-700 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.porcentaje * 2.5}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Votantes por distrito */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Votantes por Distrito</h3>
        <div className="space-y-3">
          {estadisticas.distritos.map((distrito, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{distrito.nombre}</p>
                <p className="text-xs text-gray-600">{distrito.porcentaje}% del total</p>
              </div>
              <p className="text-lg font-bold text-slate-600">
                {distrito.votantes.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // ============= COMPONENTE: ANÁLISIS PREDICTIVO =============
  const AnalisisPredictivo = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="mx-auto animate-spin text-purple-600 mb-3" size={32} />
            <p className="text-gray-600">Cargando modelo...</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        key="predictivo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Botón de entrenamiento */}
        <motion.button
          onClick={entrenarModelo}
          disabled={entrenando}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: entrenando ? 1 : 1.02 }}
          whileTap={{ scale: entrenando ? 1 : 0.98 }}
        >
          {entrenando ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={20} />
              Entrenando modelo de {electionType}...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Play size={20} />
              Entrenar Modelo {electionType.charAt(0).toUpperCase() + electionType.slice(1)}
            </span>
          )}
        </motion.button>

        {/* Mostrar modelo si existe */}
        {modeloActual ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modelo activo */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-purple-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Modelo Activo</h3>
              </div>

              <div className="p-4 border-2 border-slate-500 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-800">{modeloActual.modelo_activo}</p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Activo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(modeloActual.metricas).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-medium mb-1">{key}</p>
                      <p className="text-xl font-bold text-slate-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Predicciones */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Predicciones</h3>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Participación Estimada 2026
                </p>
                <p className="text-4xl font-bold text-purple-700">
                  {modeloActual.participacion_estimada}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Factores Principales</p>
                <div className="space-y-3">
                  {Object.entries(modeloActual.feature_importance).map(([label, value], index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{label}</span>
                        <span className="font-bold text-purple-700">{(value * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // Sin modelo entrenado
          <motion.div
            className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={56} />
            <p className="text-gray-600 font-medium mb-2">
              No hay modelo entrenado para {electionType}
            </p>
            <p className="text-sm text-gray-500">
              Haz clic en "Entrenar Modelo" para comenzar el análisis predictivo
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Obtener el ícono actual
  const CurrentIcon = electionOptions.find(opt => opt.value === electionType)?.icon || Vote;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={28} />
          <h1 className="text-2xl font-bold">Análisis Estadístico Electoral</h1>
        </div>
        <p className="text-purple-100">
          Estadísticas descriptivas y modelos predictivos de participación electoral
        </p>
      </div>

      {/* Selector de análisis y elección */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Análisis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { id: 'descriptivo', label: 'Análisis Descriptivo', description: 'Estadísticas básicas', icon: Calculator },
            { id: 'predictivo', label: 'Análisis Predictivo', description: 'Modelos ML', icon: Activity },
          ].map((analysis) => {
            const Icon = analysis.icon;
            return (
              <motion.button
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis.id)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                  selectedAnalysis === analysis.id
                    ? 'border-slate-500 bg-slate-50'
                    : 'border-gray-200 hover:border-slate-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={selectedAnalysis === analysis.id ? 'text-slate-600' : 'text-gray-400'}
                  size={32}
                />
                <p className="font-medium text-gray-800 mt-2">{analysis.label}</p>
                <p className="text-xs text-gray-600 mt-1">{analysis.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Dropdown tipo de elección */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Elección
          </label>
          <div className="relative">
            <select
              value={electionType}
              onChange={(e) => setElectionType(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pl-12 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer"
            >
              {electionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <CurrentIcon className="text-slate-600" size={20} />
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido dinámico */}
      <div>
        {selectedAnalysis === 'descriptivo' && <AnalisisDescriptivo />}
        {selectedAnalysis === 'predictivo' && <AnalisisPredictivo />}
      </div>
    </div>
  );
};

export default AnalisisEstadistico;