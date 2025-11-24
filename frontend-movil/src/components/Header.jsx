import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Header(){
  const [role, setRole] = useState(localStorage.getItem('user_role') || '');
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setRole(localStorage.getItem('user_role') || '');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function handleLogout(){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    setRole('');
    navigate('/');
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-indigo-600 font-bold text-lg">Talleres • Gestión</Link>
          <nav className="hidden md:flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Inicio</Link>
            {role === 'Administrador' && (
              <>
                <Link to="/admin/talleres" className="text-gray-600 hover:text-indigo-600">Panel Admin</Link>
                <Link to="/reportes" className="text-gray-600 hover:text-indigo-600">Reportes</Link>
              </>
            )}
            {role === 'Instructor' && (
              <>
                <Link to="/instructor/asistencia" className="text-gray-600 hover:text-indigo-600">Asistencia</Link>
                <Link to="/instructor/talleres" className="text-gray-600 hover:text-indigo-600">Mis Talleres</Link>
              </>
            )}
            {role === 'Alumno' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Talleres</Link>
                <Link to="/mis-inscripciones" className="text-gray-600 hover:text-indigo-600">Mis Inscripciones</Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!role && <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>}
          {role && (
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">{role}</span>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
