import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Download, X, Database, Eye, Trash2, Calendar, Users, BarChart, Vote, MapPin } from 'lucide-react';

const CargaDatos = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [datasets, setDatasets] = useState([
    {
      id: 2,
      nombre: 'Votos Presidenciales',
      registros: 8,
      fechaCarga: '2024-01-14',
      tamaño: '1.1 MB',
      estado: 'Cargado',
      formato: 'CSV',
      tipo: 'presidencial',
      descripcion: 'Información de candidatos a presidencia y vicepresidencia'
    },
  ]);
  const [dragActive, setDragActive] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Función para detectar el tipo de elección del dataset
  const detectElectionType = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let headers = [];
          
          // Detectar formato y extraer headers
          if (file.name.endsWith('.csv')) {
            const lines = content.split('\n');
            headers = lines[0].toLowerCase().split(',').map(h => h.trim());
          } else if (file.name.endsWith('.json')) {
            const jsonData = JSON.parse(content);
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              headers = Object.keys(jsonData[0]).map(h => h.toLowerCase());
            }
          }
          
          // Palabras clave para cada tipo de elección
          const keywordMap = {
            presidencial: ['presidente', 'vicepresidente', 'nacional', 'presidencial', 'votopresidencial'],
            regional: ['region', 'gobernador', 'regional', 'votoregional', 'provincia'],
            distrital: ['distrito', 'alcalde', 'distrital', 'votodistrital', 'municipal']
          };
          
          // Detectar tipo basándose en las columnas
          let detectedType = 'general';
          let maxMatches = 0;
          
          for (const [type, keywords] of Object.entries(keywordMap)) {
            const matches = headers.filter(header => 
              keywords.some(keyword => header.includes(keyword))
            ).length;
            
            if (matches > maxMatches) {
              maxMatches = matches;
              detectedType = type;
            }
          }
          
          resolve(detectedType);
        } catch (error) {
          console.error('Error detectando tipo:', error);
          resolve('general');
        }
      };
      
      reader.readAsText(file);
    });
  };

  const handleFiles = async (files) => {
    const filesArray = Array.from(files);
    
    // Procesar archivos de forma asíncrona para detectar tipo
    const newFilesPromises = filesArray.map(async (file, index) => {
      const detectedType = await detectElectionType(file);
      
      return {
        id: Date.now() + index,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'processing',
        progress: 0,
        tipo: detectedType,
        registros: Math.floor(Math.random() * 10000) + 5000,
        file: file
      };
    });
    
    const newFiles = await Promise.all(newFilesPromises);
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simular procesamiento
    newFiles.forEach((fileData, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'success', progress: 100 } : f
        ));
        
        // Agregar a datasets después del procesamiento
        setTimeout(() => {
          const nuevoDataset = {
            id: Date.now() + index + 1000,
            nombre: fileData.name.replace(/\.[^/.]+$/, ""),
            tipo: fileData.tipo,
            tipoEleccion: fileData.tipo,
            registros: fileData.registros,
            fechaCarga: new Date().toISOString().split('T')[0],
            tamaño: fileData.size,
            estado: 'Cargado',
            formato: fileData.name.split('.').pop().toUpperCase(),
            descripcion: `Dataset ${fileData.tipo} cargado desde ${fileData.name}`
          };
          
          // Guardar en localStorage para Detección de Fraudes
          const datasetsTemporales = JSON.parse(localStorage.getItem('datasetsTemporales') || '[]');
          
          const datasetTemporal = {
            id: nuevoDataset.id,
            nombre: nuevoDataset.nombre,
            tipo_eleccion: fileData.tipo,
            registros_totales: fileData.registros,
            registros_validos: Math.floor(fileData.registros * 0.92),
            registros_duplicados: Math.floor(fileData.registros * 0.05),
            registros_con_errores: Math.floor(fileData.registros * 0.03),
            fecha_carga: new Date().toISOString(),
            estado: 'Pendiente',
            formato: nuevoDataset.formato
          };
          
          datasetsTemporales.push(datasetTemporal);
          localStorage.setItem('datasetsTemporales', JSON.stringify(datasetsTemporales));
          
          setDatasets(prev => [nuevoDataset, ...prev]);
        }, 500);
      }, 2000 + (index * 500));
    });
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const deleteDataset = (id) => {
    setDatasets(datasets.filter(dataset => dataset.id !== id));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Cargado': return 'bg-green-100 text-green-800';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Instrucciones */}
      <motion.div 
        variants={itemVariants}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-blue-900 mb-2">Instrucciones de Carga</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Formatos aceptados: CSV, XLSX, JSON</li>
          <li>• Tamaño máximo por archivo: 50 MB</li>
          <li>• El sistema detectará automáticamente si es presidencial, regional o distrital</li>
          <li>• Los archivos se procesarán automáticamente después de la carga</li>
        </ul>
      </motion.div>

      {/* Zona de Carga */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cargar Archivos</h3>
        
        {/* Información sobre detección automática */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Database className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Detección Automática de Tipo</p>
              <p>El sistema analizará automáticamente tus archivos para detectar si contienen datos presidenciales, regionales o distritales basándose en las columnas del dataset.</p>
            </div>
          </div>
        </div>
        
        <form 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="mb-6"
        >
          <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Arrastra y suelta tus archivos aquí
            </h4>
            <p className="text-sm text-gray-500 mb-4">o</p>
            <label className="inline-block">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Seleccionar Archivos
              </span>
              <input
                type="file"
                multiple
                onChange={handleChange}
                className="hidden"
                accept=".csv,.xlsx,.json"
              />
            </label>
          </div>
        </form>

        {/* Archivos Cargados */}
        {uploadedFiles.length > 0 && (
          <div>
            <h4 className="text-md font-bold text-gray-800 mb-3">Archivos en Proceso</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const tipoColors = {
                  presidencial: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
                  regional: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
                  distrital: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
                  general: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
                };
                
                const colors = tipoColors[file.tipo] || tipoColors.general;
                
                return (
                  <motion.div 
                    key={file.id} 
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <File className="text-indigo-600" size={24} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {file.tipo.charAt(0).toUpperCase() + file.tipo.slice(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{file.size}</span>
                      </div>
                      {file.status === 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      )}
                      {file.status === 'success' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-xs">Procesado exitosamente - Detectado como {file.tipo}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Datasets Cargados */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Datasets Cargados</h3>
            <p className="text-sm text-gray-600">Gestione y visualice todos los datasets del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{datasets.length} datasets</span>
          </div>
        </div>

        {datasets.length === 0 ? (
          <div className="text-center py-12">
            <Database size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No hay datasets cargados</h3>
            <p className="text-gray-500">Comienza cargando archivos en la sección superior</p>
          </div>
        ) : (
          <div className="space-y-4">
            {datasets.map((dataset) => {
              const tipoConfig = {
                presidencial: { 
                  icon: Vote, 
                  color: 'blue',
                  bgClass: 'bg-blue-100',
                  textClass: 'text-blue-800',
                  borderClass: 'border-blue-300'
                },
                regional: { 
                  icon: MapPin, 
                  color: 'green',
                  bgClass: 'bg-green-100',
                  textClass: 'text-green-800',
                  borderClass: 'border-green-300'
                },
                distrital: { 
                  icon: Users, 
                  color: 'purple',
                  bgClass: 'bg-purple-100',
                  textClass: 'text-purple-800',
                  borderClass: 'border-purple-300'
                }
              };
              
              const config = tipoConfig[dataset.tipo] || {
                icon: Database,
                color: 'gray',
                bgClass: 'bg-gray-100',
                textClass: 'text-gray-800',
                borderClass: 'border-gray-300'
              };
              
              const IconComponent = config.icon;
              
              return (
                <motion.div 
                  key={dataset.id} 
                  variants={itemVariants}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${
                      dataset.formato === 'CSV' 
                        ? 'bg-blue-100 text-blue-600' 
                        : dataset.formato === 'XLSX'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <File size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-gray-800 text-lg">{dataset.nombre}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(dataset.estado)}`}>
                          {dataset.estado}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.bgClass} ${config.textClass} border ${config.borderClass}`}>
                          <IconComponent size={12} />
                          {dataset.tipo.charAt(0).toUpperCase() + dataset.tipo.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dataset.descripcion}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart size={14} />
                          {dataset.registros.toLocaleString()} filas
                        </span>
                        <span className="flex items-center gap-1">
                          <Database size={14} />
                          {dataset.tamaño}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(dataset.fechaCarga)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 border border-gray-300 text-gray-700 bg-white rounded text-xs font-medium">
                      {dataset.formato}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CargaDatos;