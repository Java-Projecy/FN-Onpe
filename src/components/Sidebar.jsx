// sistema-electoral/src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { 
  BarChart3, Database, FileUp, Settings, Users, TrendingUp, 
  LogOut, Menu, X, Vote, UserCheck, Building2, MapPinned,
  FileText, ShieldCheck, ClipboardList, Home, Zap
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, onLogout }) => {
  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    // Llamar la función de logout del padre
    if (onLogout) {
      onLogout();
    }
    
    // Redirigir al landing page usando window.location
    window.location.href = '/';
  };

  const menuSections = [
    {
      title: 'General',
      items: [
        { id: 'dashboard', name: 'Inicio', icon: Home },
      ]
    },
    {
      title: 'Gestión Electoral',
      items: [
        { id: 'candidatos', name: 'Candidatos', icon: UserCheck },
      ]
    },
    {
      title: 'Análisis de Datos',
      items: [
        { id: 'datos', name: 'Gestión de Datos', icon: Database },
        { id: 'carga', name: 'Importar Datos', icon: FileUp },
        { id: 'limpieza', name: 'Detección de Fraudes', icon: Settings },
      ]
    },
    {
      title: 'Entrenamiento',
      items: [
        { id: 'Entrenamiento', name: 'Entrenamiento Modelo', icon: TrendingUp },
        { id: 'analisis', name: 'Análisis Estadístico', icon: TrendingUp },
        { id: 'visualizacion', name: 'Visualización', icon: BarChart3 },
      ]
    },
    {
      title: 'Administración',
      items: [
        { id: 'reportes', name: 'Reportes', icon: FileText },
      ]
    }
  ];

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col relative overflow-hidden`}
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
      }}
    >
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="absolute top-0 left-0 rounded-full"
          style={{
            width: '288px',
            height: '288px',
            background: '#64748b',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: '288px',
            height: '288px',
            background: '#94a3b8',
            filter: 'blur(60px)'
          }}
        />
      </div>

      {/* Header del Sidebar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative p-5 flex items-center justify-between border-b border-gray-200"
      >
        {sidebarOpen && (
<div className="flex items-center gap-3">
  {/* Contenedor del logo */}
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white"
  >
    <img
      src="/Logo/icono.png"
      alt="Logo ONPE"
      className="w-full h-full object-contain"
    />
  </div>

  {/* Texto del encabezado */}
  <div>
    <h1 className="text-xl font-bold text-slate-800">
      ONPE
    </h1>
    <p className="text-xs text-slate-500">Sistema Electoral</p>
  </div>
</div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 text-slate-600"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Menú de Navegación */}
      <nav className="relative flex-1 p-4 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, idx) => (
          <motion.div 
            key={idx} 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            {sidebarOpen && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 px-3 tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.li 
                    key={item.id}
                    whileHover={{ x: 4 }}
                  >
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                        isActive
                          ? 'text-white shadow-sm'
                          : 'text-slate-600 hover:bg-gray-200 hover:text-slate-800'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(90deg, #475569 0%, #64748b 100%)',
                        boxShadow: '0 4px 6px -1px rgba(71, 85, 105, 0.2)'
                      } : {}}
                      title={!sidebarOpen ? item.name : ''}
                    >
                      {isActive && (
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                          }}
                        />
                      )}
                      <Icon 
                        size={20} 
                        className={`relative z-10 ${isActive ? '' : 'group-hover:scale-105 transition-transform'}`} 
                      />
                      {sidebarOpen && (
                        <span className="text-sm font-medium relative z-10">{item.name}</span>
                      )}
                      {isActive && (
                        <div 
                          className="absolute right-0 w-1 h-8 bg-slate-100 rounded-l-full"
                        />
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="relative p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:scale-105 transition-transform" />
          {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;