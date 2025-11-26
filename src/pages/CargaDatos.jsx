import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, RefreshCw, Database, Trash2 } from 'lucide-react';

const CargarDatos = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(ext)) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Solo se permiten archivos CSV o Excel (.xlsx, .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload/upload-dataset`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al subir archivo');
      }

      setResult(data);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const getTipoColor = (tipo) => {
    const colors = {
      presidencial: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      regional: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      distrital: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }
    };
    return colors[tipo] || colors.presidencial;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Database size={32} />
          <div>
            <h2 className="text-2xl font-bold">Carga de Datasets</h2>
            <p className="text-sm opacity-90">Sube archivos CSV o Excel con datos electorales</p>
          </div>
        </div>
      </div>

      {/* Zona de carga */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Seleccionar Archivo</h3>
        
        {/* Input File */}
        <div className="mb-4">
          <label className="block w-full">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-slate-500 hover:bg-slate-50'
            }`}>
              <Upload className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-sm text-gray-600 mb-2">
                {file ? (
                  <span className="font-semibold text-green-700">✓ {file.name}</span>
                ) : (
                  'Haz clic o arrastra un archivo aquí'
                )}
              </p>
              <p className="text-xs text-gray-500">Formatos: CSV, XLSX, XLS</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
          >
            {uploading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload size={18} />
                Subir Dataset
              </>
            )}
          </button>

          {(file || result) && (
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Resultado exitoso */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header verde */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} />
              <div>
                <p className="font-bold text-lg">✓ Dataset Procesado Exitosamente</p>
                <p className="text-sm opacity-90">Los datos están listos para limpieza</p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-4">
            {/* Tipo detectado */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Tipo de Elección Detectado:</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getTipoColor(result.tipo_detectado).bg} ${getTipoColor(result.tipo_detectado).text} ${getTipoColor(result.tipo_detectado).border}`}>
                <Database size={16} />
                <span className="font-bold capitalize">{result.tipo_detectado}</span>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 mb-1">Total Filas</p>
                <p className="text-2xl font-bold text-blue-900">{result.estadisticas.total_filas}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 mb-1">Válidos</p>
                <p className="text-2xl font-bold text-green-900">{result.estadisticas.registros_validos}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-700 mb-1">Con Errores</p>
                <p className="text-2xl font-bold text-orange-900">{result.estadisticas.registros_con_errores}</p>
              </div>
            </div>

            {/* Detalles del archivo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Detalles del Archivo:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Nombre:</strong> {result.archivo.nombre}</p>
                <p><strong>Formato:</strong> {result.archivo.tipo}</p>
                <p><strong>Columnas:</strong> {result.archivo.columnas.join(', ')}</p>
                <p><strong>Tabla Destino:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded">{result.tabla_destino}</code></p>
                <p><strong>Batch ID:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">{result.batch_id}</code></p>
              </div>
            </div>

            {/* Progreso */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Éxito de carga</span>
                <span className="font-bold text-green-600">{result.estadisticas.porcentaje_exito}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${result.estadisticas.porcentaje_exito}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-blue-900 mb-2">💡 Instrucciones</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El sistema detecta automáticamente si es elección presidencial, regional o distrital</li>
              <li>• Columnas requeridas: DNI, nombre, candidato, partido, ubicación (departamento/provincia/distrito)</li>
              <li>• Los datos se guardan en una tabla temporal para limpieza</li>
              <li>• Después de la carga, ve a "Detección de Fraudes" para limpiar los datos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargarDatos;