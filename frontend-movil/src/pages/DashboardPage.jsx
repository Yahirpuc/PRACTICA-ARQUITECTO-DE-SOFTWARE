import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Eliminamos las importaciones de librerías externas para evitar errores de compilación.

// --- Definiciones de Íconos SVG en línea (Reemplazo de react-icons) ---

const IconSVG = ({ children, size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const IconPlus = (props) => (
  <IconSVG {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </IconSVG>
);
const IconSearch = (props) => (
  <IconSVG {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </IconSVG>
);
const IconReload = (props) => (
  <IconSVG {...props}>
    <path d="M21.5 2v6h-6"></path>
    <path d="M2.5 22v-6h6"></path>
    <path d="M21 13a9 9 0 1 1-6.72-9"></path>
  </IconSVG>
);
const IconUsers = (props) => (
  <IconSVG {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </IconSVG>
);
const IconFilter = (props) => (
  <IconSVG {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </IconSVG>
);
const IconEnroll = (props) => (
  <IconSVG {...props}>
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </IconSVG>
); // Icono para Inscribirse/Enroll
const IconPayment = (props) => (
  <IconSVG {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
    <line x1="14" y1="14" x2="18" y2="14"></line>
  </IconSVG>
); // Icono para Pagar
const IconClose = (props) => (
  <IconSVG {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </IconSVG>
);
const IconCalendar = (props) => (
  <IconSVG {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </IconSVG>
);
const IconPin = (props) => (
  <IconSVG {...props}>
    <path d="M12 22s-8-4.5-8-12a8 8 0 0 1 16 0c0 7.5-8 12-8 12z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </IconSVG>
);
const IconHome = (props) => (
  <IconSVG {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </IconSVG>
);
const IconUser = (props) => (
  <IconSVG {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </IconSVG>
);
const IconSettings = (props) => (
  <IconSVG {...props}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.43a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.43a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.43a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.43a1.65 1.65 0 0 0-1.51 1z"></path>
  </IconSVG>
);


// --- Componentes Mock para hacer el código autocontenido y ejecutable ---
const Card = ({ children, className }) => (
  <div className={`bg-white p-4 shadow-md rounded-xl ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled }) => {
  let baseStyle = 'transition-colors font-semibold rounded-lg focus:outline-none focus:ring-4 flex items-center justify-center gap-2';
  let sizeStyle = '';
  let variantStyle = '';

  // Ajuste de tamaño de botones para móvil
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1 text-xs';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-sm'; // Tamaño ideal para móvil
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-base';
      break;
    default:
      sizeStyle = 'px-4 py-2 text-sm';
  }

  // Estilos Material Design-like
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-blue-300';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300';
      break;
    case 'outline':
      variantStyle = 'bg-white text-blue-600 border border-blue-400 hover:bg-blue-50 focus:ring-blue-300 shadow-sm';
      break;
    default:
      variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-blue-300';
  }
  
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed shadow-none' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};
// ------------------------------------------------------------------------

// --- Componente Toast Notification (Reutilizado) ---
const ToastNotification = ({ toast, onClose }) => {
  const [visible, setVisible] = useState(false);

  // Define los estilos y contenido para cada tipo de notificación
  const typeStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  const typeIcon = {
    success: '✓', 
    error: '✕', 
    info: 'ℹ', 
  };
  
  // Lógica para mostrar y ocultar automáticamente
  useEffect(() => {
    if (toast && toast.text) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Esperar la transición de salida antes de limpiar el estado
        setTimeout(onClose, 300); 
      }, 4000); // Muestra por 4 segundos

      return () => clearTimeout(timer);
    }
  }, [toast]); 

  if (!toast || !toast.text) return null;

  // Usa la transición de Tailwind para una entrada/salida suave
  const animationClass = visible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-full';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 ease-out 
                  max-w-xs w-full p-4 rounded-xl shadow-2xl flex items-center space-x-3
                  ${typeStyles[toast.type || 'info']} ${animationClass}`}
    >
      <div className="text-xl font-bold">{typeIcon[toast.type || 'info']}</div>
      <div className="flex-1 font-medium">{toast.text}</div>
      <button onClick={() => setVisible(false)} className="opacity-75 hover:opacity-100 focus:outline-none">
        <IconClose size={18} className="text-white" />
      </button>
    </div>
  );
};
// ------------------------------------------------------------------------

// --- Componente de Tarjeta Móvil (Optimizado para Touch y Legibilidad) ---
const TallerCard = ({ taller, userRole, handleInscripcion, handlePayment }) => {
  const isAvailable = taller.cuposDisponibles > 0;
  const isStudent = userRole === 'Alumno';
  
  const dateFormatted = new Date(taller.fecha).toLocaleDateString('es-ES', { 
    weekday: 'short', month: 'short', day: 'numeric' 
  });

  return (
    // Ajuste de padding y sombra para toque móvil
    <Card className="shadow-lg border border-gray-100 p-4 active:bg-blue-50 transition duration-150"> 
      <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-extrabold text-gray-900">{taller.nombre}</h2> {/* Texto optimizado */}
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
            isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
          {isAvailable ? 'Disponible' : 'Lleno'}
        </span>
      </div>
      
      {/* Detalles del Taller - Usando texto sm */}
      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <p className="flex items-center gap-3">
          <IconCalendar size={18} className="text-blue-600"/> 
          <span className="font-medium">Fecha:</span> {dateFormatted}
        </p>
        <p className="flex items-center gap-3">
          <IconPin size={18} className="text-blue-600"/> 
          <span className="font-medium">Sede:</span> {taller.sede || 'N/A'}
        </p>
        <p className="flex items-center gap-3">
          <IconUsers size={18} className="text-blue-600"/> 
          <span className="font-medium">Cupos:</span> {taller.cuposDisponibles || 0}
        </p>
      </div>

      {/* Botones de Acción - Flex horizontal para móvil, más robustos */}
      <div className="flex justify-between gap-3 pt-3 border-t border-gray-200">
        <Button 
            onClick={() => handleInscripcion(taller.id)} 
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!isAvailable || !isStudent}
        >
            <IconEnroll size={18} />
            Inscribirse
        </Button>
        <Button 
            onClick={() => handlePayment(taller.id)} 
            variant="outline"
            size="md"
            className="flex-1"
        >
            <IconPayment size={18} />
            Pagar
        </Button>
      </div>
    </Card>
  );
};
// ------------------------------------------------------------------------

// --- Componente de Navegación Inferior (Bottom Navbar - Android Native) ---
const BottomNavbar = () => {
    // Simulación de navegación con iconos y efectos de Material Design
    const [activeTab, setActiveTab] = useState('home');

    const NavItem = ({ icon: Icon, label, tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ease-in-out
                        ${activeTab === tabName 
                            ? 'text-blue-600' // Color primario para activo
                            : 'text-gray-500 hover:text-blue-400' // Color secundario para inactivo
                        }`}
        >
            <Icon size={24} className="mb-0.5" />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-xl z-30 flex justify-around sm:hidden">
            <NavItem icon={IconHome} label="Inicio" tabName="home" />
            <NavItem icon={IconSearch} label="Buscar" tabName="search" />
            <NavItem icon={IconUser} label="Perfil" tabName="profile" />
            <NavItem icon={IconSettings} label="Menú" tabName="menu" />
        </div>
    );
};
// ------------------------------------------------------------------------


const API_BASE_URL = 'http://localhost:3000/api';

function DashboardPage() {
  const [talleres, setTalleres] = useState([]);
  const [toast, setToast] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  
  const userRole = localStorage.getItem('user_role');
  const getToken = () => localStorage.getItem('auth_token');

  // Helper para mostrar el toast
  const showToast = useCallback((text, type = 'success') => {
    setToast({ text, type, id: Date.now() });
  }, []);

  const handleCloseToast = () => setToast(null);


  const fetchTalleres = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/talleres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTalleres(response.data);
      showToast('Talleres cargados exitosamente.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cargar talleres. Intente de nuevo.', 'error');
    }
  };

  useEffect(() => {
    fetchTalleres();
  }, [showToast]);

  const handleInscripcion = async (tallerId) => {
    if (userRole !== 'Alumno') {
      showToast('Solo los alumnos pueden inscribirse.', 'error');
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/inscripciones`,
        { tallerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Inscripción exitosa. Revisando estado de pago...', 'success');
      fetchTalleres(); // Refrescar lista
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al inscribirse.', 'error');
    }
  };

  const handlePayment = async (tallerId) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/pagos/iniciar`,
        { tallerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirigir al link real de pago
      window.location.href = response.data.redirectUrl;
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al iniciar el pago. Intente de nuevo.', 'error');
    }
  };
  
  const handleRefresh = () => {
      showToast('Actualizando lista de talleres...');
      fetchTalleres();
  };
  
  const handleToggleFilter = () => {
      setFilterActive(!filterActive);
      showToast(filterActive ? 'Filtros desactivados.' : 'Filtros ACTIVOS (Mostrando solo talleres con cupo).', 'info');
  };
  
  // Lógica de filtrado y búsqueda
  const filteredTalleres = talleres
    .filter(taller => {
        // Asumiendo que `taller` tiene `nombre`, `sede` o `descripcion` para buscar
        const matchesSearch = taller.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (taller.sede && taller.sede.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Filtro: solo mostrar talleres si hay cupos disponibles
        const matchesFilter = filterActive ? (taller.cuposDisponibles > 0) : true;
        
        return matchesSearch && matchesFilter;
    });


  return (
    // Padding en la parte inferior (pb-24) para dar espacio al BottomNavbar fijo en móvil
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen pb-24 sm:pb-6">
      
      {/* Título y Barra de Búsqueda (Mejorados para móvil) */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Dashboard de Talleres
      </h1>

      {/* Barra de Control: Búsqueda, Actualizar, Filtros (Adaptado a móvil) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Input de Búsqueda (Más alto para tocar) */}
        <div className="relative flex-grow">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Ajuste de padding vertical (py-2.5) para mejor área de toque
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
          />
        </div>

        {/* Botones de acción en fila */}
        <div className="flex gap-3">
            {/* Botón de Actualizar */}
            <Button 
            variant="secondary" 
            onClick={handleRefresh} 
            className="hover:bg-gray-300 flex-shrink-0"
            size="md"
            >
            <IconReload size={18} />
            </Button>

            {/* Botón de Filtros */}
            <Button
            variant={filterActive ? 'primary' : 'outline'}
            onClick={handleToggleFilter}
            className={`font-semibold flex-shrink-0 ${filterActive ? '' : 'text-gray-700 border-gray-300'}`}
            size="md"
            >
            <IconFilter size={18} />
            {filterActive ? 'Activo' : 'Filtrar'}
            </Button>
        </div>
      </div>
      
      {/* VISTA MÓVIL (Lista de tarjetas - por defecto) */}
      <div className="block sm:hidden space-y-4">
        {filteredTalleres.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-500 text-base">
            No hay talleres disponibles que coincidan con los criterios.
          </p>
        ) : (
          filteredTalleres.map((taller) => (
            <TallerCard
              key={taller.id}
              taller={taller}
              userRole={userRole}
              handleInscripcion={handleInscripcion}
              handlePayment={handlePayment}
            />
          ))
        )}
      </div>


      {/* VISTA TABLET/ESCRITORIO (Tabla - oculta en pantallas pequeñas) */}
      <Card className="hidden sm:block overflow-hidden p-0 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700 hidden sm:table-cell">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Cupos
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTalleres.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-lg">
                    No hay talleres disponibles que coincidan con los criterios.
                  </td>
                </tr>
              ) : (
                filteredTalleres.map((taller) => (
                  <tr key={taller.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {taller.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(taller.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          taller.cuposDisponibles <= 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                        <IconUsers size={16} /> {taller.cuposDisponibles || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                            onClick={() => handleInscripcion(taller.id)} 
                            variant="primary"
                            size="sm"
                            disabled={taller.cuposDisponibles <= 0 || userRole !== 'Alumno'}
                        >
                            <IconEnroll size={16} />
                            Inscribirse
                        </Button>
                        <Button 
                            onClick={() => handlePayment(taller.id)} 
                            variant="outline"
                            size="sm"
                        >
                            <IconPayment size={16} />
                            Pagar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* NAVEGACIÓN INFERIOR (Solo en móvil) */}
      <BottomNavbar />

      {/* RENDERIZADO DEL TOAST */}
      <ToastNotification toast={toast} onClose={handleCloseToast} />
    </div>
  );
}

export default DashboardPage;