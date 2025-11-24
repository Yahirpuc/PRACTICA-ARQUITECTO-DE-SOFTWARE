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
const IconClose = (props) => (
  <IconSVG {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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
const IconTeacher = (props) => (
  <IconSVG {...props}>
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"></path>
    <polyline points="3.29 6.78 12 11.5 20.71 6.78"></polyline>
    <path d="M12 22V11.5"></path>
  </IconSVG>
); // Blackboard/Cube as Teacher
const IconUsers = (props) => (
  <IconSVG {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </IconSVG>
);
const IconEdit = (props) => (
  <IconSVG {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </IconSVG>
);
const IconTrash = (props) => (
  <IconSVG {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </IconSVG>
);
const IconFilter = (props) => (
  <IconSVG {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </IconSVG>
);

// --- Componentes Mock para hacer el código autocontenido y ejecutable ---
const Card = ({ children, className }) => (
  <div className={`bg-white p-6 shadow-xl rounded-xl ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '' }) => {
  let baseStyle = 'transition-colors font-medium rounded-lg focus:outline-none focus:ring-4 ';
  let sizeStyle = '';
  let variantStyle = '';

  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1 text-sm';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2';
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-lg';
      break;
    default:
      sizeStyle = 'px-4 py-2';
  }

  switch (variant) {
    case 'primary':
      variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300';
      break;
    default:
      variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};
// ------------------------------------------------------------------------

// --- Componente Modal Personalizado (Cierre al hacer clic en fondo implementado) ---
const CustomModal = ({ isOpen, onRequestClose, children, title, isEditing }) => {
  if (!isOpen) return null;

  // Implementa el cierre del modal cuando se hace click en el fondo (overlay).
  const handleOverlayClick = (e) => {
    // Solo llama a onRequestClose si el click fue directamente en el div del overlay (e.target === e.currentTarget)
    if (e.target === e.currentTarget) {
      onRequestClose();
    }
  };

  return (
    // Overlay: Oscurecido y difuminado
    <div 
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-start z-40 transition-opacity duration-300 p-4"
      onClick={handleOverlayClick} // Manejador de click en el fondo
    >
      {/* Contenido del Modal */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-auto mt-[10vh] outline-none z-50 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {title}
          </h3>
          {/* Botón de cierre explícito */}
          <IconClose
            size={24}
            className="cursor-pointer text-gray-500 hover:text-gray-900 transition"
            onClick={onRequestClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
};
// ------------------------------------------------------------------------

// --- Componente Toast Notification (Personalizado para no usar librerías) ---
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
  }, [toast]); // Depende del objeto toast completo

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

const API_BASE_URL = 'http://localhost:3000/api';

function AdminTalleresPage() {
  const [talleres, setTalleres] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaller, setCurrentTaller] = useState(null);
  const [tallerForm, setTallerForm] = useState({
    nombre: '',
    descripcion: '',
    cupo_maximo: 0,
    sede: '',
  });
  // Se añade searchTerm y filterActive para que el filtro y la búsqueda funcionen
  const [searchTerm, setSearchTerm] = useState(''); // CORRECCIÓN: Inicialización de searchTerm
  const [filterActive, setFilterActive] = useState(false);
  const [toast, setToast] = useState(null); 

  const getToken = () => localStorage.getItem('auth_token');

  // Helper para mostrar el toast
  const showToast = useCallback((text, type = 'success') => {
    // Usamos Date.now() como ID único para forzar la re-renderización y activar el useEffect del Toast
    setToast({ text, type, id: Date.now() });
  }, []);

  // Función para cerrar el toast después de la transición
  const handleCloseToast = () => setToast(null);

  const fetchTalleres = async () => {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_BASE_URL}/talleres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTalleres(response.data);
    } catch (err) {
      showToast('Error al cargar talleres. Acceso denegado o sesión expirada.', 'error');
    }
  };

  useEffect(() => {
    fetchTalleres();
  }, [showToast]);

  // Handlers de la tabla
  const handleCreateClick = () => {
    setIsEditing(false);
    setTallerForm({ nombre: '', descripcion: '', cupo_maximo: 0, sede: '' });
    setCurrentTaller(null);
    setModalOpen(true);
  };

  const handleEditClick = (taller) => {
    setIsEditing(true);
    setTallerForm({ ...taller });
    setCurrentTaller(taller);
    setModalOpen(true);
  };

  const handleDelete = async (tallerId) => {
    try {
      const token = getToken();
      
      await axios.delete(`${API_BASE_URL}/talleres/${tallerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast(`Taller con ID ${tallerId} eliminado correctamente.`);
      fetchTalleres(); 
    } catch (err) {
       showToast(err.response?.data?.message || `Error al eliminar el taller con ID ${tallerId}.`, 'error');
    }
  };

  const handleRefresh = () => {
    showToast('Actualizando lista de talleres...');
    fetchTalleres();
  };
  
  const handleToggleFilter = () => {
      setFilterActive(!filterActive);
      showToast(filterActive ? 'Filtros desactivados.' : 'Filtros ACTIVOS (Simulación: Mostrando solo cupos llenos).', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (isEditing) {
        // Lógica real de edición (PUT)
        await axios.put(`${API_BASE_URL}/talleres/${currentTaller.id}`, tallerForm, {
           headers: { Authorization: `Bearer ${token}` },
         });
        showToast(`Taller actualizado: ${tallerForm.nombre}`);
      } else {
        // Lógica real de creación (POST)
        await axios.post(`${API_BASE_URL}/talleres`, tallerForm, {
           headers: { Authorization: `Bearer ${token}` },
         });
        showToast(`Taller creado: ${tallerForm.nombre}`);
      }
      
      setModalOpen(false);
      fetchTalleres(); 
    } catch (err) {
      showToast(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} taller.`, 'error');
    }
  };

  const handleChange = (e) =>
    setTallerForm({ ...tallerForm, [e.target.name]: e.target.value });
    
  // Filtrar y buscar talleres
  const filteredTalleres = talleres
    .filter(taller => {
        const matchesSearch = taller.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              taller.sede.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterActive ? (taller.cupo_actual === taller.cupo_maximo) : true;
        
        return matchesSearch && matchesFilter;
    });


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Título más grande */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Gestión de Talleres
      </h1>

      {/* Barra de Control: Búsqueda, Actualizar, Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Input de Búsqueda */}
        <div className="relative flex-grow">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        {/* Botón de Actualizar */}
        <Button 
          variant="secondary" 
          onClick={handleRefresh} 
          className="flex items-center justify-center gap-2 hover:bg-gray-300"
        >
          <IconReload size={18} />
          Actualizar
        </Button>

        {/* Botón de Filtros (Simulación de Toggle) */}
        <Button
          variant={filterActive ? 'primary' : 'secondary'}
          onClick={handleToggleFilter}
          className={`flex items-center justify-center gap-2 ${filterActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`}
        >
          <IconFilter size={16} />
          {filterActive ? 'Filtro (Activo)' : 'Filtros'}
        </Button>
      </div>

      {/* Tabla Mejorada */}
      <Card className="overflow-hidden p-0 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700 hidden md:table-cell">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Cupo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700 hidden sm:table-cell">
                  Sede
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTalleres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-lg">
                    No se encontraron talleres con los criterios actuales.
                  </td>
                </tr>
              ) : (
                filteredTalleres.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <IconTeacher className="text-blue-500" size={18} />
                        {t.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {t.descripcion ? `${t.descripcion.substring(0, 50)}...` : 'Sin descripción'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          t.cupo_actual === t.cupo_maximo 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                        <IconUsers size={16} /> {t.cupo_actual || 0}/{t.cupo_maximo || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {t.sede}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleEditClick(t)}
                          variant="secondary"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200"
                        >
                          <IconEdit size={16} />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(t.id)}
                          variant="secondary"
                          size="sm"
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-100 hover:bg-red-200"
                        >
                          <IconTrash size={16} />
                          Eliminar
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

      {/* Botón flotante para crear */}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:bg-blue-700 transition transform hover:scale-105 z-30"
      >
        <IconPlus size={28} />
      </button>

      {/* Uso del CustomModal */}
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title={isEditing ? 'Editar Taller' : 'Crear Nuevo Taller'}
        isEditing={isEditing}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            value={tallerForm.nombre}
            onChange={handleChange}
            placeholder="Nombre del Taller"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            name="descripcion"
            value={tallerForm.descripcion}
            onChange={handleChange}
            placeholder="Descripción detallada"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="cupo_maximo"
            value={tallerForm.cupo_maximo}
            onChange={handleChange}
            placeholder="Cupo máximo"
            required
            min="1"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            name="sede"
            value={tallerForm.sede}
            onChange={handleChange}
            placeholder="Sede (Ej: Virtual, Principal, Laboratorio)"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
          />

          <Button type="submit" variant="primary" className="w-full mt-6">
            {isEditing ? 'Guardar Cambios' : 'Crear Taller'}
          </Button>
        </form>
      </CustomModal>
      
      {/* RENDERIZADO DEL TOAST */}
      <ToastNotification toast={toast} onClose={handleCloseToast} />
    </div>
  );
}

export default AdminTalleresPage;