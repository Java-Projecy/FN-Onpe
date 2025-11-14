import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Settings, Maximize2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Visualizacion = () => {
  const [activeChart, setActiveChart] = useState('barras');

  // Datos para gráficos
  const dataEdad = [
    { rango: '18-25', cantidad: 12430 },
    { rango: '26-35', cantidad: 23450 },
    { rango: '36-45', cantidad: 18920 },
    { rango: '46-55', cantidad: 9840 },
    { rango: '56+', cantidad: 2690 },
  ];

  const dataDistrito = [
    { nombre: 'Lima', valor: 45230 },
    { nombre: 'Callao', valor: 28450 },
    { nombre: 'Arequipa', valor: 18920 },
    { nombre: 'Cusco', valor: 15340 },
    { nombre: 'Trujillo', valor: 12490 },
  ];

  const dataTendencia = [
    { mes: 'Ene', registros: 8500 },
    { mes: 'Feb', registros: 9200 },
    { mes: 'Mar', registros: 11800 },
    { mes: 'Abr', registros: 10500 },
    { mes: 'May', registros: 13200 },
    { mes: 'Jun', registros: 15800 },
  ];

  const dataPie = [
    { name: 'Lima', value: 36.1, color: '#6366f1' },
    { name: 'Callao', value: 22.7, color: '#8b5cf6' },
    { name: 'Arequipa', value: 15.1, color: '#ec4899' },
    { name: 'Cusco', value: 12.2, color: '#f59e0b' },
    { name: 'Otros', value: 13.9, color: '#10b981' },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const chartTypes = [
    { id: 'barras', name: 'Gráfico de Barras', icon: '📊' },
    { id: 'lineas', name: 'Gráfico de Líneas', icon: '📈' },
    { id: 'pie', name: 'Gráfico Circular', icon: '🥧' },
    { id: 'comparativo', name: 'Comparativo', icon: '📉' },
  ];

  // Animaciones
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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Componentes de gráficos
  const BarrasChart = () => (
    <motion.div
      key="barras"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Gráfico de Barras - Edad */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Distribución por Edad</h3>
          <span className="text-sm text-gray-600">Total: 67,330</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataEdad}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rango" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="cantidad" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de Barras - Distrito */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Votantes por Distrito</h3>
          <span className="text-sm text-gray-600">Top 5</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataDistrito} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="nombre" type="category" stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="valor" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );

  const LineasChart = () => (
    <motion.div
      key="lineas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Tendencia de Registros Mensuales</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">2024</span>
          <motion.select 
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.02 }}
          >
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </motion.select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataTendencia}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="registros" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  const PieChartComponent = () => (
    <motion.div
      key="pie"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Gráfico Circular */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución Porcentual</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Leyenda y Detalles */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle por Región</h3>
        <div className="space-y-3">
          {dataPie.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 1)" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{item.value}%</p>
                <p className="text-xs text-gray-600">
                  {Math.round((item.value / 100) * 125430).toLocaleString()} votantes
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const ComparativoChart = () => (
    <motion.div
      key="comparativo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Gráfico Comparativo */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Comparación Multi-Dimensional</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dataDistrito}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="nombre" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="valor" fill="#6366f1" name="Votantes Registrados" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Comparación de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { color: 'blue', title: 'Tasa de Participación', value: '82.5%', desc: '+5.2% vs. año anterior' },
          { color: 'purple', title: 'Promedio por Distrito', value: '24,086', desc: 'Votantes registrados' },
          { color: 'pink', title: 'Crecimiento Mensual', value: '+18.3%', desc: 'Últimos 6 meses' }
        ].map((metric, index) => (
          <motion.div 
            key={index}
            className={`bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 p-6 rounded-xl shadow-sm text-white`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <p className="text-sm opacity-90 mb-2">{metric.title}</p>
            <p className="text-3xl font-bold mb-1">{metric.value}</p>
            <p className="text-xs opacity-75">{metric.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Selector de Tipo de Gráfico */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Visualización</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartTypes.map((chart, index) => (
            <motion.button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeChart === chart.id
                  ? 'border-slate-500 bg-slate-50'
                  : 'border-gray-200 hover:border-slate-300'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className="text-3xl mb-2"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {chart.icon}
              </motion.div>
              <p className="text-sm font-medium text-gray-800">{chart.name}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Controles de Visualización */}
      <motion.div 
        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <RefreshCw size={18} />
            <span className="hidden md:inline">Actualizar</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </motion.div>

      {/* Gráficos */}
      <div>
        {activeChart === 'barras' && <BarrasChart />}
        {activeChart === 'lineas' && <LineasChart />}
        {activeChart === 'pie' && <PieChartComponent />}
        {activeChart === 'comparativo' && <ComparativoChart />}
      </div>

      {/* Panel de Estadísticas Rápidas */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen de Datos</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { color: 'blue', title: 'Total', value: '125,430' },
            { color: 'green', title: 'Activos', value: '98,234' },
            { color: 'yellow', title: 'Pendientes', value: '15,896' },
            { color: 'purple', title: 'Distritos', value: '25' },
            { color: 'pink', title: 'Edad Media', value: '38.5' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className={`text-center p-4 bg-${stat.color}-50 rounded-lg`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className={`text-sm text-${stat.color}-800 font-medium`}>{stat.title}</p>
              <p className={`text-2xl font-bold text-${stat.color}-900`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Visualizacion;   
