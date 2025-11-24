import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import { FiUser, FiBook, FiShield } from 'react-icons/fi';

export default function RoleCard({ role, title, description }) {
  const to = `/login?role=${encodeURIComponent(role)}`;

  // Selección de ícono según rol
  const renderIcon = () => {
    const iconProps = { className: 'h-16 w-16 text-white' }; // ícono grande y blanco

    switch (role) {
      case 'Alumno':
        return (
          <div className="bg-blue-500 rounded-full p-4 flex items-center justify-center">
            <FiBook {...iconProps} />
          </div>
        );
      case 'Instructor':
        return (
          <div className="bg-green-500 rounded-full p-4 flex items-center justify-center">
            <FiUser {...iconProps} />
          </div>
        );
      case 'Administrador':
        return (
          <div className="bg-red-500 rounded-full p-4 flex items-center justify-center">
            <FiShield {...iconProps} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-400 rounded-full p-4 flex items-center justify-center">
            <FiUser {...iconProps} />
          </div>
        );
    }
  };

  return (
    <Link to={to}>
      <Card className="p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="flex flex-col gap-4 items-center text-center">
          {renderIcon()} {/* Ícono centrado y grande */}

          <div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">{role}</div>
            <h3 className="mt-2 text-xl font-semibold text-gray-700">{title}</h3>
          </div>

          <p className="text-gray-500">{description}</p>

          <div className="mt-3 w-full">
            <Button variant="primary" fullWidth>
              Ingresar como {role}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
