import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Download, X, Database, Eye, Trash2, Calendar, Users, BarChart } from 'lucide-react';

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

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'processing',
      progress: 0,
      tipo: getFileType(file.name),
      registros: Math.floor(Math.random() * 100000) + 1000
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simular procesamiento
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
        ));
        
        // Agregar a datasets después del procesamiento
        setTimeout(() => {
          const nuevoDataset = {
            id: Date.now() + index + 1000,
            nombre: file.name.replace(/\.[^/.]+$/, ""), // Remover extensión
            tipo: file.tipo,
            registros: file.registros,
            fechaCarga: new Date().toISOString().split('T')[0],
            tamaño: file.size,
            estado: 'Cargado',
            formato: file.name.split('.').pop().toUpperCase(),
            descripcion: `Dataset cargado desde ${file.name}`
          };
          setDatasets(prev => [nuevoDataset, ...prev]);
        }, 500);
      }, 2000 + (index * 500));
    });
  };

  const getFileType = (filename) => {
    if (filename.toLowerCase().includes('votante') || filename.toLowerCase().includes('padron')) {
      return 'Votantes';
    } else if (filename.toLowerCase().includes('candidato')) {
      return 'Candidatos';
    } else if (filename.toLowerCase().includes('resultado')) {
      return 'Resultados';
    } else {
      return 'General';
    }
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

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Votantes': return <Users className="text-blue-600" size={20} />;
      case 'Candidatos': return <Users className="text-purple-600" size={20} />;
      case 'Resultados': return <BarChart className="text-green-600" size={20} />;
      default: return <Database className="text-gray-600" size={20} />;
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
          <li>• Asegúrese de que los datos incluyan: ID, Nombre, Edad, Distrito</li>
          <li>• Los archivos se procesarán automáticamente después de la carga</li>
        </ul>
      </motion.div>

      {/* Zona de Carga */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cargar Archivos</h3>
        
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
              {uploadedFiles.map((file) => (
                <motion.div 
                  key={file.id} 
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <File className="text-indigo-600" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
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
                        <span className="text-xs">Procesado exitosamente</span>
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
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* SECCIÓN DE DATASETS CARGADOS - ADAPTADA DEL CÓDIGO ANTERIOR */}
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

        {/* Lista de Datasets en formato de tabla/listado */}
        {datasets.length === 0 ? (
          <div className="text-center py-12">
            <Database size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No hay datasets cargados</h3>
            <p className="text-gray-500">Comienza cargando archivos en la sección superior</p>
          </div>
        ) : (
          <div className="space-y-4">
            {datasets.map((dataset) => (
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
                  <Badge variant="outline" className="mr-2">
                    {dataset.formato}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Componente Badge para estilos consistentes
const Badge = ({ variant = 'default', className = '', children }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-white'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default CargaDatos;