import { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Download, X, Database, Eye, Trash2, Calendar, Users, BarChart, Vote, MapPin, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CargaDatos = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [datasetsTemporales, setDatasetsTemporales] = useState([
    {
      id: 1,
      nombre: 'Datos Electorales Lima',
      registros: 1250,
      fechaCarga: '2024-01-20',
      tamaño: '850 KB',
      estado: 'Pendiente',
      formato: 'CSV',
      tipo: 'presidencial',
      descripcion: 'Dataset de votos presidenciales detectado automáticamente'
    }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [processingFile, setProcessingFile] = useState(null);

  // ============================================
  // FUNCIÓN PRINCIPAL: DETECTAR TIPO DE CSV
  // ============================================
  const detectarTipoEleccion = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const lines = content.split('\n');
          
          if (lines.length === 0) {
            resolve('general');
            return;
          }

          // Obtener headers (primera línea)
          const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
          
          console.log('🔍 Headers detectados:', headers);

          // ============================================
          // PALABRAS CLAVE POR TIPO DE ELECCIÓN
          // ============================================
          const keywordMap = {
            presidencial: [
              'presidente', 'vicepresidente', 'nacional', 
              'presidencial', 'voto_presidencial', 'candidato_presidencial',
              'presidente_id', 'vicepresidente_id', 'partido_nacional'
            ],
            regional: [
              'region', 'gobernador', 'regional', 
              'voto_regional', 'candidato_regional', 'provincia',
              'gobernador_regional', 'consejo_regional', 'region_id'
            ],
            distrital: [
              'distrito', 'alcalde', 'distrital', 
              'voto_distrital', 'candidato_distrital', 'municipal',
              'alcalde_distrital', 'regidor', 'concejo_municipal', 'distrito_id'
            ]
          };

          // ============================================
          // ANÁLISIS DE CONTENIDO (primeras 5 filas)
          // ============================================
          const sampleData = lines.slice(1, 6).join('\n').toLowerCase();
          
          console.log('📄 Muestra de datos:', sampleData.substring(0, 200));

          // ============================================
          // DETECTAR TIPO BASÁNDOSE EN HEADERS + CONTENIDO
          // ============================================
          let detectedType = 'general';
          let maxMatches = 0;

          for (const [type, keywords] of Object.entries(keywordMap)) {
            // Contar coincidencias en headers
            const headerMatches = headers.filter(header =>
              keywords.some(keyword => header.includes(keyword))
            ).length;

            // Contar coincidencias en contenido
            const contentMatches = keywords.filter(keyword =>
              sampleData.includes(keyword)
            ).length;

            const totalMatches = headerMatches + contentMatches;

            console.log(`📊 ${type}: ${totalMatches} coincidencias (headers: ${headerMatches}, contenido: ${contentMatches})`);

            if (totalMatches > maxMatches) {
              maxMatches = totalMatches;
              detectedType = type;
            }
          }

          // ============================================
          // ANÁLISIS ADICIONAL SI NO HAY COINCIDENCIAS CLARAS
          // ============================================
          if (maxMatches === 0) {
            console.log('⚠️ No se encontraron palabras clave, analizando estructura...');
            
            // Si tiene columnas de ubicación múltiple (región, provincia, distrito)
            // probablemente sea regional
            if (headers.includes('region') || headers.includes('provincia')) {
              detectedType = 'regional';
            } 
            // Si solo tiene distrito
            else if (headers.includes('distrito') || headers.includes('alcalde')) {
              detectedType = 'distrital';
            }
            // Por defecto: presidencial
            else if (headers.includes('candidato') || headers.includes('voto')) {
              detectedType = 'presidencial';
            }
          }

          console.log(`✅ Tipo detectado: ${detectedType} (${maxMatches} coincidencias)`);
          
          resolve(detectedType);

        } catch (error) {
          console.error('❌ Error detectando tipo:', error);
          resolve('general');
        }
      };

      reader.onerror = () => {
        console.error('❌ Error leyendo archivo');
        resolve('general');
      };

      reader.readAsText(file);
    });
  };

  // ============================================
  // PROCESAR ARCHIVO Y GUARDAR EN TABLA TEMPORAL (BACKEND)
  // ============================================
  const procesarArchivo = async (file) => {
    console.log('📁 Procesando archivo:', file.name);
    
    setProcessingFile(file.name);

    try {
      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);

      // Enviar al backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      const response = await fetch(`${API_URL}/api/upload/upload-csv`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al procesar archivo');
      }

      const resultado = await response.json();
      
      console.log('✅ Respuesta del backend:', resultado);

      // Crear dataset temporal con datos reales del backend
      const nuevoDataset = {
        id: Date.now(),
        nombre: file.name.replace(/\.[^/.]+$/, ""),
        tipo: resultado.tipo_detectado,
        tipo_eleccion: resultado.tipo_detectado,
        registros_totales: resultado.estadisticas.total_filas,
        registros_validos: resultado.estadisticas.registros_validos,
        registros_duplicados: 0, // Se calculará en limpieza
        registros_con_errores: resultado.estadisticas.registros_con_errores,
        fecha_carga: new Date().toISOString(),
        estado: 'Pendiente',
        formato: file.name.split('.').pop().toUpperCase(),
        tamaño: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        batch_id: resultado.batch_id,
        tabla_destino: resultado.tabla_destino,
        descripcion: `Dataset ${resultado.tipo_detectado} detectado automáticamente - ${resultado.estadisticas.porcentaje_exito}% válido`
      };

      // Guardar en localStorage
      const datasetsGuardados = JSON.parse(localStorage.getItem('datasetsTemporales') || '[]');
      datasetsGuardados.push(nuevoDataset);
      localStorage.setItem('datasetsTemporales', JSON.stringify(datasetsGuardados));

      // Actualizar estado
      setDatasetsTemporales(prev => [nuevoDataset, ...prev]);

      setProcessingFile(null);

      return nuevoDataset;

    } catch (error) {
      console.error('❌ Error procesando archivo:', error);
      setProcessingFile(null);
      alert(`Error: ${error.message}`);
      throw error;
    }
  };

  // ============================================
  // HANDLERS DE DRAG & DROP
  // ============================================
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const filesArray = Array.from(files);

    for (const file of filesArray) {
      // Agregar a lista de archivos procesándose
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'processing',
        progress: 0,
        file: file
      };

      setUploadedFiles(prev => [...prev, fileData]);

      // Simular progreso
      setTimeout(() => {
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, progress: 30 } : f)
        );
      }, 500);

      setTimeout(() => {
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, progress: 60 } : f)
        );
      }, 1000);

      // Procesar archivo
      try {
        const resultado = await procesarArchivo(file);

        setTimeout(() => {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileData.id
                ? { ...f, status: 'success', progress: 100, tipo: resultado.tipo }
                : f
            )
          );
        }, 1500);

      } catch (error) {
        console.error('Error procesando archivo:', error);
        setTimeout(() => {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileData.id
                ? { ...f, status: 'error', progress: 0 }
                : f
            )
          );
        }, 1500);
      }
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const deleteDataset = (id) => {
    // Eliminar de estado
    setDatasetsTemporales(prev => prev.filter(d => d.id !== id));
    
    // Eliminar de localStorage
    const datasetsGuardados = JSON.parse(localStorage.getItem('datasetsTemporales') || '[]');
    const datasetsActualizados = datasetsGuardados.filter(d => d.id !== id);
    localStorage.setItem('datasetsTemporales', JSON.stringify(datasetsActualizados));
  };

  // Mapeo de colores por tipo
  const tipoColors = {
    presidencial: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: Vote },
    regional: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: MapPin },
    distrital: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Users },
    general: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Database }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Instrucciones Mejoradas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <Database className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              🤖 Detección Automática Inteligente
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              El sistema analiza automáticamente el contenido de tu CSV y lo clasifica como:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200">
                <Vote className="text-blue-600" size={18} />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Presidencial</p>
                  <p className="text-xs text-blue-700">Presidente, vicepresidente, nacional</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200">
                <MapPin className="text-green-600" size={18} />
                <div>
                  <p className="font-semibold text-green-900 text-sm">Regional</p>
                  <p className="text-xs text-green-700">Región, gobernador, provincia</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200">
                <Users className="text-purple-600" size={18} />
                <div>
                  <p className="font-semibold text-purple-900 text-sm">Distrital</p>
                  <p className="text-xs text-purple-700">Distrito, alcalde, municipal</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-3">
              ✅ El sistema lee las columnas y contenido del archivo para clasificarlo correctamente
            </p>
          </div>
        </div>
      </motion.div>

      {/* Zona de Carga */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cargar Archivos CSV</h3>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="mb-6"
        >
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Arrastra tu archivo CSV aquí
            </h4>
            <p className="text-sm text-gray-500 mb-4">o</p>
            <label className="inline-block">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Seleccionar Archivo
              </span>
              <input
                type="file"
                multiple
                onChange={handleChange}
                className="hidden"
                accept=".csv"
              />
            </label>
            <p className="text-xs text-gray-500 mt-4">
              El sistema detectará automáticamente si es presidencial, regional o distrital
            </p>
          </div>
        </div>

        {/* Archivos en Proceso */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-md font-bold text-gray-800 mb-3">Archivos en Proceso</h4>
              <div className="space-y-3">
                {uploadedFiles.map((file) => {
                  const colors = tipoColors[file.tipo || 'general'];
                  const IconComponent = colors.icon;

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <File className="text-indigo-600 flex-shrink-0" size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            {file.status === 'success' && file.tipo && (
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border} flex items-center gap-1 flex-shrink-0`}
                              >
                                <IconComponent size={12} />
                                {file.tipo}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {file.size}
                          </span>
                        </div>

                        {file.status === 'processing' && (
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600">
                              Analizando contenido... {file.progress}%
                            </p>
                          </div>
                        )}

                        {file.status === 'success' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <span className="text-xs">
                              ✅ Detectado como <strong>{file.tipo}</strong>
                            </span>
                          </div>
                        )}

                        {file.status === 'error' && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={16} />
                            <span className="text-xs">Error al procesar</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Datasets Temporales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Datasets Temporales</h3>
            <p className="text-sm text-gray-600">
              Archivos listos para limpieza y procesamiento
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {datasetsTemporales.length} dataset(s)
            </span>
          </div>
        </div>

        {datasetsTemporales.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Database size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No hay datasets pendientes</p>
            <p className="text-sm text-gray-500 mt-1">
              Carga un archivo CSV para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {datasetsTemporales.map((dataset) => {
              const config = tipoColors[dataset.tipo];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <File className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-gray-800 text-lg truncate">
                          {dataset.nombre}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dataset.estado === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {dataset.estado}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.bg} ${config.text} border ${config.border}`}
                        >
                          <IconComponent size={12} />
                          {dataset.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dataset.descripcion}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart size={14} />
                          {dataset.registros_totales?.toLocaleString() || dataset.registros?.toLocaleString()} registros
                        </span>
                        <span className="flex items-center gap-1">
                          <Database size={14} />
                          {dataset.tamaño}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(dataset.fecha_carga || dataset.fechaCarga).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-1 border border-gray-300 text-gray-700 bg-white rounded text-xs font-medium">
                      {dataset.formato}
                    </span>
                    <button
                      onClick={() => deleteDataset(dataset.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Indicador de Procesamiento */}
      <AnimatePresence>
        {processingFile && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-2xl border-2 border-indigo-500 flex items-center gap-3 z-50"
          >
            <RefreshCw className="text-indigo-600 animate-spin" size={24} />
            <div>
              <p className="font-bold text-gray-800">Analizando archivo...</p>
              <p className="text-sm text-gray-600">{processingFile}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CargaDatos;