import React from 'react';
import RoleCard from '../components/RoleCard';

export default function WelcomePage() {
  return (
    <div className="px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Bienvenido a Talleres</h1>
        <p className="text-gray-500 mt-2">Selecciona tu rol para continuar</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <RoleCard
          role="Alumno"
          title="Acceso Estudiante"
          description="Explora talleres, inscríbete y realiza pagos."
        />

        <RoleCard
          role="Instructor"
          title="Portal del Instructor"
          description="Administra asistencias y revisa participantes."
        />

        <RoleCard
          role="Administrador"
          title="Panel Administrativo"
          description="Gestiona talleres, inscripciones y reportes."
        />
      </section>
    </div>
  );
}
