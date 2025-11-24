// Controlador simple de notificaciones/avisos
// Devuelve una lista estática de avisos para desarrollo local.

const getNotificaciones = (req, res) => {
  const user = req.user || {};
  const rol = user.rol || 'Alumno';

  // Ejemplos de notificaciones; en producción estas vendrían de una tabla DB o un servicio externo
  const notices = [
    { id: 1, titulo: 'Cambio de horario', texto: 'El taller de Fotografía se mueve a 15:00 el jueves.', roles: ['Alumno','Instructor','Administrador'], fecha: '2025-11-01' },
    { id: 2, titulo: 'Recordatorio de pago', texto: 'Recuerda completar el pago del taller de Robótica.', roles: ['Alumno'], fecha: '2025-11-05' },
    { id: 3, titulo: 'Reunión de coordinación', texto: 'Reunión de coordinación académica el lunes a las 10:00.', roles: ['Administrador','Instructor'], fecha: '2025-11-03' },
  ];

  // Filtrar por rol del usuario
  const visibles = notices.filter(n => n.roles.includes(rol));
  res.json(visibles);
};

module.exports = { getNotificaciones };
