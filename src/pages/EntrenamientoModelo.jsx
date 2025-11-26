import { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Play, Activity, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cambia esto según tu backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EntrenamientoModelo = () => {
    const [modelType, setModelType] = useState('sklearn');
    const [algorithm, setAlgorithm] = useState('logistic');
    const [electionType, setElectionType] = useState('presidencial');
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingHistory, setTrainingHistory] = useState([]);
    const [metricsData, setMetricsData] = useState({
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
    });

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

    const getCurrentAlgorithmName = () => {
        const list = modelType === 'sklearn' ? sklearnAlgorithms : pytorchModels;
        return list.find(a => a.id === algorithm)?.name || algorithm;
    };

    const getElectionTypeLabel = () => {
        const types = {
            presidencial: "Presidencial",
            regional: "Regional",
            distrital: "Distrital"
        };
        return types[electionType];
    };

    // ⭐ Llamada REAL a tu backend FastAPI
    const entrenarModelo = async () => {
        setIsTraining(true);
        setTrainingComplete(false);
        setTrainingProgress(0);

        try {
            // Simulación visual del progreso
            const interval = setInterval(() => {
                setTrainingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);

            // 🌐 Request real al backend
            const response = await axios.post(
                `${API_URL}/api/train/entrenar/${electionType}`
            );

            if (response.data.success) {
                setTrainingComplete(true);

                const { accuracy, precision, recall, f1 } = response.data.metrics;

                setMetricsData({
                    accuracy,
                    precision,
                    recall,
                    f1Score: f1
                });

                const newEntry = {
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    algorithm: getCurrentAlgorithmName(),
                    framework: modelType === "sklearn" ? "Scikit-Learn" : "PyTorch",
                    electionType: getElectionTypeLabel(),
                    accuracy,
                    f1,
                    time: response.data.training_time || "N/A"
                };

                setTrainingHistory(prev => [newEntry, ...prev].slice(0, 8));
            }

        } catch (error) {
            alert(`❌ Error: ${error.response?.data?.detail || "Error desconocido"}`);
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <motion.div className="space-y-6">
            
            {/* HEADER */}
            <motion.div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-6 rounded-xl text-white">
                <div className="flex items-center gap-4">
                    <Brain size={36} />
                    <div>
                        <h2 className="text-2xl font-bold">Entrenamiento de Modelos</h2>
                        <p className="opacity-90 text-sm">Entrena modelos reales desde tu backend</p>
                    </div>
                </div>
            </motion.div>

            {/* FRAMEWORK SELECTOR */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold">Framework</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                        onClick={() => setModelType('sklearn')}
                        className={`p-4 rounded-xl border-2 ${modelType === 'sklearn' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    >
                        🔬 Scikit-Learn
                    </button>

                    <button
                        onClick={() => setModelType('pytorch')}
                        className={`p-4 rounded-xl border-2 ${modelType === 'pytorch' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    >
                        🔥 PyTorch
                    </button>
                </div>
            </div>

            {/* ALGORITHM */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold">Selecciona el Modelo</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {(modelType === 'sklearn' ? sklearnAlgorithms : pytorchModels).map(algo => (
                        <button
                            key={algo.id}
                            onClick={() => setAlgorithm(algo.id)}
                            className={`p-4 border-2 rounded-xl ${algorithm === algo.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                        >
                            <div className="text-3xl">{algo.icon}</div>
                            <p className="mt-2 text-sm font-bold">{algo.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* HYPERPARAMETERS */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold">Tipo de Elección</h3>

                <select
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    className="mt-2 w-full border p-3 rounded-lg"
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
                    className={`w-full p-4 rounded-xl text-white font-bold text-lg 
                        ${isTraining ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}
                    `}
                >
                    {isTraining ? (
                        <div className="flex gap-2 items-center justify-center">
                            <Activity className="animate-spin" />
                            Entrenando...
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
                        <motion.div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Progreso</span>
                                <span>{trainingProgress}%</span>
                            </div>

                            <div className="w-full bg-gray-200 h-3 rounded-full">
                                <motion.div
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                                    style={{ width: `${trainingProgress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TRAINING HISTORY */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold flex gap-2 items-center">
                    <Database size={20} className="text-indigo-600" />
                    Modelos Entrenados
                </h3>

                <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                    {trainingHistory.map(item => (
                        <div key={item.id} className="p-3 border rounded-md bg-indigo-50">
                            <p className="font-bold">{item.algorithm}</p>
                            <p className="text-sm text-gray-600">{item.framework} • {item.electionType}</p>
                            <p className="text-sm font-bold text-green-600">Accuracy: {item.accuracy}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default EntrenamientoModelo;
