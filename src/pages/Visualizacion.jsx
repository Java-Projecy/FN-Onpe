import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  RefreshCw, ChevronDown, Vote, MapPin, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const Visualizacion = () => {
  const [activeChart, setActiveChart] = useState('barras');
  const [electionType, setElectionType] = useState('presidencial');

  // Opciones del selector de elección
  const electionOptions = [
    { value: 'presidencial', label: 'Presidencial', icon: Vote },
    { value: 'regional', label: 'Regional', icon: MapPin },
    { value: 'distrital', label: 'Distrital', icon: Users },
  ];

  const currentElectionIcon = electionOptions.find(opt => opt.value === electionType)?.icon || Vote;

  // Datos de ejemplo (puedes hacerlos dinámicos después según electionType)
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

  const chartTypes = [
    { id: 'barras', name: 'Gráfico de Barras', icon: '📊' },
    { id: 'lineas', name: 'Gráfico de Líneas', icon: '📈' },
    { id: 'pie', name: 'Gráfico Circular', icon: '🥧' },
    { id: 'comparativo', name: 'Comparativo', icon: '📉' },
  ];

  // Componentes de gráficos
  const BarrasChart = () => (
    <motion.div
      key="barras"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Distribución por Edad</h3>
          <span className="text-sm text-gray-600">Total: 67,330 votantes</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataEdad}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rango" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="cantidad" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Votantes por Distrito</h3>
          <span className="text-sm text-gray-600">Top 5 regiones</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataDistrito} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="nombre" type="category" stroke="#6b7280" width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Tendencia de Registros Mensuales</h3>
        <span className="text-sm text-gray-600">2024</span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataTendencia}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Legend />
          <Line type="monotone" dataKey="registros" stroke="#6366f1" strokeWidth={4} dot={{ fill: '#6366f1', r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  const PieChartComponent = () => (
    <motion.div
    key="pie"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución Porcentual por Región</h3>
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={130}
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

      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle por Región</h3>
        <div className="space-y-3">
          {dataPie.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{item.value}%</p>
                <p className="text-xs text-gray-600">
                  {Math.round((item.value / 100) * 125430).toLocaleString()} votantes
                </p>
              </div>
            </div>
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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Comparación por Distrito</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dataDistrito}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="nombre" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="valor" fill="#6366f1" name="Votantes 2026" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { color: 'blue', title: 'Tasa de Participación', value: '82.5%', desc: '+5.2% vs. 2021' },
          { color: 'purple', title: 'Promedio por Distrito', value: '24,086', desc: 'Votantes registrados' },
          { color: 'pink', title: 'Crecimiento Mensual', value: '+18.3%', desc: 'Últimos 6 meses' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 p-6 rounded-xl text-white shadow-lg`}
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
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Selector de Tipo de Gráfico */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Visualización</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartTypes.map((chart) => (
            <motion.button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center ${
                activeChart === chart.id
                  ? 'border-slate-500 bg-slate-50 shadow-md'
                  : 'border-gray-200 hover:border-slate-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-3">{chart.icon}</div>
              <p className="text-sm font-semibold text-gray-800">{chart.name}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* BARRA DE ACCIONES: Actualizar + Selector de Elección */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          className="flex items-center gap-3 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-all shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} className="animate-spin-slow" />
          Actualizar Datos
        </motion.button>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 hidden sm:block">Tipo de elección:</span>
          <div className="relative">
            <select
              value={electionType}
              onChange={(e) => setElectionType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-11 pr-10 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all cursor-pointer hover:border-slate-400 shadow-sm"
            >
              {electionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <currentElectionIcon className="text-slate-600" size={20} />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráficos dinámicos */}
      <div>
        {activeChart === 'barras' && <BarrasChart />}
        {activeChart === 'lineas' && <LineasChart />}
        {activeChart === 'pie' && <PieChartComponent />}
        {activeChart === 'comparativo' && <ComparativoChart />}
      </div>

      {/* Resumen rápido */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen General</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { color: 'indigo', title: 'Total Registrados', value: '125,430' },
            { color: 'emerald', title: 'Activos', value: '98,234' },
            { color: 'amber', title: 'Pendientes', value: '15,896' },
            { color: 'purple', title: 'Distritos', value: '25' },
            { color: 'rose', title: 'Edad Media', value: '38.5 años' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`text-center p-5 bg-${stat.color}-50 rounded-xl border border-${stat.color}-200`}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className={`text-sm font-medium text-${stat.color}-800`}>{stat.title}</p>
              <p className={`text-2xl font-bold text-${stat.color}-900 mt-1`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Visualizacion;