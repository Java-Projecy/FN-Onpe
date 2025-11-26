import { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Play, Activity, Database, TrendingUp, Award, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Configuración de API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EntrenamientoModelo = () => {
    const [modelType, setModelType] = useState('classification');
    const [algorithm, setAlgorithm] = useState('random_forest');
    const [electionType, setElectionType] = useState('presidencial');
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingHistory, setTrainingHistory] = useState([]);
    const [currentModel, setCurrentModel] = useState(null);
    const [error, setError] = useState(null);

    // Cargar modelos activos al iniciar
    useEffect(() => {
        cargarModelosActivos();
    }, []);

    const cargarModelosActivos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/train/modelos-activos`);
            console.log("📊 Modelos activos:", response.data);
        } catch (error) {
            console.error("Error cargando modelos:", error);
        }
    };

    const sklearnAlgorithms = [
        { id: 'random_forest', name: 'Random Forest', icon: '🌳' },
        { id: 'logistic_regression', name: 'Regresión Logística', icon: '📊' },
        { id: 'gradient_boosting', name: 'Gradient Boosting', icon: '🚀' }
    ];

    const getCurrentAlgorithmName = () => {
        const algo = sklearnAlgorithms.find(a => a.id === algorithm);
        return algo ? algo.name : algorithm;
    };

    const getElectionTypeLabel = () => {
        const types = {
            presidencial: "Presidencial",
            regional: "Regional",
            distrital: "Distrital"
        };
        return types[electionType];
    };

    // ⭐ FUNCIÓN REAL - Conexión con backend y base de datos
    const entrenarModelo = async () => {
        setIsTraining(true);
        setTrainingComplete(false);
        setTrainingProgress(0);
        setError(null);

        let progressInterval;

        try {
            // Simulación visual del progreso
            progressInterval = setInterval(() => {
                setTrainingProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            console.log(`🎯 Iniciando entrenamiento real: ${algorithm} para ${electionType}`);

            // 🌐 REQUEST REAL AL BACKEND
            const response = await axios.post(
                `${API_URL}/api/train/entrenar/${electionType}`,
                {}, // Body vacío como espera el backend actual
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000 // 2 minutos de timeout
                }
            );

            // ✅ Limpiar intervalo
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setTrainingProgress(100);

            console.log("✅ Respuesta del backend:", response.data);

            if (response.data.success) {
                setTrainingComplete(true);

                // Extraer métricas de la respuesta real
                const responseData = response.data;
                
                setCurrentModel({
                    modelo_activo: responseData.modelo_activo,
                    metricas: responseData.metricas,
                    participacion_estimada: responseData.participacion_estimada,
                    feature_importance: responseData.feature_importance,
                    training_time: responseData.training_time
                });

                // Agregar al historial
                const newEntry = {
                    id: Date.now(),
                    date: new Date().toLocaleString('es-PE'),
                    algorithm: getCurrentAlgorithmName(),
                    framework: "Scikit-Learn",
                    electionType: getElectionTypeLabel(),
                    accuracy: responseData.metricas.accuracy,
                    f1: responseData.metricas.f1_score,
                    time: responseData.training_time
                };

                setTrainingHistory(prev => [newEntry, ...prev].slice(0, 8));
            } else {
                throw new Error(response.data.error || "Error desconocido del backend");
            }

        } catch (error) {
            console.error("❌ Error en entrenamiento real:", error);
            
            // ✅ Limpiar intervalo en caso de error
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            setTrainingProgress(0);
            
            let errorMessage = "Error al entrenar el modelo";
            
            if (error.response) {
                // Error del servidor con respuesta
                const errorData = error.response.data;
                console.error('📋 Datos del error:', errorData);
                
                if (errorData.detail) {
                    // Manejar errores de validación
                    if (Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
                    } else {
                        errorMessage = errorData.detail;
                    }
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else {
                    errorMessage = `Error ${error.response.status}: ${JSON.stringify(errorData)}`;
                }
            } else if (error.request) {
                // No hubo respuesta del servidor
                errorMessage = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en " + API_URL;
            } else {
                // Error en la configuración
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setIsTraining(false);
        }
    };

    // ✅ Función para diagnosticar problemas
    

    // ✅ Función para limpiar errores
    const limpiarError = () => {
        setError(null);
    };

    return (
        <motion.div className="space-y-6 max-w-7xl mx-auto p-4">
            
            {/* HEADER */}

            {/* ERROR DISPLAY */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                                <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={22} />
                                <div className="flex-1">
                                    <p className="font-bold text-red-800">Error del Sistema</p>
                                    <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
                                </div>
                            </div>
                            <button 
                                onClick={limpiarError}
                                className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FRAMEWORK SELECTOR */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Tipo de Modelo</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setModelType('classification')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            modelType === 'classification' 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-300'
                        }`}
                    >
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="font-bold">Clasificación</p>
                        <p className="text-xs text-gray-600 mt-1">Predecir candidato ganador</p>
                    </button>

                    <button
                        onClick={() => setModelType('regression')}
                        disabled
                        className="p-4 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed"
                    >
                        <div className="text-3xl mb-2">📈</div>
                        <p className="font-bold">Regresión</p>
                        <p className="text-xs text-gray-600 mt-1">En desarrollo</p>
                    </button>
                </div>
            </div>

            {/* ALGORITHM SELECTOR */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Selecciona el Algoritmo</h3>
                <div className="grid grid-cols-3 gap-4">
                    {sklearnAlgorithms.map(algo => (
                        <button
                            key={algo.id}
                            onClick={() => setAlgorithm(algo.id)}
                            className={`p-4 border-2 rounded-xl transition-all ${
                                algorithm === algo.id 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-gray-300'
                            }`}
                        >
                            <div className="text-3xl">{algo.icon}</div>
                            <p className="mt-2 text-sm font-bold">{algo.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* ELECTION TYPE SELECTOR */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Tipo de Elección</h3>
                <select
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    className="w-full border p-3 rounded-lg font-medium"
                >
                    <option value="presidencial">🗳️ Presidencial</option>
                    <option value="regional">📍 Regional</option>
                    <option value="distrital">👥 Distrital</option>
                </select>
            </div>

            {/* TRAIN BUTTON */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <motion.button
                    onClick={entrenarModelo}
                    disabled={isTraining}
                    className={`w-full p-4 rounded-xl text-white font-bold text-lg transition-all ${
                        isTraining 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    }`}
                    whileHover={!isTraining ? { scale: 1.02 } : {}}
                    whileTap={!isTraining ? { scale: 0.98 } : {}}
                >
                    {isTraining ? (
                        <div className="flex gap-2 items-center justify-center">
                            <Activity className="animate-spin" />
                            Entrenando modelo...
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center justify-center">
                            <Play />
                            Entrenar Modelo
                        </div>
                    )}
                </motion.button>

                {/* PROGRESS BAR */}
                <AnimatePresence>
                    {isTraining && (
                        <motion.div 
                            className="mt-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex justify-between text-sm mb-1">
                                <span>Progreso</span>
                                <span>{trainingProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trainingProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* RESULTS */}
            <AnimatePresence>
                {trainingComplete && currentModel && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-6 rounded-xl border shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="text-green-600" size={32} />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">¡Entrenamiento Completado!</h3>
                                <p className="text-sm text-gray-600">Modelo: {currentModel.modelo_activo}</p>
                                {currentModel.training_time && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tiempo de entrenamiento: {currentModel.training_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <TrendingUp className="text-blue-600 mx-auto mb-2" size={24} />
                                <p className="text-sm text-blue-700 font-medium">Accuracy</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {typeof currentModel.metricas.accuracy === 'number' 
                                        ? (currentModel.metricas.accuracy * 100).toFixed(1) + '%'
                                        : currentModel.metricas.accuracy}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <Award className="text-green-600 mx-auto mb-2" size={24} />
                                <p className="text-sm text-green-700 font-medium">Precision</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {typeof currentModel.metricas.precision === 'number' 
                                        ? (currentModel.metricas.precision * 100).toFixed(1) + '%'
                                        : currentModel.metricas.precision}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <Activity className="text-purple-600 mx-auto mb-2" size={24} />
                                <p className="text-sm text-purple-700 font-medium">Recall</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {typeof currentModel.metricas.recall === 'number' 
                                        ? (currentModel.metricas.recall * 100).toFixed(1) + '%'
                                        : currentModel.metricas.recall}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <Database className="text-orange-600 mx-auto mb-2" size={24} />
                                <p className="text-sm text-orange-700 font-medium">F1-Score</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {typeof currentModel.metricas.f1_score === 'number' 
                                        ? (currentModel.metricas.f1_score * 100).toFixed(1) + '%'
                                        : currentModel.metricas.f1_score}
                                </p>
                            </div>
                        </div>

                        {/* Feature Importance */}
                        {currentModel.feature_importance && Object.keys(currentModel.feature_importance).length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold text-gray-800 mb-3">Importancia de Features</h4>
                                <div className="space-y-2">
                                    {Object.entries(currentModel.feature_importance)
                                        .slice(0, 5)
                                        .map(([label, value], idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{label}</span>
                                                <span className="font-bold text-purple-700">
                                                    {(parseFloat(value) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full">
                                                <motion.div
                                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${parseFloat(value) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Participación Estimada */}
                        {currentModel.participacion_estimada && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                                <h4 className="font-bold text-gray-800 mb-2">Participación Estimada</h4>
                                <p className="text-2xl font-bold text-green-700">
                                    {currentModel.participacion_estimada}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TRAINING HISTORY */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold flex gap-2 items-center mb-4">
                    <Database size={20} className="text-indigo-600" />
                    Historial de Entrenamientos
                </h3>

                {trainingHistory.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay entrenamientos todavía</p>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {trainingHistory.map(item => (
                            <div key={item.id} className="p-3 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.algorithm}</p>
                                        <p className="text-sm text-gray-600">{item.framework} • {item.electionType}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">Accuracy: {item.accuracy}</p>
                                        <p className="text-xs text-gray-600">F1: {item.f1}</p>
                                        {item.time && <p className="text-xs text-gray-500 mt-1">{item.time}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EntrenamientoModelo;