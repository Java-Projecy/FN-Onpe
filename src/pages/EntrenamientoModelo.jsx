import { useState, useEffect } from 'react';
import { Brain, Play, Download, Upload, AlertCircle, CheckCircle, TrendingUp, Activity, Zap, Target, BarChart3, Database, Clock, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EntrenamientoModelo = () => {
    const [modelType, setModelType] = useState('sklearn');
    const [algorithm, setAlgorithm] = useState('logistic');
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingHistory, setTrainingHistory] = useState([]);

    const sklearnAlgorithms = [
        { id: 'logistic', name: 'Regresión Logística', icon: '📊' },
        { id: 'random-forest', name: 'Random Forest', icon: '🌳' },
        { id: 'svm', name: 'SVM', icon: '🎯' },
        { id: 'gradient-boosting', name: 'Gradient Boosting', icon: '🚀' }
    ];

    const pytorchModels = [
        { id: 'neural-network', name: 'Red Neuronal', icon: '🧠' },
        { id: 'lstm', name: 'LSTM', icon: '🔄' },
        { id: 'cnn', name: 'CNN', icon: '🖼️' },
        { id: 'transformer', name: 'Transformer', icon: '⚡' }
    ];

    const [metricsData, setMetricsData] = useState({
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
    });

    // Simular historial inicial
    useEffect(() => {
        const initialHistory = [
            { id: 1, date: '2025-11-10 09:15', algorithm: 'Random Forest', framework: 'Scikit-Learn', accuracy: 96.2, f1: 95.8, time: '4.2s' },
            { id: 2, date: '2025-11-10 14:22', algorithm: 'Red Neuronal', framework: 'PyTorch', accuracy: 91.5, f1: 90.9, time: '12.8s' },
            { id: 3, date: '2025-11-11 11:05', algorithm: 'Regresión Logística', framework: 'Scikit-Learn', accuracy: 89.7, f1: 88.3, time: '1.1s' },
        ];
        setTrainingHistory(initialHistory);
    }, []);

    const getCurrentAlgorithmName = () => {
        const list = modelType === 'sklearn' ? sklearnAlgorithms : pytorchModels;
        return list.find(a => a.id === algorithm)?.name || algorithm;
    };

    const handleTraining = () => {
        setIsTraining(true);
        setTrainingComplete(false);
        setTrainingProgress(0);

        const interval = setInterval(() => {
            setTrainingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsTraining(false);
                    setTrainingComplete(true);

                    // Simular métricas aleatorias
                    const accuracy = +(85 + Math.random() * 14).toFixed(1);
                    const precision = +(accuracy - Math.random() * 3).toFixed(1);
                    const recall = +(accuracy - Math.random() * 2).toFixed(1);
                    const f1Score = +(accuracy - Math.random() * 1).toFixed(1);

                    setMetricsData({
                        accuracy,
                        precision,
                        recall,
                        f1Score
                    });

                    const newEntry = {
                        id: Date.now(),
                        date: new Date().toLocaleString('es-ES', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                        algorithm: getCurrentAlgorithmName(),
                        framework: modelType === 'sklearn' ? 'Scikit-Learn' : 'PyTorch',
                        accuracy,
                        f1: f1Score,
                        time: `${(Math.random() * 10 + 1).toFixed(1)}s`
                    };

                    setTrainingHistory(prev => [newEntry, ...prev].slice(0, 8));
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

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
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3
            }
        },
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.2
            }
        }
    };

    const progressVariants = {
        initial: { width: 0 },
        animate: {
            width: `${trainingProgress}%`,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const metricBarVariants = {
        initial: { width: 0 },
        animate: {
            width: "100%",
            transition: {
                duration: 1,
                ease: "easeOut",
                delay: 0.5
            }
        }
    };

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-6 rounded-xl shadow-lg text-white"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="p-3 bg-white bg-opacity-20 rounded-full"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Brain size={32} />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-bold">Entrenamiento de Modelos</h2>
                            <p className="text-sm opacity-90 mt-1">Entrenamiento y evaluación de modelos de Machine Learning</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Selector de Framework */}
            <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Seleccionar Framework</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        variants={cardVariants}
                        whileHover="hover"
                        onClick={() => setModelType('sklearn')}
                        className={`p-6 rounded-xl border-2 transition-all ${modelType === 'sklearn'
                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <motion.div 
                                className="text-5xl"
                                whileHover={{ scale: 1.1 }}
                            >
                                🔬
                            </motion.div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-gray-800">Scikit-Learn</p>
                                <p className="text-sm text-gray-600">Algoritmos clásicos de ML</p>
                            </div>
                        </div>
                    </motion.button>

                    <motion.button
                        variants={cardVariants}
                        whileHover="hover"
                        onClick={() => setModelType('pytorch')}
                        className={`p-6 rounded-xl border-2 transition-all ${modelType === 'pytorch'
                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <motion.div 
                                className="text-5xl"
                                whileHover={{ scale: 1.1 }}
                            >
                                🔥
                            </motion.div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-gray-800">PyTorch</p>
                                <p className="text-sm text-gray-600">Redes neuronales profundas</p>
                            </div>
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* Configuración del Modelo */}
            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Panel de Configuración */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Selección de Algoritmo */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {modelType === 'sklearn' ? 'Algoritmo' : 'Arquitectura'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {(modelType === 'sklearn' ? sklearnAlgorithms : pytorchModels).map((algo) => (
                                <motion.button
                                    key={algo.id}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    onClick={() => setAlgorithm(algo.id)}
                                    className={`p-4 rounded-lg border-2 transition-all ${algorithm === algo.id
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <motion.div 
                                        className="text-3xl mb-2"
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {algo.icon}
                                    </motion.div>
                                    <p className="text-sm font-medium text-gray-800">{algo.name}</p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Hiperparámetros */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Hiperparámetros</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Learning Rate
                                </label>
                                <input
                                    type="number"
                                    defaultValue="0.001"
                                    step="0.0001"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Épocas / Iteraciones
                                </label>
                                <input
                                    type="number"
                                    defaultValue="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch Size
                                </label>
                                <input
                                    type="number"
                                    defaultValue="32"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Train/Test Split
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="0.8">80/20</option>
                                    <option value="0.7">70/30</option>
                                    <option value="0.6">60/40</option>
                                </select>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Botón de Entrenamiento */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <motion.button
                            onClick={handleTraining}
                            disabled={isTraining}
                            whileHover={!isTraining ? { scale: 1.02 } : {}}
                            whileTap={!isTraining ? { scale: 0.98 } : {}}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-bold text-lg transition-all ${isTraining
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isTraining ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Activity size={24} />
                                    </motion.div>
                                    Entrenando Modelo...
                                </>
                            ) : (
                                <>
                                    <Play size={24} />
                                    Iniciar Entrenamiento
                                </>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isTraining && (
                                <motion.div 
                                    className="mt-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Progreso</span>
                                        <span className="font-bold text-indigo-600">{trainingProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                                            variants={progressVariants}
                                            initial="initial"
                                            animate="animate"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Panel Lateral Derecho */}
                <div className="space-y-6">
                    {/* Estado del Modelo */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Estado del Modelo</h3>
                        <div className="space-y-3">
                            <motion.div 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-sm text-gray-600">Framework</span>
                                <span className="font-bold text-gray-800">{modelType === 'sklearn' ? 'Scikit-Learn' : 'PyTorch'}</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-sm text-gray-600">Algoritmo</span>
                                <span className="font-bold text-gray-800">{getCurrentAlgorithmName()}</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-sm text-gray-600">Estado</span>
                                <motion.span 
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${trainingComplete
                                            ? 'bg-green-100 text-green-800'
                                            : isTraining
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                >
                                    {trainingComplete ? 'Entrenado' : isTraining ? 'Entrenando' : 'No Entrenado'}
                                </motion.span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Modelos Entrenados */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Database size={20} className="text-indigo-600" />
                            Modelos Entrenados
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {trainingHistory.length === 0 ? (
                                <motion.p 
                                    className="text-sm text-gray-500 text-center py-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Sin entrenamientos previos
                                </motion.p>
                            ) : (
                                <AnimatePresence>
                                    {trainingHistory.map((model, index) => (
                                        <motion.div
                                            key={model.id}
                                            className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                                            variants={cardVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{model.algorithm}</p>
                                                    <p className="text-xs text-gray-600">{model.framework}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-green-600">{model.accuracy}%</p>
                                                    <p className="text-xs text-indigo-600">F1: {model.f1}%</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {model.date}</span>
                                                <span className="flex items-center gap-1"><Cpu size={12} /> {model.time}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>

                    {/* Consejos */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
                    >
                        <div className="flex items-start gap-3">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 10, 0, -10, 0],
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                            </motion.div>
                            <div>
                                <p className="font-bold text-blue-900 mb-2">Consejos de Entrenamiento</p>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        • Normaliza los datos antes del entrenamiento
                                    </motion.li>
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        • Ajusta el learning rate si hay overfitting
                                    </motion.li>
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        • Usa validación cruzada para mejores resultados
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Historial de Entrenamientos */}
            <AnimatePresence>
                {trainingComplete && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Entrenamientos</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Modelo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Accuracy</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">F1-Score</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tiempo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <motion.tr 
                                        className="hover:bg-gray-50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {new Date().toLocaleString('es-ES')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{getCurrentAlgorithmName()}</td>
                                        <td className="px-4 py-3 text-sm text-green-600 font-bold">{metricsData.accuracy}%</td>
                                        <td className="px-4 py-3 text-sm text-indigo-600 font-bold">{metricsData.f1Score}%</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">2.5s</td>
                                        <td className="px-4 py-3">
                                            <motion.button 
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Ver Detalles
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EntrenamientoModelo;
